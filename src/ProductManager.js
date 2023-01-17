const fs = require('fs/promises')


class ProductManager{

    constructor(path){
        this.path = path
        this.fileExist()
    }

    async fileExist(){
       try {await fs.readFile(this.path)}
       catch{
        console.log(`Se creó un nuevo archivo con la ruta "${this.path}"`)
        await fs.writeFile(this.path, JSON.stringify([]))
       } 
    }

    async addProduct(productObject){
        
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);
        const dataLength = data.length + 1

        const {title, description, price, thumbnail, code, stock, status, category} = productObject;
        const newProduct = {
            title: title ?? "",
            description: description ?? "",
            price: price ?? "",
            thumbnail: thumbnail ?? [],
            code: code?? "",
            stock: stock ?? "",
            id: dataLength,
            status: status ?? "",
            category: category ?? ""
            }
        const validationArray = Object.values(newProduct)
        const emptyParam = validationArray.some(producto => producto === "")

        if (emptyParam) {
            const errorMessage = "No puede haber parámetros vacíos al cargar un producto."
            console.log(errorMessage)
            return errorMessage
        } 

        const codeValidation = data.find( product => product.code === code )
        if (!codeValidation){
            data.push( newProduct )
            try{
                await fs.writeFile(this.path, JSON.stringify(data))
            }
            catch(error){
                console.log("Este es el error", error)
            }
            finally{
                const successfulMessage ="Producto añadido"
                console.log(successfulMessage)
                return (successfulMessage, newProduct)
            } 
        } else {
            const errorMessage = "Error: el producto ya está cargado"
            console.log(errorMessage)
            return errorMessage
        }
    }

   async getProducts(){
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);
        //console.log(data);
        return data
    }

    async getProductById(idProduct){
        //Leo el archivo y lo guardo para manipularlo
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);

        const productExists =  data.find(product => product.id === idProduct) ?? false
        
        if (productExists === false) {
            console.log("Not Found")
            const indexProduct = false
            return {productExists, data, indexProduct}
        } 
         const indexProduct = data.findIndex((producto) => producto.id === idProduct)
        console.log("Producto:", productExists)
        return {productExists, data, indexProduct}
    }

    async updateProduct(idProduct, update ){
        const {productExists, data, indexProduct} = await this.getProductById(idProduct)

        if (productExists) {

            data[indexProduct] ={...productExists, ...update, ...{id: idProduct}}
            try{
                await fs.writeFile(this.path, JSON.stringify(data))
            }
            catch(error){
                console.log("Este es el error:", error)
            }
            finally{
                const successfulMessage = "Producto actualizado"
                console.log(successfulMessage)
                return (successfulMessage)
            }
        } else {

            const errorMessage = "Error: producto no encontrado"
            console.log(errorMessage)
            return errorMessage;
        }  
    }

    async deleteProduct( idProduct ){
        const {productExists, data, indexProduct} = await this.getProductById(idProduct)
        console.log("Este es el numero que llega", idProduct)
        if (productExists) {
        
            data.splice(indexProduct, 1)
            try{
                await fs.writeFile(this.path, JSON.stringify(data))
                const successfulMessage = "Producto eliminado"
                return successfulMessage
            }
            catch(error){
                console.log("Este es el error:", error)
            }
        } else {
            const errorMessage = "Error: producto no encontrado"
            return errorMessage
        }  
    }
}

module.exports = ProductManager 
