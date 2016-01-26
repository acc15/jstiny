describe("range", function() {
    
    it("range can be created from array", function() {
        var range = jstiny.range([1,2]);
        expect(range.min).toEqual(1);
        expect(range.max).toEqual(2);
    });

    it("range can be created from object", function() {
        var range = jstiny.range({min:1, max:2});
        expect(range.min).toEqual(1);
        expect(range.max).toEqual(2);
    });

    it("range can be created from parameters", function() {
        var range = jstiny.range(1,2);
        expect(range.min).toEqual(1);
        expect(range.max).toEqual(2);
    });

    it("range can be created from range", function() {
        var range1 = jstiny.range(1,2),
            range2 = jstiny.range(range1);
        expect(range2.min).toEqual(1);
        expect(range2.max).toEqual(2);
    });

    it("range.set accepts array", function() {
        var range = jstiny.range(1,2);
        range.set([3,4]);
        expect(range.min).toEqual(3);
        expect(range.max).toEqual(4);
    });

    it("range.set accepts object", function() {
        var range = jstiny.range(1,2);
        range.set({min: 3, max: 4});
        expect(range.min).toEqual(3);
        expect(range.max).toEqual(4);
    });

    it("range.set accepts parameters", function() {
        var range = jstiny.range(1,2);
        range.set(3,4);
        expect(range.min).toEqual(3);
        expect(range.max).toEqual(4);
    });

    it("range.set accepts range", function() {
        var range1 = jstiny.range(1,2),
            range2 = jstiny.range(3,4);
        range1.set(range2);
        expect(range1.min).toEqual(3);
        expect(range1.max).toEqual(4);
    });

    it("range.diff returns distance", function() {
        var range = jstiny.range(10, 100);
        expect(range.diff()).toEqual(90);
    });

    it("range.asArrays returns range as array", function() {
        var range = jstiny.range(10, 100);
        expect(range.asArray()).toEqual([10,100]);
    });


});