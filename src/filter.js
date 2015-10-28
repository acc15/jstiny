(function(jstiny) {

    function filtered(obj, filter, key) {
        var i, nestedFilter, nestedValue;
        if (jstiny.isFunction(filter)) {
            return filter(obj, key);
        } else if (jstiny.isArrayLike(filter)) {
            for (i=0; i<filter.length; i++) {
                nestedFilter = filter[i];
                if (filtered(obj, nestedFilter, i)) {
                    return true;
                }
            }
            return false;
        } else if (jstiny.isObject(filter)) {
            for (i in filter) {
                if (!filter.hasOwnProperty(i)) {
                    continue;
                }
                nestedValue = jstiny.evaluate(obj, i);
                nestedFilter = filter[i];
                if (!filtered(nestedValue, nestedFilter, i)) {
                    return false;
                }
            }
            return true;
        } else {
            return obj === filter;
        }
    }


    function matches(obj, filter, key, opts) {
        var match;
        if (opts && opts.equals) {
            match = (obj === filter);
        } else {
            match = filtered(obj, filter, key);
        }
        return opts && opts.inverse ? !match : match;
    }

    jstiny.filter = function(objects, filter, opts) {
    	var result, key, value, found, match, 
            doSingle = opts && opts.single,
            doModify = opts && opts.modify;
        
        if (jstiny.isArrayLike(objects)) {

            if (!doModify && !doSingle) {
                result = [];
            }
            for (key = 0; key < objects.length; ) {

                value = objects[key];
                match = matches(value, filter, key, opts);

                if (doSingle && match && !found) {
                    result = value;
                    found = true;
                    if (!doModify) {
                        break;
                    }
                } else if (doModify && !match) {
                    
                    Array.prototype.splice.call(objects, key, 1);
                    continue;

                } else if (!doSingle && !doModify && match) {
                    result.push( value );
                }

                ++key;
            }

        } else if (jstiny.isObject(objects)) {

            if (!doModify && !doSingle) {
                result = {};
            }
            for (key in objects) {
                if (!objects.hasOwnProperty(key)) {
                    continue;
                }

                value = objects[key];
                match = matches(value, filter, key, opts);

                if (doSingle && match && !found) {
                    result = value;
                    found = true;
                    if (!doModify) {
                        break;
                    }
                } else if (doModify && !match) {
                    delete objects[key];
                } else if (!doModify && match) {
                    result[key] = value;
                }
            }

        } else {
            result = matches(filter, objects, undefined, opts) ? objects : undefined;
        }

        if ((result === null || result === undefined) && opts && "default" in opts) {
            result = opts.default;
        }
        return result;
    };

    jstiny.filter.any = function() { return true;  };
    jstiny.filter.defined = function(v) { return v !== undefined; };

})(jstiny);