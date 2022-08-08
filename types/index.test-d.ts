import Fastify from 'fastify'
import { expectType } from 'tsd'
import { Client as SoapClient} from 'soap'
import fastifySoapClient from '..'

const fastify = Fastify();

fastify.register(fastifySoapClient, { url: ''})

expectType<SoapClient>(fastify.soapClient)

fastify.post('/add', function (req, reply) {
  expectType<SoapClient>(this.soapClient)
  expectType<any>(this.soapClient.someCustomSoapAction)
})
