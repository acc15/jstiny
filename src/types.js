(function(jstiny) {
	
    jstiny.isArray = function(obj) {
        return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) == "[object Array]";
    };

    jstiny.isObject = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Object]";
    };

    jstiny.isArrayLike = function(obj) {
        if (jstiny.isArray(obj)) {
            return true;
        }
        if (!jstiny.isObject(obj)) {
            return false;
        }
        var length = obj.length;
        return (typeof length === "number") && (length === 0 || ((length - 1) in obj));
    };

    jstiny.isString = function(obj) {
        return typeof obj === "string";
    };

    jstiny.isFunction = function(obj) {
        return typeof obj === "function";
    };

})(jstiny);