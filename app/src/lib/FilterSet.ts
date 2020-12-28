import { FilterOptions } from '../models/filters'
import { pgp } from '../utils/database'

export class FilterSet {
  rawType = true

  constructor(private filters: FilterOptions) {
    if (!filters || typeof filters !== 'object') {
      throw new TypeError('Parameter \'filters\' must be an object.')
    }
    this.filters = filters
    this.rawType = true
  }

  toPostgres(): string {
    const keys = Object.keys(this.filters)

    const strings = keys
      .filter((k: string) =>
        this.filters[k] !== '0' &&
        this.filters[k] !== undefined &&
        !(k === 'price' && this.filters[k] === 0)
      )
      .map((k: string) => {
        let queryFilter = 'pc.' + pgp.as.name(k)

        if (k === 'download_speed' || k === 'id') {
          queryFilter += ' >= ${' + k + '}'
        } else if (k === 'price') {
          queryFilter += ' <= ${' + k + '}'
        } else {
          queryFilter += ' = ${' + k + '}'
        }

        return queryFilter
      })
      .join(' AND ')

    return pgp.as.format(strings, this.filters)
  }
}