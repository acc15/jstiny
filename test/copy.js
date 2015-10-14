describe("copy", function() {
    it("copy should create a copy of object", function() {
        var source = {a:1,b:new Date(),c:"abc"},
            target = jstiny.copy(source);
        expect(target).toEqual(source);
        expect(target).not.toBe(source);
    });

    it("copy should create a copy of array", function() {
        var source = [ 1, new Date(), "abc"],
            target = jstiny.copy(source);
        expect(target).toEqual(source);
        expect(target).not.toBe(source);
    });

    it("copy should create a copy of object if provided target is not an object", function() {
        var source = { x: 1, y: "abc", z: null },
            target = [ 1, 2, 3 ], 
            result;
        result = jstiny.copy(source, target);
        expect(result).toEqual(source);
        expect(result).not.toBe(source);
        expect(result).not.toBe(target);
    });

    it("copy should create a copy of array if provided target is not an array-like", function() {
        var source = [ 1, new Date(), "abc"],
            target = { a: 1 }, 
            result;
        result = jstiny.copy(source, target);
        expect(result).toEqual(source);
        expect(result).not.toBe(source);
        expect(result).not.toBe(target);
    });

    it("copy should clear array even if source is null", function() {
        var target = [ "abc" ];
        jstiny.copy(null, target);
        expect(target).toEqual([]);
    });

    it("copy should clear object even if source is null", function() {
        var target = { a: "abc" };
        jstiny.copy(null, target);
        expect(target).toEqual({});
    });

    it("copy should copy to existing object", function() {
        var source = { x: 1, y: "abc", z: null },
            target = { a: "abc", b: "cde", z: new Date() };
        jstiny.copy(source, target);
        expect(target).toEqual(source);
    });

    it("copy should copy to existing array", function() {
        var source = [ 1, new Date(), "abc"],
            target = [ "abc" ];
        jstiny.copy(source, target);
        expect(target).toEqual(source);
    });

    (function(values) {
        var prop,value,type;
        function test(type,value) {
            it("copy should return source if target is " + type, function() {
                var source = value, target = jstiny.copy(source);
                expect(target).toEqual(source);
                expect(target).toBe(source);
            });
        }
        for (prop in values) {
            test(prop, values[prop]);
        }
    })({
        "number": 123, 
        "string": "xyz", 
        "date": new Date(), 
        "function": function() { return true; }
    });

});