var namedRegexp = require("./lib/named-js-regexp");

var regexp=require("./lib/named-js-regexp")("\aA", "i");
var a=regexp.test("aa");
a=regexp.test("aA");



console.log();