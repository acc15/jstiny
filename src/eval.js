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