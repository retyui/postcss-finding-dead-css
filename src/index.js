import { plugin } from "postcss";
import { NAME } from "./config.js";
import { MarkCss } from "./MarkCss.js";
import _getMiddleware from "./middleware.js";

const finderDeadCssPlugin = plugin(NAME, options => {
	const markCode = new MarkCss(options);
	return (root, result) => {
		markCode.processCss(root, result);
	};
});

finderDeadCssPlugin.getMiddleware = _getMiddleware;
export default finderDeadCssPlugin;
