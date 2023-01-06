import { Service } from 'typedi'

@Service()
export class AppService {
  success<T extends object>(data:T) {
    return {
      msg:"success",
      data,
      code:200
    }
  }
}