(function(jstiny) {

    jstiny.evaluate = function(obj, expr) {
        var parts = expr.split(/[\.\[\]]+/g), key, i;
        for (i=0; i<parts.length; i++) {
            if (obj === null || obj === undefined) {
                return obj;
            }
            key = parts[i];
            if (jstiny.isArrayLike(obj)) {
                obj = obj[ parseInt(key, 10) ];
            } else if (jstiny.isAnyObject(obj)) {
                obj = obj[ key ];
            } else {
                return undefined;
            }            
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