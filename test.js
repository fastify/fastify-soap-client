'use strict'

const t = require('tap')
const fastifyBuilder = require('fastify')

const fastifySoapClient = require('./index')

const addSchema = {
  body: {
    type: 'array',
    items: [
      {
        type: 'number'
      },
      {
        type: 'number'
      }
    ]
  }
}

t.test('fastify-soap-client', t => {
  t.test('ok', t => {
    t.plan(3)
    const fastify = fastifyBuilder({ logger: { level: 'trace' } })

    fastify.register(fastifySoapClient, {
      url: 'http://www.dneonline.com/calculator.asmx?WSDL'
    })
    fastify.get('/describe', function (req, reply) {
      reply.send(this.soapClient.describe())
    })
    fastify.post('/add', addSchema, function (req, reply) {
      this.soapClient.Add({ intA: req.body[0], intB: req.body[1] }, function (err, result) {
        if (err) {
          reply.send(err)
          return
        }
        reply.send(result.AddResult)
      })
    })

    fastify.inject({
      method: 'GET',
      url: '/describe'
    })
      .then(response => {
        t.strictSame(response.statusCode, 200)
      })

    fastify.inject({
      method: 'POST',
      url: '/add',
      payload: [2, 4]
    })
      .then(response => {
        t.strictSame(response.statusCode, 200)
        t.strictSame(JSON.parse(response.payload), 6)
      })
  })

  t.test('url is required', t => {
    t.plan(1)
    const fastify = fastifyBuilder({ logger: { level: 'trace' } })

    fastify.register(fastifySoapClient)

    fastify.ready(function (err) {
      t.equal(err.message, 'options.url should be a string')
    })
  })

  t.end()
})
