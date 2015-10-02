/**
 * Created by Vyacheslav Mayorov on 31.08.15.
 * Simple JS utilities without any *mandatory* dependencies
 */
jstiny = {};


if (window.angular) {
    angular.module("jstiny", []).service("jstiny", function() {
        return jstiny;
    }).
    filter("map", ["jstiny", function(jstiny) {
        return jstiny.map;
    }]).
    filter("jstinyFilter", ["jstiny", function(jstiny) {
        return jstiny.filter;
    }]);
}

(function(jstiny) {

    var stop = { result: null }, remove = {};

    jstiny.stop = function(result) {
        stop.result = result;
        return stop;
    };
    jstiny.remove = function() {
        return remove;
    };

    jstiny.each = function(array, fn, def) {
        var i, result;
        if (jstiny.isArrayLike(array)) {
            
        	i=0;
            while (i < array.length) {
                result = fn(array[i], i);
                if (result === remove) {
                    Array.prototype.splice.call(array, i, 1);
                    continue;
                }
                ++i;
                if (result === stop) {
                    return stop.result;
                }
            }

        } else if (jstiny.isObject(array)) {
            
            for (i in array) {
                result = fn(array[i], i);
                if (result === remove) {
                    delete array[i];
                }
                if (result === stop) {
                    return stop.result;
                }
            }

        } else if (array != null) {
            
            result = fn(array);
            if (result != null) {
                return result;
            }

        }
        return def;
    };

})(jstiny);
(function(jstiny) {

    jstiny.evaluate = function(obj, expr) {
        var parts = expr.split(/[\.\[\]]+/g);
        for (var i=0; i<parts.length; i++) {
            var key = parts[i];
            if (jstiny.isArrayLike(obj)) {
                key = parseInt(key, 10);
            }
            var val = obj[key];
            if (val == null) {
                return val;
            }
            obj = val;
        }
        return obj;
    };

    jstiny.asFunction = function(fn) {
        if (jstiny.isString(fn)) {
            return function(item) { return jstiny.evaluate(item, fn); };
        }
        return fn;
    };

})(jstiny);
(function(jstiny) {

    function isFiltered(filter, obj, key) {
        var i, nestedFilter, nestedValue;

        if (filter == null) {
            return filter !== undefined && obj !== undefined;
        }
        if (jstiny.isFunction(filter)) {
            return filter(obj, key);
        }
        if (obj == null) {
            return false;
        }
        if (obj == filter) {
            return true;
        }
        if (jstiny.isArrayLike(filter)) {
            for (i=0; i<filter.length; i++) {
                nestedFilter = filter[i];
                if (isFiltered(nestedFilter, obj, key)) {
                    return true;
                }
            }
            return false;
        }
        if (jstiny.isObject(filter)) {
            for (i in filter) {
                nestedValue = jstiny.evaluate(obj, i);
                nestedFilter = filter[i];
                if (!isFiltered(nestedFilter, nestedValue, i)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    jstiny.filter = function(objects, filter, opts) {
    	var result;

        opts = opts || {};
        result = opts.modify ? objects : opts.single ? null : [];

        jstiny.each(objects, function(obj, key) {
            var keep = opts.equals ? obj == filter : isFiltered(filter, obj, key);
            if (opts.inverse) {
                keep = !keep;
            }
            if (opts.modify) {
                return keep ? true : jstiny.remove();
            }
            if (!keep) {
                return true;
            }
            if (opts.single) {
                result = obj;
                return jstiny.stop();
            }
            result.push(obj);
        });
        if (opts.single) {
            return result != null ? result : opts.default != null ? opts.default : null;
        }
        if (result.length === 0 && opts.default != null) {
            jstiny.each(opts.default, result.push);
        }
        return result;
    };

})(jstiny);
(function(jstiny) {
	
    jstiny.multihash = function(hash, key, value) {
        var current = hash[key];
        if (!jstiny.isArray(current)) {
            current = [];
            if (value != null) {
                hash[key] = current;
            }
        }
        if (value != null) {
            current.push(value);
        }
        return current;
    };

    jstiny.hash = function(array, fn, opts) {
    	var target;

        opts = opts || {};
        fn = jstiny.asFunction(fn);
        target = opts.target || {};

        jstiny.each(array, function(item, key) {
            var val = fn(item, key);
            if (val == null) {
                return;
            }
            if (opts.multiple) {
                jstiny.multihash(target, val, item);
            } else {
                target[val] = item;
            }
        });
        return target;
    };

})(jstiny);
(function(jstiny) {

    jstiny.map = function(array, fn) {
        var result = [];

        fn = jstiny.asFunction(fn);
        if (!jstiny.isArrayLike(array) && !jstiny.isObject(array)) {
            return fn(array);
        }

        jstiny.each(array, function(item, key) {
            var mapped = fn(item, key);
            if (mapped == null) {
                return;
            }
            result.push(mapped);
        });
        return result;
    };

})(jstiny);
(function(jstiny) {

    jstiny.sort = function(array, fn, modify) {
        if (jstiny.isString(fn)) {
            fn = function(a,b) {
                var valueA = jstiny.evaluate(a, fn), 
                	valueB = jstiny.evaluate(b, fn);
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            };
        }
        return Array.prototype.sort.call(modify ? array : array.slice(), fn);
    };

})(jstiny);
(function(jstiny) {
	
    jstiny.isArray = function(obj) {
        return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) == "[object Array]";
    };

    jstiny.isObject = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Object]";
    };

    jstiny.isArrayLike = function(obj) {
        if (jstiny.isArray(obj)) {
            return true;
        }
        if (!jstiny.isObject(obj)) {
            return false;
        }
        var length = obj.length;
        return (typeof length === "number") && (length === 0 || ((length - 1) in obj));
    };

    jstiny.isString = function(obj) {
        return typeof obj === "string";
    };

    jstiny.isFunction = function(obj) {
        return typeof obj === "function";
    };

})(jstiny);
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


    function addPair(key, value, pairs, allowNulls) {
        var pair = encodeURIComponent(key);
        if (value != null) {
            pair += "=" + encodeURIComponent(value);
        } else if (!allowNulls) {
            return;
        }
        pairs.push(pair);
    }
    
    UrlBuilder.prototype.get = function(opts) {
        var keys = Object.keys(this.values),
            allowNulls = opts && opts.nulls,
            key, value, i, j, pairs = [];

        keys.sort();
        for (i=0;i<keys.length;i++) {
            key = keys[i];
            value = this.values[key];
            if (jstiny.isArrayLike(value)) {
                for (j=0; j<value.length; j++) {
                    addPair(key, value[j], pairs, allowNulls);
                }
            } else {
                addPair(key, value, pairs, allowNulls);
            }
        }
        return pairs.length > 0 ? this.path + "?" + pairs.join("&") : this.path;
    };

    jstiny.url = function(str) {
    	return new UrlBuilder(str);
    };

})(jstiny);