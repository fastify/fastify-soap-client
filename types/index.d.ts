import { FastifyPluginCallback } from 'fastify';
import { IOptions as SoapClientOptions, Client as SoapClient } from 'soap';

declare module 'fastify' {
  interface FastifyInstance {
    soapClient: SoapClient;
  }
}

type FastifySoapClient = FastifyPluginCallback<fastifySoapClient.FastifySoapClientOptions>

declare namespace fastifySoapClient {
  export interface FastifySoapClientOptions {
    url: string;
    options?: SoapClientOptions;
  }
  export const fastifySoapClient: FastifySoapClient
  export { fastifySoapClient as default }
}

declare function fastifySoapClient(...params: Parameters<FastifySoapClient>): ReturnType<FastifySoapClient>
export = fastifySoapClient
