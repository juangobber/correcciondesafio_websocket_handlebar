const socket = io()

socket.emit('message', 'Hola amigos de youtube')

const title = document.getElementById('title')
const description = document.getElementById('description')
const price = document.getElementById('price')
const code = document.getElementById('code')
const stock = document.getElementById('stock')
const status = document.getElementById('status')
const category = document.getElementById('category')
const deleteId = document.getElementById('delete-id');

const addButton = document.getElementById('addButton');
const deleteButton = document.getElementById('deleteButton')

const productList = document.getElementById('productList')

addButton.addEventListener('click', (event)=>{
    socket.emit('message1', {title: title.value, description: description.value, price: price.value, code: code.value, stock: stock.value, status: status.value, category: category.value})
})

deleteButton.addEventListener('click', (event)=>{
    socket.emit('deleteProduct', deleteId.value )
})

socket.on('firstConection', (data)=>{
    console.log("esto es lo que llega", data)
    productList.innerHTML = ``
    data.forEach(element => {
        productList.innerHTML+=`<li> ${element.title} - ${element.description} - $${element.price} - stock ${element.stock} - ID: ${element.id} </li>`
    });
    //Escribir lo que llega en el HTML
})

socket.on('updatedList', (data)=>{
    productList.innerHTML = ``
    data.forEach(element => {        
        productList.innerHTML+=`<li> ${element.title} - ${element.description} - $${element.price} - stock ${element.stock} - ID: ${element.id} </li>`
    });
})