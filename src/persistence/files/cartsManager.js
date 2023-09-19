import fs from "fs";
export class CartsManager {
  constructor(path) {
    this.pathFile = path;
  }
  fileExist() {
    return fs.existsSync(this.pathFile);
  }

  //Buscar todos los carritos
  async getCarts() {
    try {
      if (this.fileExist()) {
        const dataCarts = await fs.promises.readFile(this.pathFile, "utf-8");
        return JSON.parse(dataCarts);
      } else {
        throw new Error("No se pudo obtener los carritos");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  //Buscar por Id
  async getCartsById(id) {
    try {

      const carts = await this.getCarts();

      const cartFound = carts.find((prod) => prod.id === id);
      if (cartFound) {
        return cartFound;
      } else {
        throw new Error("Carrito no encontrado");
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("Carrito inexistente");
    }
  }
  //Leer y crear los carritos
  async createCart() {
    try {
      // Lee los carritos existentes
      const carts = await this.getCarts();

      // Crea un nuevo ID autoincremental para el carrito
      let newId;
      if (carts.length === 0) {
        newId = 1;
      } else {
        newId = carts[carts.length - 1].id + 1;
      }
      //Creo el carrito con el id y el producto vacio
      const newCart = {
        id: newId,
        products: [],
      };
      carts.push(newCart);
      // Sobrescribe el JSON con los carritos actualizados
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, "\t"));
      //retorno el carrito cargado
      return newCart;
    } catch (error) {
      throw new Error("No se puede crear el carrito");
    }
  }
  //Agregar productos al carrito
  async addProduct(cartId, productId, quantity) {
    try {
      //leo el archivo
      const carts = await this.getCarts();
      //busco carrito por id
      const cartFound = carts.find((prod) => prod.id === cartId);
      if (cartFound) {
        //Si existe el carrito, busco el producto por id
        const productFound = cartFound.products.find((prod) => prod.id === productId);
        if(productFound) {
          //Si existe el producto, se suma la cantidad
          productFound.quantity += quantity;
        }else{
          //Si NO existe el producto, se agrega al carrito
          cartFound.products.push({ 
            id: productId,
             quantity: quantity
            });
        }
        //Sobreescribo el archivo guardando los cambios
        await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, "\t"))
        return cartFound
        
      } else {
        throw new Error("Carrito inexistente");
      }
    } catch (error) {
      throw error;
    }
  }
}
