import { Controller, Get, JsonController, Req } from 'routing-controllers'
import { Inject, Service } from 'typedi'

import { AppService } from '@src/services/index'
import { Request } from 'koa'

@Controller('/app')
@Service()
export class AppController {
  constructor(private appService: AppService) {}

  //@unAuth
  @Get('/test')
  test(@Req() request:Request ) {
    return this.appService.success({
      name:"whh"
    })
  }
}