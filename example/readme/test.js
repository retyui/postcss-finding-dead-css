// Node.js 8.x
const fs = require("fs");
const { resolve } = require("path");
const postcss = require("postcss");
const postcssDeadCss = require("../../finding-dead-css.js"); // analod require('postcss-finding-dead-css');
const [from, to] = ["./input.css", "./output.css"].map(f => resolve(__dirname,f));
const CSS = fs.readFileSync(from);
const PLUGINS = [
  postcssDeadCss({
    // deadApiUrl: "http://my-analytic.server.com/cssdead", // default '/cssdead'
    // url({selector, startLine, startColumn, file}) { // custom url
    //   return encodeURI(
    //     `${this.deadApiUrl}?data=${JSON.stringify({
    //       selector,
    //       startLine,
    //       startColumn
    //     })}&file=${file}`
    //   );
    // }
  })
];

(async () => {
  try {
    const { css, messages } = await postcss(PLUGINS).process(CSS, {from,to});
    messages
      .filter(({ type }) => type === "warning")
      .map(msg => console.log(msg.toString()));
    console.log(css);
    fs.writeFileSync(to, css);
  } catch (e) {
    console.error(e);
  }
})();