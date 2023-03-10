const router = require("express").Router()
const userController = require("../controller/userController")
const verifyToken = require("../middleware/jwtverify")

router.post('/create', userController.createUser)
router.get('/getcart', verifyToken, userController.getCart )

module.exports = router;