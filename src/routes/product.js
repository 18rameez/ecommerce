const router = require("express").Router()
const productController = require("../controller/productController")
const verifyToken = require("../middleware/jwtverify")

router.get('/', productController.getAllProducts)
router.get('/search', productController.searchProduct)
router.get('/:id', productController.getProduct)
router.post('/', verifyToken,  productController.createProduct)
router.put('/:id', verifyToken, productController.updateProduct)
router.delete('/:id', verifyToken,  productController.deleteProduct)

router.post('/activate', verifyToken, productController.activateProduct)
router.post('/addtocart', verifyToken, productController.addToCart)
router.post('/purchase', verifyToken, productController.purchaseProduct)


module.exports = router;