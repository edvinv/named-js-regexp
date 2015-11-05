var expect = require("chai").expect;
var namedRegexp = require("../lib/named-js-regexp");

describe("NamedRegExp must", function () {
	var regex = namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?):(?<seconds>\\d\\d?)");
	it("be instance of RegExp", function () { expect(regex).to.be.instanceof(RegExp); });
	it("have execGroups function.", function () { expect(regex.execGroups).to.be.a("function"); });
	it("have groupsIndices dictionary.", function () { expect(regex.groupsIndices).to.be.an("object"); });
});

describe("Result from exec() must be", function () {
	var regex = namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?):(?<seconds>\\d\\d?)");
	var result = regex.exec("1:2:33");
	it("valid Array.", function () { expect(result).to.be.an("array"); });
	it("have group(name) function.", function () { expect(result.group).to.be.a("function"); });
	it("have groups property.", function () { expect(result.groups).to.be.an("object"); });
});

describe("Using regexp with exec function", function () {
	var regex = namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?):(?<seconds>\\d\\d?)");
	var result = regex.exec("1:2:33").groups;
	it("check result.", function () { expect(result).to.be.deep.equal({ hours: "1", minutes: "2", seconds: "33" }); });
});

describe("Using regexp with execGroups function", function () {
	var regex = namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?)(:(?<seconds>\\d\\d?))?");
	it("check result", function () { expect(regex.execGroups("1:2:33")).to.be.deep.equal({ hours: "1", minutes: "2", seconds: "33" }); });
	it("group with unmatched name should be undefined.", function () { expect(regex.execGroups("1:2")).to.be.deep.equal({ hours: "1", minutes: "2", seconds: undefined }); });
	it("if check fails, null should be returned.", function () { expect(regex.execGroups("1")).to.be.null; });
});

describe("Using regexp with groupsIndices property", function () {
	var regex = namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?)(:(?<seconds>\\d\\d?))?");
	var matches = "1:2".match(regex);
	it("check hours.", function () { expect(matches[regex.groupsIndices["hours"]]).to.be.equal("1"); });
	it("check minutes.", function () { expect(matches[regex.groupsIndices["minutes"]]).to.be.equal("2"); });
	it("group with unmatched name should be undefined.", function () { expect(matches[regex.groupsIndices["seconds"]]).to.be.undefined; });
	it("using invalide group name should be undefined.", function () { expect(matches[regex.groupsIndices["foo"]]).to.be.undefined; });
});

describe("NamedRegExp should bahave just like normal RegExp", function () {
	var regex = namedRegexp("^((\\d\\d?):(\\d\\d?))$");
	it("with test function", function () { expect(regex.test("1:2:33")).to.be.false; });
	it("with test function", function () { expect(regex.test("1:2")).to.be.true; });
	var result = regex.exec("1:3");
	it("with exec function", function () { expect(result[2]).to.be.equal("1"); });
	it("with exec function", function () { expect(result[3]).to.be.equal("3"); });
});

describe("Groups with duplicated name", function () {
	var regex = namedRegexp("^(?<first>\\d)(?<first>\\d)$");
	it("should return last group value.", function () { expect(regex.execGroups("12").first).to.be.equal("2"); });
});


describe("Some more complicated regex", function () {
	var urlRegexp = namedRegexp("^((?<schema>http[s]?|ftp):\\\/)?\\\/?(?<domain>[^:\\\/\\s]+)(?<path>(\\\/\\w+)*\\\/)(?<file>[\\w\\-\\.]+[^#?\\s]+)(?<query>.*)?$");
	var urlParts = urlRegexp.execGroups("https://www.google.com/some/path/search.html?a=0&b=1");
	it("url parse", function () { expect(urlParts).to.be.deep.equal({ schema: "https", domain: "www.google.com", path: "/some/path/", file: "search.html", query: "?a=0&b=1" }); });
});