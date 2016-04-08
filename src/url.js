(function(jstiny) {

    jstiny.addQueryParam = function(obj, name, value) {
        var expr = jstiny.expression(name), current = expr.get(obj);
        if (current === undefined) {
            expr.set(obj, value);
            return;
        }
        if (jstiny.isArray(current)) {
            current.push(value);
        } else {
            expr.set(obj, [ current, value ]);
        }
    };

    jstiny.parseQueryParams = function(queryString) {
        var params = queryString.split("&"), i, name, value, result = {};
        for (i = 0; i < params.length; i++) {
            pair = params[i].split("=");
            name = decodeURIComponent(pair[0]);
            value = pair.length > 1 ? decodeURIComponent(pair[1]) : null;
            jstiny.addQueryParam(result, name, value);
        }
        return result;
    };

    jstiny.formatQueryParams = function(object) {


    };


    function UrlBuilder(url) {
        var paramsIndex = url.lastIndexOf("?");
        this.path = paramsIndex < 0 ? url : url.substring(0, paramsIndex);
        this.queryParams = paramsIndex < 0 ? {} : jstiny.parseQueryParams(url.substring(paramsIndex + 1));
    }

    UrlBuilder.prototype.params = function(query) {
        if (query === undefined) {
            return this.queryParams;
        }

        this.queryParams = {};
        jstiny.copy(query, { target: this.queryParams });
        return this;
    };
    UrlBuilder.prototype.has = function(name) {
        return jstiny.expression(name).exists(this.queryParams);
    };
    UrlBuilder.prototype.param = function(name) {
        return jstiny.expression(name).get(this.queryParams);
    };
    UrlBuilder.prototype.add = function(name, value) {

        var current, self = this;
        if (jstiny.isObject(name)) {
            jstiny.each(name, function(v,k) { self.add(k,v); });
            return this;
        }
        if (name in this.queryParams) {
            current = this.queryParams[name];
            if (!jstiny.isArray(current)) {
                current = [ current ];
                this.queryParams[name] = current;
            }
            if (value != null) {
                jstiny.each(value, function(v) {
                    current.push(v);
                });
            } else {
                current.push(value);
            }
        } else {
            this.queryParams[name] = jstiny.copy(value);
        }
        return this;
    };
    UrlBuilder.prototype.remove = function(name) {
        delete this.queryParams[name];
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
        var keys = Object.keys(this.queryParams),
            key, value, i, j, pairs = [];

        keys.sort();
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            value = this.queryParams[key];
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