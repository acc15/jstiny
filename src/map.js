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