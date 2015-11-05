var namedRegexp = require("./lib/named-js-regexp");

var re = namedRegexp("(?<x>\\d)(?<y>\\w)", "g");
var r = re.exec("1a2b");
var g = r.groups;
console.dir(g);
r = re.exec("1a2b");
g = r.groups;
console.dir(g);
r = re.exec("1a2b");
g = r.groups;
console.dir(g);



console.log();