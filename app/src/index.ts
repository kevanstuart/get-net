import express, {
  RequestHandler,
  NextFunction,
  Application,
  Response,
  Handler,
  Request
} from 'express'
import session, { SessionOptions } from 'express-session'
import { FilterParams } from './models/filters'
import mustacheExpress from 'mustache-express'
import createMemoryStore from 'memorystore'
import compression from 'compression'
import parser from 'body-parser'
import csurf from 'csurf'
import path from 'path'

declare module "express-session" {
  interface Session {
    pageList: number[]
    filters: FilterParams
  }
}

const application: Application = express()

const viewPath = path.join(__dirname, '../', 'views')

const memoryStore = createMemoryStore(session)
const storeOptions: SessionOptions = {
  store : new memoryStore({ checkPeriod: 86400000 }),
  secret: 'whichisp_kevanstuart_7100',
  saveUninitialized: false,
  resave: false
}

const csrf: RequestHandler = csurf();
const useCsrf: Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.csrfToken = req.csrfToken()
  next()
}

application
  .engine('mustache', mustacheExpress())
  .set('view engine', 'mustache')
  .set('views', viewPath)
  .use(express.static('public', { maxAge:'1w' }))
  .use(parser.urlencoded({ extended: true }))
  .use(compression({ threshold: 0 }))
  .use(session(storeOptions))
  .use(parser.json())
  .use(csrf)
  .use(useCsrf)

import { frontendRoutes } from './routes/frontend'
application.use(frontendRoutes)

application.listen('3000')