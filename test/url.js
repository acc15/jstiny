describe("url", function() {
    
    it("url should correctly parse query parameters", function() {
        expect(jstiny.url("api/v1/report/abc?abc=different&abc=123&abc=values&xyz=abc").params()).
            toEqual({abc:["different", "123", "values"], xyz: "abc"});
    });

    it("url should correctly build query parameters", function() {
        expect(jstiny.url("api/v1/report/abc").params({abc: 123, xyz: "abc"}).get()).
            toEqual("api/v1/report/abc?abc=123&xyz=abc");
    });

    it("url should expand arrays to query parameters", function() {
        expect(jstiny.url("api/v1/report/abc").params({abc: ["different", 123, "values"], xyz: "abc"}).get()).
            toEqual("api/v1/report/abc?abc=different&abc=123&abc=values&xyz=abc");
    });

    it("url should correctly add parameters", function() {
        expect(jstiny.url("api/v1/report/abc?abc=different&abc=123&abc=values&xyz=abc").add("ddd", [123, 321]).get()).
            toEqual("api/v1/report/abc?abc=different&abc=123&abc=values&ddd=123&ddd=321&xyz=abc");
    });

    it("url should correctly remove parameters", function() {
        expect(jstiny.url("api/v1/report/abc?abc=different&abc=123&abc=values&xyz=abc").remove("abc").get()).
            toEqual("api/v1/report/abc?xyz=abc");
    });

    it("url should correctly return parameter without value", function() {
        expect(jstiny.url("api/v1/report/abc?abc&xyz").param("abc")).toBeNull();
        expect(jstiny.url("api/v1/report/abc?abc&xyz").param("ddd")).toBeUndefined();
    });

    it("url should correctly add parameter without value", function() {
        var url = jstiny.url("api/v1/report/abc").add("abc");
        expect(url.has("abc")).toBe(true);
        expect(url.param("abc")).toBeUndefined();
        expect(url.get({nulls: true})).toEqual("api/v1/report/abc?abc");
    });

    it("url should correctly append parameter without value", function() {
        var url = jstiny.url("api/v1/report/abc").params({abc: "xyz"}).add("abc");
        expect(url.has("abc")).toBe(true);
        expect(url.param("abc")).toEqual(["xyz", undefined]);
        expect(url.get()).toEqual("api/v1/report/abc?abc=xyz");
        expect(url.get({nulls:true})).toEqual("api/v1/report/abc?abc=xyz&abc");
    });
    it("url should correctly append parameter with value", function() {
        var url = jstiny.url("api/v1/report/abc").params({abc: undefined}).add("abc", 1);
        expect(url.has("abc")).toBe(true);
        expect(url.param("abc")).toEqual([undefined, 1]);
        expect(url.get()).toEqual("api/v1/report/abc?abc=1");
        expect(url.get({nulls:true})).toEqual("api/v1/report/abc?abc&abc=1");
    });


    it("url should clear parameters if value is null", function() {
        var obj = { a: 1 };
        expect(jstiny.url("abc").params(obj).params(null).params()).toEqual({});
    });

    it("url should correctly add multiple parameter values", function() {
        var obj = { a: 1 };
        expect(jstiny.url("test/abc").params(obj).add("a",[2,3]).get()).toEqual("test/abc?a=1&a=2&a=3");
    });

    it("url should merge parameters object with current parameters object", function() {
        var obj = { a: 1, b: 1 };
        expect(jstiny.url("test/abc").params(obj).add({a: 2, b: [2,3], c: "value"}).get()).toEqual("test/abc?a=1&a=2&b=1&b=2&b=3&c=value");
    });

    it("url should not modify specified params object", function() {
        var obj = { a: 1, b: 1 };
        expect(jstiny.url("test/abc").params(obj).add({c: "value"}).get()).toEqual("test/abc?a=1&b=1&c=value");
        expect(obj.c).toBeUndefined();
    });

    it("url should return correct path", function() {
        expect(jstiny.url("test/abc?a=1&a=2&b=1&b=2&b=3&c=value").path).toEqual("test/abc");
    });

    it("url should correctly parse complex structures", function() {
        var params = jstiny.url("test/xyz?a.n[0].x=10&a.n[0].y=5&a.n[1].x=test&a.m.x=dog&a.m.y=cat").params();
        expect(params).toEqual({ 
            a: { 
                n: [{ x: "10", y: "5" }, { x: "test" }],
                m: { x: "dog", y: "cat" }
            }
        });
    });

});