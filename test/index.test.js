'use strict'

const { readFileSync } = require('node:fs')
const { createServer } = require('node:http')
const { join } = require('node:path')
const t = require('tap')
const fastifyBuilder = require('fastify')
const soap = require('soap')

const fastifySoapClient = require('..')

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
  let httpServer

  t.beforeEach(async () => {
    const calculatorService = {
      Calculator: {
        CalculatorSoap: {
          Add: function (args) {
            return { AddResult: args.intA + args.intB }
          }
        }
      }
    }
    const xml = readFileSync(join(__dirname, 'calculator.wsdl'), 'utf8')

    httpServer = createServer(function (request, response) {
      response.end('404: Not Found: ' + request.url)
    })

    httpServer.listen(51515)
    soap.listen(httpServer, '/calculator', calculatorService, xml)
  })

  t.afterEach(async () => {
    httpServer.close()
  })

  t.test('ok', t => {
    t.plan(3)
    const fastify = fastifyBuilder({ logger: { level: 'silent' } })

    fastify.register(fastifySoapClient, {
      url: join(__dirname, 'calculator.wsdl')
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
      t.equal(err.message, '@fastify/soap-client: options.url should be a string')
    })
  })

  t.end()
})
