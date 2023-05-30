const { Router } = require('express')
const { getTourismCategories } = require('../../../controllers/api/category.controller')
const { authenticatedMiddleware } = require('../../../middlewares/authenticated')

const router = Router()

router.use(authenticatedMiddleware);
router.route('/').get(getTourismCategories);

module.exports = router


