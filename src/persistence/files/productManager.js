import fs from 'fs';

export class ProductManager{
    //filePath contiene la ruta del Json
    constructor(filePath) {
        this.filePath = filePath;
    }
    fileExist() {
        return fs.existsSync(this.filePath);
    }
    //Lee y trae los productos
    async getProducts() {
        try {
            if (this.fileExist()) {
                const data = await fs.promises.readFile(this.filePath, 'utf-8');
                return JSON.parse(data);
            } else {
                throw new Error('No es posible leer el archivo');
            }
        } catch (error) {
            console.log(error.message)
            throw error;
        }
    }
    //Buscar por id
    async getProductById(id){ 

        try {

            const products = await this.getProducts();

            const prodFound = products.find(prod => prod.id === id)
            if(prodFound) {
                return prodFound
            }
            else{
                console.log('Producto inexistente');
                throw new Error('Producto no encontrado');
            }
            
        } catch (error) {
            console.log(error.message);
            throw new Error ('Producto inexistente')
        }

    }
    //Lee y agrega productos
    async createProduct(infoProduct) {
        try {
            if (!infoProduct.title || !infoProduct.description || !infoProduct.price || 
                !infoProduct.thumbnail || !infoProduct.code || !infoProduct.stock 
                || !infoProduct.category) {
                console.log('Campos obligatorios');
                throw new Error('Campos obligatorios');
                
            }

            const products = await this.getProducts();
            
            //Creo el id autoincremental
            let newId;
            if (products.length === 0) {
                newId = 1
            } else {
                newId = products[products.length - 1].id + 1;
            }
            
            //Verifico si el codigo se repite y no lo agrego
            const codeExist = products.some( prod => prod.code === infoProduct.code)
            if(codeExist){
                //alert("El código " + infoProduct.code + " ya existe, no sera agregado.")
                console.log('El código ' + infoProduct.code + ' ya existe, no sera agregado.');
                return "El código " + infoProduct.code + " ya existe, no sera agregado."

            } else{
                infoProduct.id = newId
                products.push(infoProduct);
            }
            //Sobreescribo el con el nuevo producto el archivo
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, '\t'));
            console.log('Producto creado con exito');
            return infoProduct

            
        } catch (error) {
            throw error;
        }
    }

    //Metodo que actualiza
    async updateProduct(id, product) {
        try {
            // Leer lista de productos existentes.
            const products = await this.getProducts();
            
            // Buscar el índice del producto que se va a actualizar.
            const updateIndex = products.findIndex(prod => prod.id === id);
    
            if (updateIndex === -1) {
                throw new Error('Producto no encontrado');
            }
    
            // Verificar si el campo 'id' está presente en el objeto 'product'.
            if (product.hasOwnProperty('id') && product.id !== id) {
                throw new Error('No está permitido modificar el ID del producto.');
            }
            // Actualizar los campos del producto con los nuevos valores (excepto el ID).
            products[updateIndex] = {
                ...products[updateIndex],
                ...product
            };
    
            // Sobrescribir el JSON con los productos actualizados.
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, '\t'));
            console.log('Producto actualizado con éxito');
            return products[updateIndex];
        } catch (error) {
            console.log(error.message);
            throw new Error('Archivo inexistente o no se puede actualizar');
        }
    }

    //Eliminar producto
    async deleteProduct(id) {
        try {
            //leo el archivo
            const products = await this.getProducts()
            //verifico si exite el id
            const existId = products.find(prod => prod.id === id)
            if(existId){
                //busco el producto a eliminar
                const deleteId = products.filter(prod => prod.id !== id);
                //sobreescribo el archivo sin el 
                await fs.promises.writeFile(this.filePath, JSON.stringify(deleteId, null, '\t'));
                console.log('Producto eliminado con exito');
            } else {
                console.log('Producto inexistente');
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.log(error.message);
            throw new Error('El Producto a eliminar es inexistente');
        }
    }

}