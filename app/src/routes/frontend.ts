import express, { Router } from 'express'

import {
  showIndex,
  getProcess,
  postProcess,
  checkParam,
  getContact,
  getProviders
} from '../controllers/frontend'

const router: Router = express.Router()

router.get('/providers', getProviders)
router.get('/contact', getContact)

router.param('id', checkParam)
router.get('/:id?', getProcess, showIndex)
router.post('/:id?', postProcess, showIndex)

export { router as frontendRoutes }