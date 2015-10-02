
if (window.angular) {
    angular.module("jstiny", []).service("jstiny", function() {
        return jstiny;
    }).
    filter("map", ["jstiny", function(jstiny) {
        return jstiny.map;
    }]).
    filter("jstinyFilter", ["jstiny", function(jstiny) {
        return jstiny.filter;
    }]);
}
