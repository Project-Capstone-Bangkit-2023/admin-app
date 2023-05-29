const { Router } = require('express')
const { PrismaClient } = require('@prisma/client')
const { createRating, updateRating } = require('../../../controllers/api/tourism.controller')
const { authenticatedMiddleware } = require('../../../middlewares/authenticated')

const router = Router()

router.use(authenticatedMiddleware);
router.get('/', (req, res) => {
  res.send('Tourisms list')
})

router.post('/:tourismId/reviews', createRating)
router.post('/:tourismId/reviews/:reviewId', updateRating)

module.exports = router