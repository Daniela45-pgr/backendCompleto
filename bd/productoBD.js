const { productosBD } = require("./Conexion");
const Producto = require("../clases/Producto");
const { encriptarPassword, validarPassword } = require("../middlewares/funcionesPassword");

function validar(producto) {
    var valido = false;
    if (producto.nombre != undefined && producto.precio != undefined && producto.stock != undefined) {

        valido = true;
    }
    return valido;
}
async function mostrarProductos() {
    const productos = await productosBD.get();
    productosValidos = [];
    productos.forEach(producto => {   
        //console.log(producto.id);
        const producto1 = new Producto({ id: producto.id, ...producto.data() });

        if (validar(producto1.datos)) {
            productosValidos.push(producto1.datos);
        }
    });


    return productosValidos;
}


async function buscarPorId(id) {
    var productosValido;
    const producto = await productosBD.doc(id).get();
    const producto1 = new Producto({ id: producto.id, ...producto.data() });
    if (validar(producto1.datos)) {
        productosValido = producto1.datos;
    }
   
    return productosValido;
}


async function nuevoProducto(data) {
    const producto1 = new Producto(data);
    var productosValido = {};
    var productoGuardado = true;

    if (validar(producto1.datos)) {
        productosValido = producto1.datos;
            await productosBD.doc().set(productosValido);
            productoGuardado = true;
    }

    return productoGuardado;
}


async function nuevoProducto(data) {
    const producto1 = new Producto(data); 
    var productosValido = {};
    var productoGuardado = false;
    if (validar(producto1.datos)) {
        productosValido = producto1.datos; 
            await productosBD.doc().set(productosValido); 
            productoGuardado = true;
    } 
    return productoGuardado; 
}


async function borrarProducto(id) {
    var productoBorrado = false;
    if (await buscarPorId(id) != undefined) {
        await productosBD.doc(id).delete();
        productoBorrado = true;
    }
    return productoBorrado;
}
module.exports = {
    mostrarProductos,
    nuevoProducto,
    borrarProducto,
    buscarPorId
}