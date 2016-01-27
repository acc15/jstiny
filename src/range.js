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
            this.max = max !== undefined ? max : min;
        }
        return this;
    };
    Range.prototype.asArray = function() {
        return [ this.min, this.max ];
    };
    Range.prototype.length = function() {
        return this.max - this.min;
    };
    Range.prototype.empty = function() {
        return this.max === this.min;
    };
    Range.prototype.inflate = function(min,max) {
        var other = jstiny.asRange(min,max);
        this.min -= other.min;
        this.max += other.max;
        return this;
    };

    Range.prototype.overlaps = function(min,max) {
        var other = jstiny.asRange(min,max);
        return this.min <= other.max && this.max >= other.min;
    };
    Range.prototype.inside = function(min,max) {
        var other = jstiny.asRange(min,max);
        return this.min >= other.min && this.max <= other.max;
    };
    Range.prototype.bind = function(min,max) {
        var other = jstiny.asRange(min,max);
        if (this.min < other.min) {
            this.max = Math.min(other.max, other.min + this.length());
            this.min = other.min;
        } else if (this.max > other.max) {
            this.min = Math.max(other.min, other.max - this.length());
            this.max = other.max;
        }
        return this;
    };

    jstiny.range = function(min,max) {
        return new Range(min,max);
    };
    jstiny.asRange = function(min,max) {
        return min instanceof Range ? min : jstiny.range(min,max);
    };


})(jstiny);