import express, { Router } from 'express'

import {
  getIndex,
  postIndex,
  checkParam,
  getContact,
  getProviders
} from '../controllers/frontend'

const router: Router = express.Router()

router.get('/providers', getProviders)
router.get('/contact', getContact)

router.param('id', checkParam)
router.get('/:id?', getIndex)
router.post('/:id?', postIndex)

export { router as frontendRoutes }