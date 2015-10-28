describe("map", function() {
    
    it("map array should call function for every element excluding undefined and nulls", function() {
        var source = [1,2,null,3,undefined],
            target = jstiny.map(source, function(a,k){return String(a);});
        expect(target).toEqual(["1","2","null","3","undefined"]);
    });
    it("map object should call function for every element excluding undefined and nulls", function() {
        var source = {k1:1,k2:2,k3:null,k4:3,k5:undefined},
            target = jstiny.map(source, function(a){return String(a);});
        expect(target).toEqual({k1:"1",k2:"2",k3:"null",k4:"3",k5:"undefined"});
    });
    it("map object should call function for every element excluding undefined if opts.nulls", function() {
        var source = {k1:1,k2:2,k3:null,k4:3,k5:undefined}, keys = [],
            target = jstiny.map(source, function(a,k){ keys.push(k);  return String(a);
            }, {keys:true});
        expect(target).toEqual({k1:"1",k2:"2",k3:"null",k4:"3",k5:"undefined"});
        expect(keys).toEqual(["k1","k2","k3","k4","k5"]);
    });
    it("map should map by expression", function() {
        var source = [{a: {b: {c: 123}}}, {a: {b: {c: 15}}}, {a: {b: {c: "xyz"}}}, {a:"abc"}];
        expect(jstiny.map(source, "a.b.c")).toEqual([123, 15, "xyz", undefined]);
    });


});