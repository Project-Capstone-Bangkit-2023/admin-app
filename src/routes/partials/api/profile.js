const { Router } = require('express')
const { getProfile, updateProfile } = require('../../../controllers/api/profile.controller')
const { authenticatedMiddleware } = require('../../../middlewares/authenticated')

const router = Router()

router.use(authenticatedMiddleware);
router.route('/:userId').get(getProfile);
router.route('/:userId/update').post(updateProfile);

module.exports = router


