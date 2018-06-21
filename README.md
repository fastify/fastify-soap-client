# fastify-soap-client

[![Build Status](https://travis-ci.org/fastify/fastify-soap-client.svg?branch=master)](https://travis-ci.org/fastify/fastify-soap-client)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

This plugin decorates your fastify instance with a SOAP client using [`soap` library](https://www.npmjs.com/package/soap)

## Install

```
npm i --save fastify-soap-client
```

## Usage

```js
const fastifySoapClient = require('fastify-soap-client')

fastify.register(fastifySoapClient, {
  url: 'http://www.dneonline.com/calculator.asmx?WSDL',
  // options: { soap library options }
})

const addSchema = {
  body: {
    type: 'array',
    items: [
      { type: 'number' },
      { type: 'number' }
    ]
  }
}
fastify.post('/add', addSchema, function (req, reply) {
  this.soapClient.Add({ intA: req.body[0], intB: req.body[1] }, function (err, result) {
    if (err) {
      reply.send(err)
      return
    }
    reply.send(result.AddResult)
  })
})
```

## Reference

- *url:* (required) the url where the wsdl is located. See [soap library reference](https://www.npmjs.com/package/soap#soapcreateclienturl-options-callback---create-a-new-soap-client-from-a-wsdl-url-also-supports-a-local-filesystem-path)
- *options:* the soap library options. See [soap library](https://www.npmjs.com/package/soap#options)

## License
Licensed under MIT
