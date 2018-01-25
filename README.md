# postcss-finding-dead-css

[![npm](https://img.shields.io/npm/v/postcss-finding-dead-css.svg)](https://www.npmjs.com/package/postcss-finding-dead-css)
[![David](https://img.shields.io/david/retyui/postcss-finding-dead-css.svg)](https://david-dm.org/retyui/postcss-finding-dead-css)

PostCSS plugin that help identifying the dead code. [Idea](https://csswizardry.com/2018/01/finding-dead-css/). Only my plugin uses only the css border-image property.


## Install

```bash
yarn add -D postcss-finding-dead-css
# or npm install --save-dev postcss-finding-dead-css
```

## Input:

```css
body {
  margin: 0;
}

.alredy-use-border-image {
  border-image: linear-gradient(red, yellow) 10;
}
```

## Output:

```css
body {
  margin: 0;
  border-image-source: url('/cssdead?data=%7B%22selector%22:%22body%22,%22startLine%22:1,%22startColumn%22:1%7D&file=/path/to/file.css');
}

.alredy-use-border-image {
  border-image: linear-gradient(red, yellow) 10;
}
```

## Usage ([examples](https://github.com/retyui/postcss-finding-dead-css/tree/master/example/))

```js
// Node.js 8.x
const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");
const postcss = require("postcss");
const postcssDeadCss = require("postcss-finding-dead-css");
const [from, to] = ["./input.css", "./output.css"].map(f =>
  resolve(__dirname, f)
);
const CSS = readFileSync(from);
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
    const { css, messages } = await postcss(PLUGINS).process(CSS, { from, to });
    messages
      .filter(({ type }) => type === "warning")
      .map(msg => console.log(msg.toString()));
    console.log(css);
    writeFileSync(to, css);
  } catch (e) {
    console.error(e);
  }
})();
```

## Options
### `deadApiUrl` , type: `String`, required: `false`
default: `'/cssdead'`

Url to back-end api, I send two parametrs `type` and `file`

`type` - has json `{ selector, startLine, startColumn }`

`file` - path to source css file

### `url` , type: `Function`, required: `false`

This function help you customize url generation


## [Middleware](https://github.com/retyui/postcss-finding-dead-css/tree/master/src/middleware.js)

### Usage ([example](https://github.com/retyui/postcss-finding-dead-css/tree/master/example/browser-sync/server.js))

```js
// Node.js 8.x
// example get middlewares:
const {getMiddleware} = require('postcss-finding-dead-css');
const {middlewareCheckDead, middlewareStat} = getMiddleware(options);

// Express.js
const app = express();

app.get(options.deadApiUrl, middlewareCheckDead);
```

### Options

```js
{
  deadApiUrl: '/custom/path',      // defualt: '/cssdead'
  statApiUrl: '/custom/path/stat'  // defualt: '/getStat'
}
```