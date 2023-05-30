const { Router } = require('express')
const { PrismaClient } = require('@prisma/client')
const { createRating, updateRating, getTourisms } = require('../../../controllers/api/tourism.controller')
const { authenticatedMiddleware } = require('../../../middlewares/authenticated')

const router = Router()

router.use(authenticatedMiddleware);

router.get('/', getTourisms)
router.post('/:tourismId/reviews', createRating)
router.post('/:tourismId/reviews/:reviewId', updateRating)

module.exports = router