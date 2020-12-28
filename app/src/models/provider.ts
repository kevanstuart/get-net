export interface Provider {
  id?: number
  uuid?: string
  name: string
  logo: URL
  isDeleted: boolean
  isSelected?: boolean
}