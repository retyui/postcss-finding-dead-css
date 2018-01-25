import { parse as urlParse } from "url";

const notDeadSelectors = new Map();
const gif1x1 = Buffer.from(
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
	"base64"
);
const sendTranparentGif = res => {
	// res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	res.setHeader("Content-Type", "image/gif");
	res.statusCode = 200;
	res.write(gif1x1);
	res.end();
};
const addSelector = (file, data) => {
	if (notDeadSelectors.has(file) === false) {
		notDeadSelectors.set(file, new Set());
	}
	notDeadSelectors.get(file).add(data);
};
const send404 = (res, text) => {
	res.setHeader("Content-Type", "text/html");
	res.statusCode = 404;
	res.statusMessage = "Not found";
	res.end(text);
};
const sendJson = (res, obj) => {
	res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	res.setHeader("Content-Type", "application/json");
	res.statusCode = 200;
	res.end(JSON.stringify(obj));
};

export default function getMiddleware(options = {}) {
	const config = {
		deadApiUrl: "/cssdead",
		statApiUrl: "/getStat",
		...options
	};
	return {
		middlewareCheckDead: (req, res, next) => {
			if (req.method === "GET" && req.url.startsWith(config.deadApiUrl)) {
				const { file, data } = urlParse(req.url, true).query;
				if (file && data) {
					addSelector(file, data);
					return sendTranparentGif(res);
				} else {
					// warning
				}
			}
			return next();
		},
		middlewareStat: (req, res, next) => {
			if (req.method === "GET" && req.url.startsWith(config.statApiUrl)) {
				const { file } = urlParse(req.url, true).query;
				if (file) {
					if (notDeadSelectors.has(file) === true) {
						return sendJson(res, [...notDeadSelectors.get(file)]);
					} else {
						return send404(res, `Not found file: \`${file}\``);
					}
				} else {
					return sendJson(
						res,
						[...notDeadSelectors].map(([file, setSelectors]) => [
							file,
							[...setSelectors]
						])
					);
				}
			}
			return next();
		}
	};
}
