import * as Controller from '@src/controller/index'

import type { RoutingControllersOptions } from 'routing-controllers';
import { dictToArray } from './helper/utils';

const controllers = dictToArray(Controller);

const routerConfig:RoutingControllersOptions = {
  controllers,
  middlewares:[],
  routePrefix:"/api"
}

export default routerConfig;