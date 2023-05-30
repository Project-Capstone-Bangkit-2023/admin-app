const { Router } = require('express')
const { PrismaClient } = require('@prisma/client')
const { getTourisms, getTourism, createRating, updateRating } = require('../../../controllers/api/tourism.controller')
const { authenticatedMiddleware } = require('../../../middlewares/authenticated')

const router = Router()

router.use(authenticatedMiddleware);
router.get('/', getTourisms)
router.get('/:tourismId/detail', getTourism)

router.post('/:tourismId/reviews', createRating)
router.post('/:tourismId/reviews/:reviewId', updateRating)

module.exports = router