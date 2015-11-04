"use strict";
(function (window) {
	function parse(text) {
		var i, c, nameEnd, name,
			mapper = {},
			current = 0,
			regexText = "";

		for (i = 0; i < text.length; ++i) {
			c = text[i];
			regexText += c;
			if (c === "(" && text[i - 1] !== "\\") {
				current++;
				if (text[i + 1] === "?" && text[i + 2] === "<") {
					nameEnd = text.indexOf(">", i + 3);
					if (nameEnd < 0) { throw new Error("'>' missing in named group."); };
					name = text.substring(i + 3, nameEnd);
					mapper[name] = current;
					i = nameEnd;
				}
			}
		}
		return { mapper: mapper, regexText: regexText };
	}

	function createRegex(regexpText, flags) {
		var info = parse(regexpText),
			regex = new RegExp(info.regexText, flags);

		regex.groupsIndices = info.mapper;
		regex.exec = function (text) {
			var result = RegExp.prototype.exec.call(this, text);
			if (result) {
				result.group = function (name) {
					return this.groups[name];
				};
				result.groups = {};
				for (var name in info.mapper) {
					result.groups[name] = result[info.mapper[name]];
				}
			}
			return result;
		}
		regex.execGroups = function (text) {
			var result = this.exec(text);
			if (!result) {
				return null;
			}
			return result.groups;
		}

		return regex;
	}

	if (typeof exports !== "undefined") {
		module.exports = createRegex;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return createRegex;
		})
	} else {
		window.createNamedRegex = createRegex;
	 }


})(typeof window === "undefined" ? this : window);




