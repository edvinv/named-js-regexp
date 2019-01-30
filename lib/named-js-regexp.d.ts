declare module "named-js-regexp" {
	interface NamedRegExpExecArray extends RegExpExecArray {
		groups(all?: boolean): { [key: string]: string } | null;
		group(name: string, all?: boolean): string;
	}

	interface NamedRegExp extends RegExp {
		exec(expression: string): NamedRegExpExecArray | null;
		execGroups(expression: string, all?: boolean): { [key: string]: string } | null;
		groupsIndices(): { [key: string]: number };
		replace(text: string, replacement: string | ((this: NamedRegExpExecArray | null, match?: string, ...params: any[]) => string)): string;
	}

	let createNamedRegexp: (pattern: string | RegExp | boolean, flags?: string) => NamedRegExp;
	export = createNamedRegexp;
}
