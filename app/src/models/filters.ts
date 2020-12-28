import { Provider } from './provider'

interface DropdownFilter {
  id: string
  name: string
  isSelected?: boolean
}

interface Price {
  max: number
  from: number
}

interface Speed {
  values: number[]
  from: number
}

export interface FilterOutputs {
  type: DropdownFilter[]
  provider: Provider[]
  price: Price
  speed: Speed
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