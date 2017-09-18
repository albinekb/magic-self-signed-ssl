# 🔒 Magic Self Signed SSL [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) ![](https://img.shields.io/npm/dm/magic-self-signed-ssl.svg) ![](https://img.shields.io/npm/v/magic-self-signed-ssl.svg)

```js
const magicSSL = require('magic-self-signed-ssl')
const express = require('express')
const server = express()

const SSL_PORT = 3443

...

const secureServer = await magicSSL(server, __dirname)

...

secureServer.listen(SSL_PORT, error => {
  if (error) throw error
  console.log(`> 🔒 SSL Ready on https://localhost:${SSL_PORT}`)
})
```
