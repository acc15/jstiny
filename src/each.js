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