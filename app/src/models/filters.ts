import { Provider } from './provider'

interface DropdownFilter {
  id: string
  name: string
  isSelected?: boolean
}

export interface Filters {
  // sort: DropdownFilter[]
  type: DropdownFilter[]
  provider: Provider[]
  price: {
    max: number
    from: number
  }
  speed: {
    values: number[]
    from: number
  }
}

export interface FilterOptions {
  download_speed?: number
  provider_uuid?: string
  connection?: string
  is_deleted: boolean
  price?: number
  id?: number
}

export interface FilterParams {
  connectionType?: string
  minSpeed?: string
  provider?: string
  maxPrice?: string
}