const { Router } = require('express')
const { PrismaClient } = require('@prisma/client')
const { getTourisms, getRecommendations, getTourism, createRating, updateRating } = require('../../../controllers/api/tourism.controller')
const { authenticatedMiddleware } = require('../../../middlewares/authenticated')

const router = Router()

router.use(authenticatedMiddleware);
router.get('/', getTourisms)
router.get('/recomendations', getRecommendations)
router.get('/:tourismId/detail', getTourism)

router.get('/', getTourisms)
router.post('/:tourismId/reviews', createRating)
router.post('/:tourismId/reviews/:reviewId', updateRating)

module.exports = router