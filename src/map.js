(function(jstiny) {

    jstiny.map = function(array, fn, opts) {
        var result = [], nulls = (opts !== undefined && opts.nulls);
        fn = jstiny.asFunction(fn);
        if (!jstiny.isArrayLike(array) && !jstiny.isObject(array)) {
            return fn(array);
        }
        jstiny.each(array, function(item, key) {
            var mapped = fn(item, key);
            if (mapped === undefined || (mapped === null && !nulls)) {
                return;
            }
            result.push(mapped);
        });
        return result;
    };

})(jstiny);