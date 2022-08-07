import { FastifyPluginCallback } from 'fastify';
import { IOptions as SoapClientOptions, Client as SoapClient } from 'soap';

declare module 'fastify' {
  interface FastifyInstance {
    soapClient: SoapClient;
  }
}

interface FastifySoapClientPluginOptions {
  url: string;
  options?: SoapClientOptions;
}

declare const fastifySoapClient: FastifyPluginCallback<FastifySoapClientPluginOptions>

export default fastifySoapClient
