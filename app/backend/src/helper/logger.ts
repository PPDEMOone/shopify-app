import { Signale, SignaleOptions } from 'signale';

enum loggerEnum {
  error = 'error',
  warn = 'warn'
}

const loggerOptions: SignaleOptions<keyof typeof loggerEnum> = {
  config:{
    displayFilename:true,
    displayTimestamp:true
  },
  scope: 'logger',
  types:{
    [loggerEnum.error]:{
      badge:'❌',
      color:'red',
      label:loggerEnum.error
    },
    [loggerEnum.warn]: {
      badge:'⚠️',
      color:'yellow',
      label:loggerEnum.warn
    }    
  }
}


export default new Signale(loggerOptions);
export {
  loggerEnum
}