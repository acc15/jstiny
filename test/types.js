describe("types", function() {

   
    it("isObject should return true if value is hash", function() {
        expect(jstiny.isObject({a:123})).toBe(true);
    });
    it("isObject should return false if value is date, number, string or regexp", function() {
        expect(jstiny.isObject(new Date())).toBe(false);
        expect(jstiny.isObject(/abc/)).toBe(false);
        expect(jstiny.isObject(123)).toBe(false);
        expect(jstiny.isObject("15")).toBe(false);
        expect(jstiny.isObject([])).toBe(false);
    });

    it("isAnyObject should return true if value is date,hash,array,regexp", function() {
        expect(jstiny.isAnyObject({a:123})).toBe(true);
        expect(jstiny.isAnyObject([])).toBe(true);
        expect(jstiny.isAnyObject(new Date())).toBe(true);
        expect(jstiny.isAnyObject(/abc/)).toBe(true);
    });
    it("isObject should return false if value is primitive (number,string)", function() {
        expect(jstiny.isAnyObject(123)).toBe(false);
        expect(jstiny.isAnyObject("abc")).toBe(false);
    });

    it("isDate should return true only if value is date", function() {
        expect(jstiny.isDate(new Date())).toBe(true);
        expect(jstiny.isDate({getTime: function() { return 1; }})).toBe(false);
        expect(jstiny.isDate([])).toBe(false);
    });



});