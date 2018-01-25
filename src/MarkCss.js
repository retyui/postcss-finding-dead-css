import { decl } from "postcss";

export class MarkCss {
	constructor(options = {}) {
		this._startApi = options.deadApiUrl ? options.deadApiUrl : "/cssdead";
		this._url =
			typeof options.url === "function"
				? options.url.bind(options)
				: ({ file, ...data }) => {
						return encodeURI(
							`${this._startApi}?data=${JSON.stringify(data)}&file=${file}`
						);
					};
	}

	getUrlByRule(rule) {
		const args = {
			selector: rule.selector,
			startLine: rule.source.start.line,
			startColumn: rule.source.start.column,
			file: rule.source.input.file
		};
		return this._url(args);
	}

	processCss(root, result) {
		root.walkRules(rule => {
			if (MarkCss.hasBorderImageDecl(rule, result) === false) {
				const borderDecl = decl({
					prop: "border-image-source",
					value: `url('${this.getUrlByRule(rule)}')`
				});
				rule.append(borderDecl);
			}
		});
	}

	static hasBorderImageDecl(rule, result) {
		let _result = false;
		rule.walkDecls(/border-image/, decl => {
			decl.warn(
				result,
				"You use the border-image css declaration :) . Selector will not be marked."
			);
			_result = true;
		});
		return _result;
	}
}
