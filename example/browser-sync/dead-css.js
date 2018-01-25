// Node.js 8.x
const fs = require("fs");
const { resolve } = require("path");
const postcss = require("postcss");
const postcssDeadCss = require("../../finding-dead-css.js"); // analod require('postcss-finding-dead-css');
const customUrls = require("./config.api.js");

const listFiles = [
  ["./src/bootstrap.css", "./public/assets/css/i-hate-this-vendor.css"],
  ["./src/docs.css", "./public/assets/css/docs.min.css"]
].map(fromTo => fromTo.map(filePath => resolve(__dirname, filePath)));

const PLUGINS = [postcssDeadCss({ deadApiUrl: customUrls.deadApiUrl })];

(async () => {
  try {
    for (const [from, to] of listFiles) {
      const CSS = fs.readFileSync(from);
      const { css, messages } = await postcss(PLUGINS).process(CSS, {
        from,
        to
      });
      messages
        .filter(({ type }) => type === "warning")
        .map(msg => console.log(msg.toString()));
      console.log(css);
      fs.writeFileSync(to, css);
    }
  } catch (e) {
    console.error(e);
  }
})();
