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