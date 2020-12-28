import { FilterParams, FilterOutputs } from '../models/filters';
import { ConnectionType } from '../models/plan';
import { Provider } from '../models/provider';

interface ConnectionFilter {
  id: string
  name: string
  isSelected?: boolean
}

const getConnections = (): ConnectionFilter[] =>
  Object.entries(ConnectionType)
    .map(type => {
      const [id, name] = type

      return { id, name } as ConnectionFilter
    })

export class FilterLib {
  private mergedValues: FilterParams = {}

  constructor(
    private filterValues: FilterParams,
    private savedValues: FilterParams
  ) {
    this.mergeFilters()
  }

  getFilters(
    providers: Provider[],
    maxPrice: number,
    speeds: number[]
  ): FilterOutputs {
    const provider = this.getProviderFilter(providers)
    const price = this.getMaxPriceFilter(maxPrice)
    const speed = this.getSpeedsFilter(speeds)

    const connections = getConnections()
    const type = this.getConnectionTypesFilter(connections)

    return {
      provider,
      speed,
      price,
      type
    }
  }

  getValues(): FilterParams {
    return this.mergedValues
  }

  private getProviderFilter(providers: Provider[]) {
    return providers.map(item => {
      if (this.mergedValues && this.mergedValues.provider === item.uuid) {
        item.isSelected = true
      }

      return item
    })
  }

  private getSpeedsFilter(speeds: number[]) {
    return {
      values: speeds,
      from: (this.mergedValues && this.mergedValues.minSpeed)
        ? speeds.indexOf(parseInt(this.mergedValues.minSpeed, 10))
        : 0
    }
  }

  private getMaxPriceFilter(maxPrice: number) {
    return {
      max: maxPrice,
      from: (this.mergedValues && this.mergedValues.maxPrice)
        ? parseInt(this.mergedValues.maxPrice, 10)
        : 0
    }
  }

  private getConnectionTypesFilter(types: ConnectionFilter[]) {
    return types.map(type => {
      if (this.mergedValues && this.mergedValues.connectionType === type.id) {
        type.isSelected = true
      }

      return type
    })
  }

  private mergeFilters(): void {
    this.mergedValues = { ...this.savedValues, ...this.filterValues}

    return
  }
}