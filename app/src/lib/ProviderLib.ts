import { IDatabase } from 'pg-promise'

import { objToCamelCase } from '../utils/convertCase'
import { Provider } from '../models/provider'

export class ProviderLib {
  constructor(private db: IDatabase<any>) {}

  async getProviders(): Promise<Provider[]> {
    const sql = `SELECT * FROM "providers"`
    const result = await this.db.manyOrNone(sql)

    return result.map((row) => objToCamelCase(row) as Provider)
  }
}