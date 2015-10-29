(function(jstiny) {
	

    function UrlBuilder(url) {
        var paramsIndex = url.lastIndexOf("?"), params, pair, i;

        this.path = paramsIndex < 0 ? url : url.substring(0, paramsIndex);
        this.values = {};

        if (paramsIndex >= 0) {
            params = url.substring(paramsIndex+1).split("&");
            for (i=0;i<params.length;i++) {
                pair = params[i].split("=");
                this.add(
                    decodeURIComponent(pair[0]),
                    pair.length > 1 ? decodeURIComponent(pair[1]) : null);
            }
        }
    }

    UrlBuilder.prototype.path = function(value) {
        if (value === undefined) {
            return this.path;
        }
        this.path = value;
        return this;
    };
    UrlBuilder.prototype.params = function(value) {
        if (value === undefined) {
            return this.values;
        }
        jstiny.copy(value, {target: this.values });
        return this;
    };
    UrlBuilder.prototype.has = function(name) {
        return name in this.values;
    };
    UrlBuilder.prototype.param = function(name) {
        return name in this.values ? this.values[name] : undefined;
    };
    UrlBuilder.prototype.add = function(name, value) {

        var current, self = this;
        if (jstiny.isObject(name)) {
            jstiny.each(name, function(v,k) { self.add(k,v); });
            return this;
        }
        if (name in this.values) {
            current = this.values[name];
            if (!jstiny.isArray(current)) {
                current = [ current ];
                this.values[name] = current;
            }
            if (value != null) {
                jstiny.each(value, function(v) {
                    current.push(v);
                });
            } else {
                current.push(value);
            }
        } else {
            this.values[name] = jstiny.copy(value);
        }
        return this;
    };
    UrlBuilder.prototype.remove = function(name) {
        delete this.values[name];
        return this;
    };

    function addPair(key, value, pairs, opts) {
        var pair = encodeURIComponent(key);
        if (value != null) {
            if (jstiny.isDate(value) && opts != null && jstiny.isFunction(opts.dateFormat)) {
                value = opts.dateFormat(value);
            }
            pair += "=" + encodeURIComponent(value);
        } else if (opts == null || !opts.nulls) {
            return;
        }
        pairs.push(pair);
    }

    UrlBuilder.prototype.get = function(opts) {
        var keys = Object.keys(this.values),
            key, value, i, j, pairs = [];

        keys.sort();
        for (i=0;i<keys.length;i++) {
            key = keys[i];
            value = this.values[key];
            if (jstiny.isArrayLike(value)) {
                for (j=0; j<value.length; j++) {
                    addPair(key, value[j], pairs, opts);
                }
            } else {
                addPair(key, value, pairs, opts);
            }
        }
        return pairs.length > 0 ? this.path + "?" + pairs.join("&") : this.path;
    };

    jstiny.url = function(str) {
    	return new UrlBuilder(str);
    };

})(jstiny);