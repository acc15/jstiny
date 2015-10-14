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
	
    jstiny.clear = function(v) {
        if (jstiny.isArrayLike(v)) {
            Array.prototype.splice.call(v, 0, v.length);
        } else if (jstiny.isObject(v)) {
            jstiny.each(v, function() { return jstiny.each.remove(); });
        }
    };

    jstiny.copy = function(source, target) {
        var k, v;

        jstiny.clear(target);
        if (jstiny.isArrayLike(source)) {
            if (!jstiny.isArrayLike(target)) {
                target = [];
            }
            jstiny.each(source, function(v) {
                Array.prototype.push.call(target, v);
            });
            return target;
        } else if (jstiny.isObject(source)) {
            if (!jstiny.isObject(target)) {
                target = {};
            }
            jstiny.each(source, function(v,k) {
                target[k] = v;
            });
            return target;
        }
        return source;
    };

})(jstiny);
(function(jstiny) {

    var iteration = { 
        removed: false, 
        stopped: false, 
        result: null 
    };

    jstiny.each = function(array, fn, def) {
        var iter, index, result;
        if (jstiny.isArrayLike(array)) {
            
            iter = 0;
            index = 0;

            while (iter < array.length) {
                fn(array[iter], index);
                ++index;

                if (iteration.removed) {
                    iteration.removed = false;
                    Array.prototype.splice.call(array, iter, 1);
                } else {
                    ++iter;
                }
                if (iteration.stopped) {
                    iteration.stopped = false;
                    break;
                }
            }

        } else if (jstiny.isObject(array)) {
            for (iter in array) {
                if (!array.hasOwnProperty(iter)) {
                    continue;
                }
                fn(array[iter], iter);
                if (iteration.removed) {
                    iteration.removed = false;
                    delete array[iter];
                }
                if (iteration.stopped) {
                    iteration.stopped = false;
                    break;
                }
            }
        } else if (array != null) {
            fn(array);
        }

        if (iteration.result !== undefined) {
            result = iteration.result;
            iteration.result = undefined;
            return result;
        } else {
            return def;
        }
    };

    jstiny.each.result = function(result) {
        iteration.result = result;
        return this;
    };
    jstiny.each.stop = function(result) {
        iteration.stopped = true;
        if (result !== undefined) {
            iteration.result = result;
        }
        return this;
    };
    jstiny.each.remove = function() {
        iteration.removed = true;
        return this;
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
                if (!filter.hasOwnProperty(i)) {
                    continue;
                }
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
                if (!keep) {
                    jstiny.each.remove();
                }
                return;
            }
            if (!keep) {
                return;
            }
            if (opts.single) {
                result = obj;
                return jstiny.each.stop();
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

    jstiny.isDate = function(obj) {
        return obj instanceof Date && !isNaN(obj.valueOf());
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
        jstiny.copy(value, this.values);
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