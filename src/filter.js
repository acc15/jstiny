(function(jstiny) {

    function isFiltered(filter, obj, key) {
        var i, nestedFilter, nestedValue;

        if (filter == null) {
            return filter !== undefined && obj !== undefined;
        }
        if (jstiny.isFunction(filter)) {
            return filter(obj, key);
        }
        if (obj == null) {
            return false;
        }
        if (obj == filter) {
            return true;
        }
        if (jstiny.isArrayLike(filter)) {
            for (i=0; i<filter.length; i++) {
                nestedFilter = filter[i];
                if (isFiltered(nestedFilter, obj, key)) {
                    return true;
                }
            }
            return false;
        }
        if (jstiny.isObject(filter)) {
            for (i in filter) {
                if (!filter.hasOwnProperty(i)) {
                    continue;
                }
                nestedValue = jstiny.evaluate(obj, i);
                nestedFilter = filter[i];
                if (!isFiltered(nestedFilter, nestedValue, i)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    jstiny.filter = function(objects, filter, opts) {
    	var result;

        opts = opts || {};
        result = opts.modify ? objects : opts.single ? null : [];

        jstiny.each(objects, function(obj, key) {
            var keep = opts.equals ? obj == filter : isFiltered(filter, obj, key);
            if (opts.inverse) {
                keep = !keep;
            }
            if (opts.modify) {
                if (!keep) {
                    jstiny.each.remove();
                }
                return;
            }
            if (!keep) {
                return;
            }
            if (opts.single) {
                result = obj;
                return jstiny.each.stop();
            }
            result.push(obj);
        });
        if (opts.single) {
            return result != null ? result : opts.default != null ? opts.default : null;
        }
        if (result.length === 0 && opts.default != null) {
            jstiny.each(opts.default, result.push);
        }
        return result;
    };

})(jstiny);