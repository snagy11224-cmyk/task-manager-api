const express = require('express')
const { create, getAll, getOne, update, remove } = require('../controllers/taskController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(protect) // all routes below are protected

router.post('/', create)
router.get('/', getAll)
router.get('/:id', getOne)
router.put('/:id', update)
router.delete('/:id', remove)


module.exports = router