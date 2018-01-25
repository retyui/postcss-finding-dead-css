// Node.js 8.x
const {getMiddleware} = require("../finding-dead-css.js"); // analod require('postcss-finding-dead-css');
const browserSync = require("browser-sync").create();
const customUrls = require('./config.api.js');
const {middlewareCheckDead, middlewareStat} = getMiddleware({
	deadApiUrl: customUrls.deadApiUrl, // defualt '/cssdead'
	statApiUrl: customUrls.statApiUrl // defualt '/getStat'
});

const port = 3069;
browserSync.init({
	port,
	server: {
		baseDir: "./public/",
		middleware: [
			middlewareCheckDead,
			middlewareStat
		]
	}
});

console.log(`[DEMO] Server: listening on port ${port}`);
console.log(`[DEMO] Opening: http://localhost:${port}/ for create stat`);
console.log(`[DEMO] Opening: http://localhost:${port}${customUrls.statApiUrl} for view stat`);
