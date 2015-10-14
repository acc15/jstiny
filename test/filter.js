describe("filter", function() {
    it("filter removes element by reference", function() {
        var abc = [1,2,3];
        jstiny.filter(abc, 2, {inverse: true, modify: true});

        expect(abc).toEqual([1,3]);
    });

    it("filter works correctly with default options", function() {
        var abc = [{x:1,y:2}, {x:2,y:2}, {x:3,y:1}];

        // filter all points by y
        expect(jstiny.filter(abc, {y:2})).toEqual([{x:1,y:2}, {x:2,y:2}]);
    });

    it("filter should not fail if params are null", function() {
        expect(jstiny.filter(null, null)).toEqual([]);
    });

    it("filter should filter by nested properties", function() {
        var v1 = {a: {b: {c: 10}, d: 2}},
            v2 = {a: {b: {c: 1}, d: 2}},
            data = [
                {a:{d:2}}, // should be filtered out because property a.b is absent
                {a:{b:{x:1},d:2}}, // should be filtered out because property a.b.c is absent
                v1,
                {a:{b:{c:2},d:1}}, // should be filtered out because property a.d is not equal
                v2
            ],
            expected = [ v1, v2 ];
        expect(jstiny.filter(data, {a: {b: {c:null}, d:2}})).toEqual(expected);
    });

    it("filter should filter by expression", function() {
        var v1 = {x: {y: {z: "abc"}}}, 
            v2 = {x: {y: {z: "cba"}}}, 
            values = [v1, v2, {x: {y: {z: "dbe"}}}];
        expect(jstiny.filter(values, {"x.y.z": ["abc", "cba"]})).toEqual([v1, v2]);
    });

});