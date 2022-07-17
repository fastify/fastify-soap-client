'use strict'

const soap = require('soap')
const fp = require('fastify-plugin')

module.exports = fp(function (fastify, options, next) {
  const url = options.url
  if (typeof url !== 'string') return next(new Error('options.url should be a string'))

  soap.createClientAsync(url, options.options)
    .then(function createClientHandler (client) {
      fastify.decorate('soapClient', client)
      next()
    })
    .catch(next)
}, {
  fastify: '4.x',
  name: '@fastify/soap-client'
})
