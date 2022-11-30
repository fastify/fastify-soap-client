'use strict'

const soap = require('soap')
const fp = require('fastify-plugin')

function fastifySoapClient (fastify, options, next) {
  const url = options.url
  if (typeof url !== 'string') return next(new Error('@fastify/soap-client: options.url should be a string'))

  soap.createClientAsync(url, options.options)
    .then(function createClientHandler (client) {
      fastify.decorate('soapClient', client)
      next()
    })
    .catch(next)
}

module.exports = fp(fastifySoapClient, {
  fastify: '4.x',
  name: '@fastify/soap-client'
})
module.exports.default = fastifySoapClient
module.exports.fastifySoapClient = fastifySoapClient
