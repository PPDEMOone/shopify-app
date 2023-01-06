import koa, { Middleware } from 'koa'

type Koa = InstanceType<typeof koa>

const useKoaMiddleWare = <KoaAppInstance extends Koa = Koa>(app: KoaAppInstance ,middlewareArr?: Middleware[]): KoaAppInstance => {
  middlewareArr.reduce((app, middleware) => {
    app.use(middleware)
    return app
  },app)
  
  return app
}

export {
  useKoaMiddleWare
}
