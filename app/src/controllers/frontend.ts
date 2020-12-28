import {
  RequestParamHandler,
  NextFunction,
  Response,
  Handler,
  Request
} from 'express'
import config from 'config'

import { FilterParams } from '../models/filters'
import { Provider } from '../models/provider'
import { Plan } from '../models/plan'

import { objToCamelCase } from '../utils/convertCase'
import { database } from '../utils/database'

import { PaginationLib } from '../lib/Pagination'
import { ProviderLib } from '../lib/Provider'
import { FilterLib } from '../lib/Filter'
import { PlanLib } from '../lib/Plan'

const providerLib = new ProviderLib(database)
const planLib = new PlanLib(database)

const length:number = config.has('pageLength')
  ? config.get('pageLength')
  : 10

interface GenericObject {
  [index: string]: string | number | boolean
}

export const checkParam: RequestParamHandler = (
  req: Request, res: Response, next: NextFunction, id: string
) => {
  if (id === 'favicon.ico' || id === '0') {
    req.params.id = ''
  }

	next()
}

export const postProcess: Handler = (
  req: Request, res: Response, next: NextFunction
) => {
  const inputs = req.body as GenericObject
  const { _csrf: token } = inputs

  res.locals.csrfToken = token

  // eslint-disable-next-line no-underscore-dangle
  delete inputs._csrf

  const postFilters: FilterParams = objToCamelCase(inputs)

  res.locals.postFilters = postFilters

  next()
}

export const getProcess: Handler = (
  req: Request, res: Response, next: NextFunction
) => {
  res.locals.postFilters = {}

  next()
}

export const showIndex: Handler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const filterParams = res.locals.postFilters as FilterParams

    const startId = parseInt(req.params.id, 10) || 0

    const paginationLib = new PaginationLib(
      startId,
      req.session.pageList || []
    )

    const filterLib = new FilterLib(filterParams, req.session.filters)

    const filters = filterLib.getFilters(
      await providerLib.getProviders(),
      await planLib.getMaxPrice(),
      await planLib.getSpeeds()
    )

    req.session.filters = filterLib.getValues()
    req.session.pageList = paginationLib.getPageList()

    const plans: Plan[] = await planLib.getPlans(
      startId,
      filterLib.getValues()
    )

    const nextPlan = plans.length > length
      ? plans.pop()!
      : null

    const pagination = paginationLib.getPagination(nextPlan, plans.length)

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
