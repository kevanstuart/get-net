import {
  RequestParamHandler,
  NextFunction,
  Response,
  Handler,
  Request
} from 'express'
import config from 'config'

import { Filters, FilterParams } from '../models/filters'
import { Plan, ConnectionType } from '../models/plan'
import { Pagination } from '../models/pagination'
import { Provider } from '../models/provider'

import { objToCamelCase } from '../utils/convertCase'
import { ProviderLib } from '../lib/ProviderLib'
import { database } from '../utils/database'
import { PlanLib } from '../lib/PlanLib'

const providerLib = new ProviderLib(database)
const planLib = new PlanLib(database)

const length:number = config.has('pageLength')
  ? config.get('pageLength')
  : 10

// eslint-disable-next-line no-shadow
/* enum SortOptions {
  default = 'Default',
  speedDesc = 'Fastest Speed First',
  speedAsc = 'Slowest Speed First',
  priceAsc = 'Price (Low to High)',
  priceDesc = 'Price (High to Low)'
} */

interface GenericObject {
  [index: string]: string | number | boolean
}

const getFilters = async (
  postValues?: FilterParams
): Promise<Filters> => {
  const providers = await providerLib.getProviders()
  const providerFilter = providers.map(provider => {
    if (postValues && postValues.provider === provider.uuid) {
      provider.isSelected = true
    }

    return provider
  })

  const types = Object.entries(ConnectionType)
  const typeFilter = types.map(type => {
    const [id, name] = type

    const objType: {
      id: string,
      name: string,
      isSelected?: boolean
    } = { id, name }

    if (postValues && postValues.connectionType === id) {
      objType.isSelected = true
    }

    return objType
  })

  const speeds = await planLib.getSpeeds()
  const speedFilter = {
    values: speeds,
    from: (postValues && postValues.minSpeed)
      ? speeds.indexOf(parseInt(postValues.minSpeed, 10))
      : 0
  }

  const maxPrice = await planLib.getMaxPrice()
  const priceFilter = {
    max: maxPrice,
    from: (postValues && postValues.maxPrice)
      ? parseInt(postValues.maxPrice, 10)
      : 0
  }

  /* const sort = Object.entries(SortOptions)
  const sortFilter = sort.map(option => {
    const [id, name] = option

    const objType: {
      id: string,
      name: string,
      isSelected?: boolean
    } = { id, name }

    if (postValues && postValues.sort === id) {
      objType.isSelected = true
    }

    return objType
  }) */

  return {
    provider: providerFilter,
    speed: speedFilter,
    price: priceFilter,
    type: typeFilter,
    // sort: sortFilter
  }
}

const getPagination = (
  nextId: Plan | null,
  pageIds: number[],
  currentLength: number
): Pagination => {
  const pagination: Pagination = {}

  if (!!nextId && currentLength >= length) {
    pagination.next = {
      link: `http://localhost:3000/${nextId.id!}`
    }
  }

  if (pageIds.length >= 1) {
    const nextIndex = !!nextId
      ? pageIds.indexOf(nextId.id!)
      : pageIds.length

    const previousIndex = nextIndex > -1
      ? nextIndex - 2
      : pageIds.length - 2

    const previousId = pageIds[previousIndex]


    if (previousId === 0 && pageIds.length > 1) {
      pagination.prev = {
        link: `http://localhost:3000/`
      }
    }

    if (previousId > 0 && pageIds.length > 1) {
      pagination.prev = {
        link: `http://localhost:3000/${previousId}`
      }
    }
  }

  return pagination
}

export const checkParam: RequestParamHandler = (
  req: Request, res: Response, next: NextFunction, id: string
) => {
  if (id === 'favicon.ico' || id === '0') {
    req.params.id = ''
  }

	next()
}

/* export const postProcess: Handler = (
  req: Request, res: Response, next: NextFunction
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const inputs: GenericObject = req.body
  const { _csrf: csrfToken } = inputs

  // eslint-disable-next-line no-underscore-dangle
  delete inputs._csrf

  const postFilters = objToCamelCase(inputs)

  Object.keys(postFilters).forEach(key => {
    if (postFilters[key] === '0' ||
        postFilters[key] === 'default') {
      delete postFilters[key]
    }
  })

  next()
} */

export const postIndex: Handler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputs: GenericObject = req.body
    const { _csrf: csrfToken } = inputs

    // eslint-disable-next-line no-underscore-dangle
    delete inputs._csrf

    const postFilters: FilterParams = objToCamelCase(inputs)

    Object.keys(postFilters).forEach(key => {
      if (postFilters[key] === '0' ||
          postFilters[key] === 'default') {
        delete postFilters[key]
      }
    })

    if (!req.session.filters) {
      req.session.filters = postFilters
    }

    const listStartId = parseInt(req.params.id, 10) || 0

    const pageIds = (req.session.pageIds)
      ? req.session.pageIds
      : []

    if (!pageIds.includes(listStartId) && listStartId !== 0) {
      pageIds.push(listStartId)
      req.session.pageIds = pageIds
    }

    if (pageIds.length === 0 && listStartId === 0) {
      pageIds.push(0)
      req.session.pageIds = pageIds
    }

    const plans: Plan[] = await planLib.getPlans(listStartId, postFilters)
    const filters: Filters = await getFilters(postFilters)

    // eslint-disable-next-line no-console
    console.log(postFilters)

    const lastPlan = plans.length > length
      ? plans.pop()!
      : null

    const pagination = getPagination(lastPlan, pageIds, plans.length)
    const showPlans = plans.length > 0

    res.render('index', {
      plans,
      filters,
      csrfToken,
      showPlans,
      pagination,
      postFilters
    })
  } catch (e) {
    const error = new Error(e)
    next(error)
  }
}

export const getIndex: Handler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const listStartId = parseInt(req.params.id, 10) || 0

    const pageIds = (req.session.pageIds)
      ? req.session.pageIds
      : []

    if (!pageIds.includes(listStartId) && listStartId !== 0) {
      pageIds.push(listStartId)
      req.session.pageIds = pageIds
    }

    if (pageIds.length === 0 && listStartId === 0) {
      pageIds.push(0)
      req.session.pageIds = pageIds
    }

    const plans: Plan[] = await planLib.getPlans(listStartId)
    const filters: Filters = await getFilters()

    const lastPlan = plans.length > length
      ? plans.pop()!
      : null

    const pagination = getPagination(lastPlan, pageIds, plans.length)
    const showPlans = plans.length > 0
    const csrfToken = res.locals.csrfToken as string

    res.render('index', {
      plans,
      filters,
      csrfToken,
      showPlans,
      pagination
    })
  } catch (e) {
    const error = new Error(e)
    next(error)
  }
}

export const showIndex: Handler = (
  req: Request, res: Response
):void => {
  res.render('index', {})
}

export const getProviders: Handler = async (
  req: Request, res: Response
) => {
  const providers: Provider[] = await providerLib.getProviders()
  res.render('providers', { providers })
}

export const getContact: Handler = (
  req: Request, res: Response
) => {
  res.render('contact')
}
