import { KoaMiddlewareInterface, Middleware, } from "routing-controllers";

@Middleware({ type: "after" })
class ErrorHandler implements KoaMiddlewareInterface {
  use(context: any, next: (err?: any) => Promise<any>): Promise<void> {
    return next();
  }
}


export {
  ErrorHandler
}