const express = require('express')
const PORT = 8080
const app = express()

const {Server} = require('socket.io')
const handlebars = require('express-handlebars')

const viewsRoutes = require('../src/routes/views.routes')
const productManager = require('./ProductManager')
const products = new productManager('./src/listadoProductos.json')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

//Initialize handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


//Inicializo las routes
app.use(viewsRoutes)

//Run the server
const httpServer = app.listen(PORT, ()=>{
    console.log("Server is up and running on port", PORT)
})

// Servidor Socket
const socketServer = new Server(httpServer)

//Escuchar evento con on
app.use('/realtimeproducts', async (req, res) =>{
    await res.render('realtimeproducts')
    const productList = await products.getProducts()

        socketServer.on('connection', (socket)=>{
        console.log("Nuevo cliente conectado")
        console.log(socket.id)
        
        socket.emit('firstConection', productList)

        socket.on('message1', async (data)=>{
            await products.addProduct(data)
            
            const updatedProductList = await products.getProducts()
            //console.log(updatedProductList)
            socket.emit('updatedList',updatedProductList)
        })

        socket.on('deleteProduct', async (data)=>{
            console.log("Este nro llega al server", data)
            await products.deleteProduct(+data)
            const updatedProductList = await products.getProducts()
            socket.emit('updatedList',updatedProductList)

        })

    }) 
})


