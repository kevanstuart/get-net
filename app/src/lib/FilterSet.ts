import { pgp } from '../utils/database'

interface FilterObject {
  download_speed?: number
  provider_uuid?: string
  connection?: string
  is_deleted: boolean
  price?: number
  id?: number
}

export class FilterSet {
  rawType = true

  constructor(private filters: FilterObject) {
    if (!filters || typeof filters !== 'object') {
      throw new TypeError('Parameter \'filters\' must be an object.')
    }
    this.filters = filters
    this.rawType = true
  }

  toPostgres(): string {
    const keys = Object.keys(this.filters)
    const strings = keys.map((k: string) => {
      let filter = 'pc.' + pgp.as.name(k)

      if (k === 'download_speed') {
        filter += ' >= ${' + k + '}'
      } else if (k === 'price') {
        filter += ' <= ${' + k + '}'
      } else {
        filter += ' = ${' + k + '}'
      }

      return filter
    }).join(' AND ')

    return pgp.as.format(strings, this.filters)
  }
}