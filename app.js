var namedRegexp = require("./lib/named-js-regexp");

//var namedRegexp = require("named-js-regexp");

var re = namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?)(:(?<seconds>\\d\\d?))?");
var matches = "1:2".match(re);
var a = matches[re.groupsIndices["hours"]]; 	// => "1"
a = matches[re.groupsIndices["seconds"]]; 	// => undefined


console.log();