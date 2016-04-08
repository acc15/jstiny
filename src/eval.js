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