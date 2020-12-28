import config from 'config'

import { Pagination } from '../models/pagination'
import { Plan } from '../models/plan'

const length: number = config.has('pageLength')
  ? config.get('pageLength')
  : 10

const url: string = config.has('baseUrl')
  ? config.get('baseUrl')
  : 'http://localhost:3000'

export class PaginationLib {
  constructor(
    private startId: number,
    private idList: number[]
  ) {
    this.addPageToList()
  }

  getPageList(): number[] {
    return this.idList
  }

  getPagination(
    nextPlan: Plan | null,
    numPlans: number
  ): Pagination {
    const pagination: Pagination = {}

    if (!!nextPlan && numPlans >= length) {
      pagination.next = { link: `${url}/${nextPlan.id!}` }
    }

    if (this.idList.length >= 1) {
      const nextIndex = !!nextPlan
        ? this.idList.indexOf(nextPlan.id!)
        : this.idList.length

      const previousIndex = nextIndex > -1
        ? nextIndex - 2
        : this.idList.length - 2

      const previousId = this.idList[previousIndex]

      if (previousId === 0 && this.idList.length > 1) {
        pagination.prev = { link: url }
      }

      if (previousId > 0 && this.idList.length > 1) {
        pagination.prev = { link: `${url}/${previousId}` }
      }
    }

    return pagination
  }

  private addPageToList(): void {
    if (!this.idList.includes(0) && this.startId > 0) {
      this.idList.unshift(0)
    }

    if (!this.idList.includes(this.startId) && this.startId !== 0) {
      this.idList.push(this.startId)
    }

    if (this.idList.length === 0 && this.startId === 0) {
      this.idList.push(this.startId)
    }

    return
  }
}