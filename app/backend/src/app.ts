import 'reflect-metadata'
import '@src/helper/load'

import { useContainer, useKoaServer } from 'routing-controllers';

import Container from 'typedi';
import Koa from 'koa';
import koaLogger from 'koa-logger';
import routerConfig from '@src/router';
import { useKoaMiddleWare } from '@src/helper/useMiddleware';

const koaInstance = new Koa();

const PORT = parseInt(process.env.BACKEND_PORT, 10) || 3001;

const createApp = (listeningCb: () => void) => {

  useContainer(Container);
  useKoaMiddleWare(koaInstance, [koaLogger()])

  const app = useKoaServer(koaInstance, routerConfig);
  app.listen(PORT, listeningCb);
}

createApp(() => {
  console.log(`sever is running at ${PORT}`)
})
