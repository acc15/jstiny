(function(jstiny) {
	
    function Range(min,max) {
        this.set(min,max);
    }
    Range.prototype.set = function(min,max) {
        if (jstiny.isArrayLike(min)) {
            this.min = min[0];
            this.max = min[1];
        } else if (jstiny.isObject(min)) {
            this.min = min.min;
            this.max = min.max;
        } else {
            this.min = min;
            this.max = max;
        }
    };
    Range.prototype.diff = function() {
        return this.max - this.min;
    };

    jstiny.range = function(min,max) {
        return new Range(min,max);
    };


})(jstiny);