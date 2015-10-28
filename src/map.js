(function(jstiny) {

    jstiny.map = function(array, fn, opts) {
        var key, needKey = opts && opts.keys;

        fn = jstiny.asFunction(fn);
        if (jstiny.isArrayLike(array)) {
            result = [];
            for (key = 0; key < array.length; key++) {
                result.push( fn(array[key], needKey ? key : undefined) );
            }
            return result;
        }
        if (jstiny.isObject(array)) {
            result = {};
            for (key in array) {
                if (!array.hasOwnProperty(key)) {
                    continue;
                }
                result[key] = fn(array[key], needKey ? key : undefined);
            }
            return result;
        }
        return fn( array );
    };

})(jstiny);