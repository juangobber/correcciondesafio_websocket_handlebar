const {Router} = require('express')
const router = Router()

const productManager = require('../ProductManager')
const products = new productManager('./src/listadoProductos.json')

router.get('/', async (req, res)=>{
    const productList = await products.getProducts()
    res.render('home', {productList})
})

module.exports = router;