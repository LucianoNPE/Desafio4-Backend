const socketClient = io()

const productList = document.getElementById('productList')
const createProductForm = document.getElementById('productForm')

//Envio la info del form al socket del servidor para crear un nuevo producto
createProductForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // Obtenemos los datos del formulario como un objeto FormData
    const formData = new FormData(createProductForm)
    const jsonData = { }
    // Convertimos los datos del formulario en un objeto JSON.
    for(const [key, value] of formData.entries()) {
        jsonData[key] = value
    }
    jsonData.price = parseInt(jsonData.price)

    socketClient.emit('newProduct', jsonData)
    createProductForm.reset()
})

//Envio la info del form al socket del servidor para eliminar un producto
document.addEventListener('click', function (e) {
    //Verifico que en el click reciba la clase deleteProduct
    if (e.target) {
        if (e.target.classList.contains('deleteProduct')) {
            //Obtengo el id del producto.
            const prodId = parseInt(e.target.dataset.id);
            //Envio el id al socket para ser eliminado.
            socketClient.emit('deleteProduct', prodId);
        }
    }
});
  

//Recibo los productos del lado del server al cliente
socketClient.on('productsArray', (dataProducts) => {
    //Veo los productos del lado del cliente 
    console.log(dataProducts);
    //Renderizo los productos
    let productsElms = ''
    dataProducts.forEach(product => {
        productsElms += `<li>
                            <p>Nombre: ${product.title}</p>
                            <p>Descripcion: ${product.description}</p>
                            <p>Precio: ${product.price}</p>
                            <p>Codigo: ${product.code}</p>
                            <p>imagen: ${product.thumbnail}</p>
                            <p>Stock: ${product.stock}</p>
                            <p>Categoria: ${product.category}</p>
                            <button class="deleteProduct" data-id="${product.id}">Eliminar</button>
                        </li>`
    })
    console.log(productsElms);
    productList.innerHTML = productsElms


})
