const { Router } = require('express')
const { PrismaClient } = require('@prisma/client')
const { createRating } = require('../../../controllers/api/tourism.controller')

const router = Router()

router.get('/', (req, res) => {
  res.send('Tourisms list')
})

router.post('/:tourismId/reviews', createRating)
router.post('/:tourismId/reviews/:reviewId', (req, res) => {

})

module.exports = router