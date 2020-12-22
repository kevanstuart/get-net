// eslint-disable-next-line no-shadow
export enum ConnectionType {
  adsl = 'ADSL',
  fiber = 'Fiber',
  lte = '4G LTE+'
}

// eslint-disable-next-line no-shadow
export enum PriceModel {
  perMonth = 'per month',
  perYear = 'per year'
}

export interface Plan {
  id?: number
  uuid?: string
  name: string
  providerUuid: string
  downloadSpeed: number
  uploadSpeed: number
  connection: ConnectionType
  price: number
  priceModel: PriceModel
  link: URL
  notes?: string
  updated_time: Date
  isDeleted: boolean
}

export interface PlanWithProvider extends Plan {
  providerName: string
  providerLogo?: string
}