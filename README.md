# http-capture

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Node.js express middleware for capturing HTTP request and responses

## Install

```bash
$ npm install http-capture
```

## API

```js
var httpCapture = require ('http-capture')
```

### httpCapture ()

Returns the HTTP capture middleware function, which by default writes to the current
working directory under .capture and formats the files as such: #_YYYY_MM_DD_hh_mm_ss_METHOD

## Examples

### Express / Connect

When using this module with express or connect, simply `app.use` the module.
Requests and responses that pass through the middleware will be captured to
in the current working directory under .capture

```js
var httpCapture = require ('http-capture'),
    express = require ('express')

var app = express()

app.use (httpCapture())
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/http-capture.svg?style=flat
[npm-url]: https://npmjs.org/package/http-capture
[downloads-image]: https://img.shields.io/npm/dm/http-capture.svg?style=flat
[downloads-url]: https://npmjs.org/package/http-capture

