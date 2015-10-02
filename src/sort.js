(function(jstiny) {

    jstiny.sort = function(array, fn, modify) {
        if (jstiny.isString(fn)) {
            fn = function(a,b) {
                var valueA = jstiny.evaluate(a, fn), 
                	valueB = jstiny.evaluate(b, fn);
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            };
        }
        return Array.prototype.sort.call(modify ? array : array.slice(), fn);
    };

})(jstiny);