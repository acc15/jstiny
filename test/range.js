describe("range", function() {
    
    describe("range.ctor()", function() {
        it("can be created from array", function() {
            var range = jstiny.range([1,2]);
            expect(range.min).toEqual(1);
            expect(range.max).toEqual(2);
        });
        it("can be created from object", function() {
            var range = jstiny.range({min:1, max:2});
            expect(range.min).toEqual(1);
            expect(range.max).toEqual(2);
        });
        it("can be created from parameters", function() {
            var range = jstiny.range(1,2);
            expect(range.min).toEqual(1);
            expect(range.max).toEqual(2);
        });
        it("can be created from range", function() {
            var range1 = jstiny.range(1,2),
                range2 = jstiny.range(range1);
            expect(range2.min).toEqual(1);
            expect(range2.max).toEqual(2);
        });
    });

    describe("range.set()", function() {
        it("accepts array", function() {
            var range = jstiny.range(1,2);
            expect(range.set([3,4])).toBe(range);
            expect(range.min).toEqual(3);
            expect(range.max).toEqual(4);
        });
        it("accepts object", function() {
            var range = jstiny.range(1,2);
            expect(range.set({min: 3, max: 4})).toBe(range);
            expect(range.min).toEqual(3);
            expect(range.max).toEqual(4);
        });
        it("accepts parameters", function() {
            var range = jstiny.range(1,2);
            expect(range.set(3,4)).toBe(range);
            expect(range.min).toEqual(3);
            expect(range.max).toEqual(4);
        });
        it("accepts range", function() {
            var range1 = jstiny.range(1,2),
                range2 = jstiny.range(3,4);
            expect(range1.set(range2)).toBe(range1);
            expect(range1.min).toEqual(3);
            expect(range1.max).toEqual(4);
        });
    });

    it("range.length() returns distance", function() {
        var range = jstiny.range(10, 100);
        expect(range.length()).toEqual(90);
    });

    it("range.asArrays() returns range as array", function() {
        var range = jstiny.range(10, 100);
        expect(range.asArray()).toEqual([10,100]);
    });

    it("range.empty() returns true when min === max, false otherwise", function() {
        expect(jstiny.range(10, 90).empty()).toBe(false);
        expect(jstiny.range(10, 10).empty()).toBe(true);
    });

    describe("range.inflate()", function() {
        it("by one parameter", function() {
            var range = jstiny.range(10, 90);
            range.inflate(10);
            expect(range.min).toEqual(0);
            expect(range.max).toEqual(100);
        });
        it("by two parameters", function() {
            var range = jstiny.range(10, 90);
            range.inflate(10, 20);
            expect(range.min).toEqual(0);
            expect(range.max).toEqual(110);
        });
        it("by array", function() {
            var range = jstiny.range(10, 90);
            range.inflate([10, 20]);
            expect(range.min).toEqual(0);
            expect(range.max).toEqual(110);
        });
        it("by range", function() {
            var range = jstiny.range(10, 90);
            range.inflate(jstiny.range(10, 30));
            expect(range.min).toEqual(0);
            expect(range.max).toEqual(120);
        });
    });

    describe("range.bind()", function() {
        it("should move range to be inside of specified (left side)", function() {
            var inner = jstiny.range(10,20), outer = jstiny.range(1000, 2000);
            expect(inner.bind(outer)).toBe(inner);
            expect(inner.min).toEqual(1000);
            expect(inner.max).toEqual(1010);
        });
        it("should move range to be inside of specified (right side)", function() {
            var inner = jstiny.range(5000,5100), outer = jstiny.range(1000, 2000);
            expect(inner.bind(outer)).toBe(inner);
            expect(inner.min).toEqual(1900);
            expect(inner.max).toEqual(2000);
        });
        it("should make range equal to outer if inner is bigger than outer", function() {
            var inner = jstiny.range(100,5000), outer = jstiny.range(200, 300);
            expect(inner.bind(outer)).toBe(inner);
            expect(inner.min).toEqual(200);
            expect(inner.max).toEqual(300);
        });
    });

});