describe("each", function() {
    
    it("each should iterate over object properties", function() {
        var source = {a:1,b:new Date(),c:"abc"},
            target = {};
        jstiny.each(source, function(v,k) {
            target[k] = v;
        });
        expect(target).toEqual(source);
    });

    it("each should iterate over array elements", function() {
        var source = [ 1, new Date(), "abc"],
            target = [];
        jstiny.each(source, function(v,k) {
            expect(k).toEqual(target.length);
            target.push(v);
        });
        expect(target).toEqual(source);
    });

    it("each.remove should delete object property", function() {
        var source = {a:1,b:new Date(),c:"abc"};
        jstiny.each(source, function(v,k) {
            if (k === "a" || k === "c") {
                jstiny.each.remove();
            }
        });
        expect(source.a).toBeUndefined();
        expect(source.c).toBeUndefined();
    });

    it("each.remove() should delete array elements", function() {
        var date = new Date(), source = [ 1, date, "abc"];
        jstiny.each(source, function(v,k) {
            if (k === 0 || k === 2) {
                jstiny.each.remove();
            }
        });
        expect(source.length).toEqual(1);
        expect(source[0]).toBe(date);
    });

    it("each.result(v) should return specified result", function() {
        var source = [ 1, new Date(), "abc"],
            target = [],
            result;
        
        result = jstiny.each(source, function(v,k) {
            if (k === 2) {
                jstiny.each.result(v);
            }
            target.push(v);
        });
        expect(result).toEqual("abc");
        expect(target).toEqual(source);
    });

    it("each.stop() should break without result", function() {
        var source = [ 1, new Date(), "abc"],
            target = [],
            result;
        
        result = jstiny.each(source, function(v,k) {
            if (k === 1) {
                jstiny.each.stop();
            } else {
                target.push(v);
            }
        });
        expect(result).toBeUndefined();
        expect(target).toEqual([1]);
    });

    it("each.stop(v) should break returning result", function() {
        var source = [ 1, new Date(), "abc"],
            target = [],
            result;
        
        result = jstiny.each(source, function(v,k) {
            if (k === 1) {
                jstiny.each.stop(123);
            } else {
                target.push(v);
            }
        });
        expect(result).toEqual(123);
        expect(target).toEqual([1]);
    });


    it("each.stop() shouldn't overwrite each.result(v)", function() {
        var source = [ 1, new Date(), "abc"],
            target = [],
            result;
        
        result = jstiny.each(source, function(v,k) {
            if (k === 0) {
                jstiny.each.result(123);
            }
            if (k === 1) {
                jstiny.each.stop();
            } else {
                target.push(v);
            }
        });
        expect(result).toEqual(123);
        expect(target).toEqual([1]);
    });


    it("each.stop(v) should overwrite each.result(v)", function() {
        var source = [ 1, new Date(), "abc"],
            target = [],
            result;
        
        result = jstiny.each(source, function(v,k) {
            if (k === 0) {
                jstiny.each.result(123);
            }
            if (k === 1) {
                jstiny.each.stop(512);
            } else {
                target.push(v);
            }
        });
        expect(result).toEqual(512);
        expect(target).toEqual([1]);
    });


});