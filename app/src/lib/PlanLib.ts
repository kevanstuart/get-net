import { IDatabase } from 'pg-promise'
import config from 'config'

import { PlanWithProvider, ConnectionType } from '../models/plan'
import { FilterParams, FilterOptions } from '../models/filters'

import { objToCamelCase } from '../utils/convertCase'
import { FilterSet } from './FilterSet'

interface MaxPlanResult {
  maxId: number
}

const length:number = config.has('pageLength')
  ? config.get('pageLength')
  : 10

export class PlanLib {
  constructor(private db: IDatabase<any>) {}

  async maxPlanId(): Promise<MaxPlanResult> {
    const sql = `
      SELECT MAX(id) as max_id FROM "plans-current" 
      WHERE is_deleted = false`

    const result = await this.db.many(sql)

    return objToCamelCase(result[0]) as MaxPlanResult
  }

  async getPlans(
    nextId: number | null = null,
    filters?: FilterParams
  ): Promise<PlanWithProvider[]> {
    const filterOptions: FilterOptions = {
      is_deleted: false
    }

    if (nextId) {
      filterOptions.id = nextId
    }

    if (filters && filters.connectionType) {
      filterOptions.connection = ConnectionType[filters.connectionType] as string
    }

    if (filters && filters.minSpeed) {
      filterOptions.download_speed = parseInt(filters.minSpeed, 10)
    }

    if (filters && filters.maxPrice) {
      filterOptions.price = parseInt(filters.maxPrice, 10)
    }

    if (filters && filters.provider) {
      filterOptions.provider_uuid = filters.provider
    }

    const filterSet = new FilterSet(filterOptions)
    const filterString = filterSet.toPostgres()

    const sql = `
      SELECT pc.*, p.name AS provider_name, p.logo AS provider_logo
      FROM "plans-current" pc
      JOIN "providers" p ON p.uuid = pc.provider_uuid AND p.is_deleted = false
      WHERE $1:raw
      ORDER BY pc.id ASC
      LIMIT ${length + 1}`

    const result = await this.db.manyOrNone(sql, [filterString])
    const mapped: PlanWithProvider[] = result.map(
      row => objToCamelCase(row) as PlanWithProvider
    )

    return mapped
  }

  async getSpeeds(): Promise<number[]> {
    const sql = `SELECT distinct(download_speed) as speed 
      FROM "plans-current" WHERE is_deleted = false 
      ORDER BY download_speed ASC`

    const result = await this.db.many(sql)

    return result.map((row: { speed: number }) => row.speed)
  }

  async getMaxPrice(): Promise<number> {
    const sql = `SELECT MAX(price) as price
      FROM "plans-current" WHERE is_deleted = false`

    const result: { price: number } = await this.db.one(sql)

    return result.price
  }
}