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