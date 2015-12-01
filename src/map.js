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