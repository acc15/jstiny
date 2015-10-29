describe("eval", function() {
    
    it("eval should work with array", function() {
        var arr = [1,222,3,4],
            result = jstiny.evaluate(arr, "1");
        expect(result).toEqual(222);
    });

    it("eval should correctly work with any object", function() {
        var date = new Date(),
            result = jstiny.evaluate(date, "getTime");
        expect(typeof(result)).toEqual("function");
    });

});