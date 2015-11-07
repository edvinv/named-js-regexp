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
					var item = mapper[name];
					if (item === undefined) {
						mapper[name] = current;
					} else if (typeof item === "number") {
						mapper[name] = [item, current];
					} else {
						item.push(current);
					}
					i = nameEnd;
				}
			}
		}
		return { mapper: mapper, regexText: regexText };
	}

	function createNamedRegex(regexpText, flags) {
		var info = parse(regexpText),
			regex = new RegExp(info.regexText, flags);

		regex.groupsIndices = info.mapper;
		regex.exec = function (text) {
			var result = RegExp.prototype.exec.call(this, text);
			if (result) {
				var mapper = info.mapper;
				/**
				 * Returns value for group name or undefined. If same group name was defined multiple time, it returns first not undefined value.
				 * If all is set to true, then it returns array of all matched values.
				 */
				result.group = function (name, all) {
					var indices = mapper[name];
					if (typeof indices === "number") {
						// name group is defined only once
						return result[indices];
					} else if (all) {
						// name group is defined multiple time and because all is true, return array of all matched values
						return indices.map(function (v) { return result[v]; });
					} else if (indices) {
						// name group is defined multiple time and because all is false, return first not undefined matched value
						for (var i = 0; i < indices.length; ++i) {
							var value = result[indices[i]];
							if (value !== undefined) {
								return value;
							}
						}
					}
					return undefined;
				};
				var cachedGroups, cachedGroupsAll;
				result.groups = function (all) {
					var cg = all ? cachedGroupsAll : cachedGroups;
					if (cg) {
						return cg;
					}
					cg = {};
					for (var name in mapper) {
						cg[name] = result.group(name, all);
					}
					return all ? cachedGroupsAll = cg : cachedGroups = cg;
				};
			}
			return result;
		}
		regex.execGroups = function (text, all) {
			var result = this.exec(text);
			if (!result) {
				return null;
			}
			return result.groups(all);
		}

		return regex;
	}

	if (typeof exports !== "undefined") {
		module.exports = createNamedRegex;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return createNamedRegex;
		})
	} else {
		window.createNamedRegex = createNamedRegex;
	}


})(typeof window === "undefined" ? this : window);




