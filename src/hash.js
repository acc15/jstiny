(function(jstiny) {
	
    jstiny.multihash = function(hash, key, value) {
        var current = hash[key];
        if (!jstiny.isArray(current)) {
            current = [];
            if (value != null) {
                hash[key] = current;
            }
        }
        if (value != null) {
            current.push(value);
        }
        return current;
    };

    jstiny.hash = function(array, fn, opts) {
    	var target;

        opts = opts || {};
        fn = jstiny.asFunction(fn);
        target = opts.target || {};

        jstiny.each(array, function(item, key) {
            var val = fn(item, key);
            if (val == null) {
                return;
            }
            if (opts.multiple) {
                jstiny.multihash(target, val, item);
            } else {
                target[val] = item;
            }
        });
        return target;
    };

})(jstiny);