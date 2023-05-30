const { Router } = require('express')
const { login, register, verifyToken, refreshToken } = require('../../../controllers/api/auth.controller')
const { authenticatedMiddleware } = require('../../../middlewares/authenticated')

const router = Router()

router.route('/login').post(login);
router.route('/register').post(register);

router.use(authenticatedMiddleware);
router.route('/verify').get(verifyToken);
router.route('/refresh').post(refreshToken);

module.exports = router


