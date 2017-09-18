# 🔒 Magic Self Signed SSL

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
