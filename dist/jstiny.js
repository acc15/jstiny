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

    jstiny.copy = function(source, opts) {
        var k, v, 
            clear = opts && opts.clear, 
            transform = opts && opts.transform, 
            keys = opts && opts.keys, 
            target = opts && opts.target;

        if (clear !== false) {
            jstiny.clear(target);
        }
        if (jstiny.isArrayLike(source)) {
            if (!jstiny.isArrayLike(target)) {
                target = [];
            }
            jstiny.each(source, function(v,k) {
                if (jstiny.isFunction(transform)) {
                    v = transform(v, keys ? k : undefined);
                }
                Array.prototype.push.call(target, v);
            });
            return target;
        } else if (jstiny.isObject(source)) {
            if (!jstiny.isObject(target)) {
                target = {};
            }
            jstiny.each(source, function(v,k) {
                if (jstiny.isFunction(transform)) {
                    v = transform(v, keys ? k : undefined);
                }
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
        stopped: false
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
        } else {
            fn(array);
        }

        iteration.removed = false;
        iteration.stopped = false;

        if ("result" in iteration) {
            result = iteration.result;
            delete iteration.result;
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
        return jstiny.expression(expr).get(obj);
    };

    jstiny.asFunction = function(fn) {
        if (jstiny.isString(fn)) {
            return function(item) { return jstiny.evaluate(item, fn); };
        }
        return fn;
    };

})(jstiny);
(function(jstiny) {

    function Expression(expr) {
        var key, i, index;

        this.keys = expr.split(/[\.\[\]]+/g);
        for (i = 0; i < this.keys.length; i++) {
            key = this.keys[i];
            index = parseInt(key, 10);
            if (!isNaN(index)) {
                this.keys[i] = index;
            }
        }
    }

    Expression.NotFound = {};

    Expression.prototype.remove = function(obj) {
        var i, key, len = this.keys.length;
        for (i = 0; i < len; i++) {
            if (obj === null || obj === undefined) {
                break;
            }
            key = this.keys[i];
            if (i === len - 1) {
                delete obj[key];
                return true;
            }
            obj = obj[key];
        }
        return false;
    };

    Expression.prototype.exists = function(obj) {
        return this.get(obj, Expression.NotFound) !== Expression.NotFound;
    };

    Expression.prototype.get = function(obj, def) {
        for (var i = 0; i < this.keys.length; i++) {
            if (obj === null || obj === undefined) {
                return def;
            }
            obj = obj[this.keys[i]];
        }
        return obj;
    };
    Expression.prototype.set = function(obj, value) {
        var key, i, len = this.keys.length;
        for (i = 0; i < len; i++) {
            key = this.keys[i];
            if (i === len - 1) {
                obj[key] = value;
                return;
            }
            if (obj[key] === null || obj[key] === undefined) {
                obj[key] = typeof this.keys[i + 1] === "number" ? [] : {};
            }
            obj = obj[key];
        }
    };

    jstiny.expression = function(expr) {
        return new Expression(expr);
    };

})(jstiny);
(function(jstiny) {

    function filtered(obj, filter, key, opts) {
        var i, nestedFilter, nestedValue;
        if ((!opts || !opts.nulls) && filter === null) {
            return obj !== undefined;
        } 
        if (jstiny.isFunction(filter)) {
            return filter(obj, key);
        }
        if (jstiny.isArrayLike(filter)) {
            for (i=0; i<filter.length; i++) {
                nestedFilter = filter[i];
                if (filtered(obj, nestedFilter, i, opts)) {
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
                if (!filtered(nestedValue, nestedFilter, i, opts)) {
                    return false;
                }
            }
            return true;
        }
        return obj === filter;
    }


    function matches(obj, filter, key, opts) {
        var match;
        if (opts && opts.equals) {
            match = (obj === filter);
        } else {
            match = filtered(obj, filter, key, opts);
        }
        return opts && opts.inverse ? !match : match;
    }

    jstiny.filter = function(objects, filter, opts) {
    	var result, key, value, found = false, match, 
            single = opts && opts.single,
            modify = opts && opts.modify;
        
        if (jstiny.isArrayLike(objects)) {

            if (!modify && !single) {
                result = [];
            }
            for (key = 0; key < objects.length; ) {

                value = objects[key];
                match = matches(value, filter, key, opts);

                if (single && match && !found) {
                    result = value;
                }
                if (match && !found) {
                    found = true;
                }
                if (single && match && !modify) {
                    break;
                }
                if (modify && !match) {
                    Array.prototype.splice.call(objects, key, 1);
                    continue;
                }
                if (!single && !modify && match) {
                    result.push( value );
                }
                ++key;
            }

        } else if (jstiny.isObject(objects)) {

            if (!modify && !single) {
                result = {};
            }
            for (key in objects) {
                if (!objects.hasOwnProperty(key)) {
                    continue;
                }

                value = objects[key];
                match = matches(value, filter, key, opts);

                if (single && match && !found) {
                    result = value;
                }
                if (match && !found) {
                    found = true;
                }
                if (single && match && !modify) {
                    break;
                }
                if (modify && !match) {
                    delete objects[key];
                }
                if (!single && !modify && match) {
                    result[key] = value;
                }
            }

        } else {
            result = matches(objects, filter, undefined, opts) ? objects : undefined;
        }

        if (!found && opts && "default" in opts) {
            result = opts.default;
        }
        return result;
    };

    jstiny.filter.any = function() { return true;  };
    jstiny.filter.defined = function(v) { return v !== undefined; };

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
    	var target, nulls = (opts && opts.nulls);

        opts = opts || {};
        fn = jstiny.asFunction(fn);
        target = opts.target || {};

        jstiny.each(array, function(item, key) {
            var val = fn(item, key);
            if (val === undefined || (val === null && !nulls)) {
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

    jstiny.map = function(array, fn, opts) {
        var key, value, needKey = opts && opts.keys, skipNulls = opts && opts.skipNulls, skipUndefined;

        fn = jstiny.asFunction(fn);
        if (jstiny.isArrayLike(array)) {
            result = [];
            for (key = 0; key < array.length; key++) {
                value = fn(array[key], needKey ? key : undefined);
                if ((value === null && skipNulls) || (value === undefined && skipUndefined)) {
                    continue;
                }
                result.push(value);
            }
            return result;
        }
        if (jstiny.isObject(array)) {
            result = {};
            for (key in array) {
                if (!array.hasOwnProperty(key)) {
                    continue;
                }
                value = fn(array[key], needKey ? key : undefined);
                if ((value === null && skipNulls) || (value === undefined && skipUndefined)) {
                    continue;
                }
                result[key] = value; 
            }
            return result;
        }
        return fn( array );
    };

})(jstiny);
(function(jstiny) {
	
    function Range(min,max) {
        this.set(min,max);
    }
    Range.prototype.set = function(min,max) {
        if (jstiny.isArrayLike(min)) {
            this.min = min[0];
            this.max = min[1];
        } else if (jstiny.isObject(min)) {
            this.min = min.min;
            this.max = min.max;
        } else {
            this.min = min;
            this.max = max !== undefined ? max : min;
        }
        return this;
    };
    Range.prototype.asArray = function() {
        return [ this.min, this.max ];
    };
    Range.prototype.length = function() {
        return this.max - this.min;
    };
    Range.prototype.empty = function() {
        return this.max === this.min;
    };
    Range.prototype.inflate = function(min,max) {
        var other = jstiny.asRange(min,max);
        this.min -= other.min;
        this.max += other.max;
        return this;
    };

    Range.prototype.overlaps = function(min,max) {
        var other = jstiny.asRange(min,max);
        return this.min <= other.max && this.max >= other.min;
    };
    Range.prototype.inside = function(min,max) {
        var other = jstiny.asRange(min,max);
        return this.min >= other.min && this.max <= other.max;
    };
    Range.prototype.bind = function(min,max) {
        var other = jstiny.asRange(min,max);
        if (this.min < other.min) {
            this.max = Math.min(other.max, other.min + this.length());
            this.min = other.min;
        } else if (this.max > other.max) {
            this.min = Math.max(other.min, other.max - this.length());
            this.max = other.max;
        }
        return this;
    };

    jstiny.range = function(min,max) {
        return new Range(min,max);
    };
    jstiny.asRange = function(min,max) {
        return min instanceof Range ? min : jstiny.range(min,max);
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
        return Object.prototype.toString.call(obj) === "[object Object]";
    };

    jstiny.isAnyObject = function(obj) {
        return obj !== null && typeof obj === "object";
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