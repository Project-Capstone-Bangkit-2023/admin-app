const { Router } = require('express')
const { getTourisms, createTourism, deleteTourism, editTourism, updateTourism } = require('./../../../controllers/web/tourism.controller')
const uploader = require('./../../../utils/uploader')

const router = Router()

router.get('/', getTourisms)
router.get('/delete/:tourismId', deleteTourism)
router.get('/edit/:tourismId', editTourism)
router.post('/', uploader.single('file'), createTourism)
router.post('/edit/:tourismId', uploader.single('file'), updateTourism)

module.exports = router