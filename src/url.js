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

    UrlBuilder.queryParam = function(key, value) {
        var result = encodeURIComponent(key);
        if (value != null) {
            result += "=" + encodeURIComponent(value);
        }
        return result;
    };
    UrlBuilder.prototype.path = function(value) {
        if (value == null) {
            return this.path;
        }
        this.path = value;
        return this;
    };
    UrlBuilder.prototype.params = function(value) {
        if (value == null) {
            return this.values;
        }
        this.values = value;
        return this;
    };
    UrlBuilder.prototype.has = function(name) {
        return name in this.values;
    };
    UrlBuilder.prototype.param = function(name) {
        return name in this.values ? this.values[name] : undefined;
    };
    UrlBuilder.prototype.add = function(name, value) {
        var current;
        if (value === undefined) {
            value = null;
        }
        if (name in this.values) {
            current = this.values[name];
            if (!jstiny.isArray(current)) {
                current = [current];
                this.values[name] = current;
            }
            jstiny.each(value, function(v) {
                current.push(v);
            });
        } else {
            this.values[name] = value;
        }
        return this;
    };
    UrlBuilder.prototype.remove = function(name) {
        delete this.values[name];
        return this;
    };
    UrlBuilder.prototype.get = function() {
        var keys = Object.keys(this.values),
            key, value, i, j, pairs = [];

        keys.sort();
        for (i=0;i<keys.length;i++) {
            key = keys[i];
            value = this.values[key];
            if (jstiny.isArrayLike(value)) {
                for (j=0; j<value.length; j++) {
                    pairs.push(UrlBuilder.queryParam(key, value[j]));
                }
            } else {
                pairs.push(UrlBuilder.queryParam(key, value));
            }
        }
        return pairs.length > 0 ? this.path + "?" + pairs.join("&") : this.path;
    };

    jstiny.url = function(str) {
    	return new UrlBuilder(str);
    };

})(jstiny);