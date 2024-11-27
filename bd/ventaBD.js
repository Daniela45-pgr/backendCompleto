const { ventasBD, usuariosBD, productosBD } = require("./Conexion");
const Venta = require("../clases/Venta");

async function nuevaVenta(data) {
    try {
        if (!data.idUsuario || !data.idProducto || !data.cantidad) {
        }
        const venta = new Venta(data);
        await ventasBD.add(venta.getVenta());

        return { success: true, message: "Venta creada exitosamente" };
    } catch (error) {
        console.error("Error al crear la venta:", error.message);
    }
}



async function mostrarVentas() {
    try {
        const snapshot = await ventasBD.where('estatus', '==', 'vendido').get();
        if (snapshot.empty) {
            return [];
        }
        const ventas = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const venta = doc.data();

                let nombreUsuario = "Usuario no encontrado";
                try {
                    const usuarioDoc = await usuariosBD.doc(venta.idUsuario).get();
                    if (usuarioDoc.exists) {
                        nombreUsuario = usuarioDoc.data().nombre || "Nombre no disponible";
                    }
                } catch (error) {
                    console.error("Error al obtener usuario:", error.message);
                }

                let nombreProducto = "Producto no encontrado";
                try {
                    const productoDoc = await productosBD.doc(venta.idProducto).get();
                    if (productoDoc.exists) {
                        nombreProducto = productoDoc.data().nombre || "Nombre no disponible";
                    }
                } catch (error) {
                    console.error("Error al obtener producto:", error.message);
                }

                return {
                    id: doc.id,
                    nombreUsuario,
                    nombreProducto,
                    cantidad: venta.cantidad || 0,
                    fechaHora: venta.fechaHora || new Date().toISOString(),
                    estatus: venta.estatus || "desconocido",
                };
            })
        );

        return ventas;
    } catch (error) {
        console.error("Error al obtener las ventas:", error.message);
        throw new Error("Error al obtener las ventas");
    }
}


async function cancelarVenta(id) {
    try {
        const ventaDoc = await ventasBD.doc(id).get();
        if (!ventaDoc.exists) {
            throw new Error("Venta no encontrada");
        }

        await ventasBD.doc(id).update({ estatus: "cancelado" });

        return { success: true, message: "Venta cancelada exitosamente" };
    } catch (error) {
        console.error("Error al cancelar venta:", error.message);
        return { success: false, message: "Error al cancelar la venta", error: error.message };
    }
}


async function buscarUsuarios(query) {
    try {
        const snapshot = await usuariosBD.get();
        if (snapshot.empty) return [];

        const usuarios = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return usuarios.filter((u) => u.nombre.toLowerCase().includes(query.toLowerCase()));
    } catch (error) {
        console.error("Error al buscar usuarios:", error.message);
        return [];
    }
}

async function buscarProductos(query) {
    try {
        const snapshot = await productosBD.get();
        if (snapshot.empty) return [];

        const productos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return productos.filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase()));
    } catch (error) {
        console.error("Error al buscar productos:", error.message);
        return [];
    }
}

async function buscarVentaPorID(id) {
    try {
        const venta = await ventasBD.doc(id).get();
        if (!venta.exists) {
            console.log("Venta no encontrada con ID:", id);
            return null;
        }

        const ventaData = { id: venta.id, ...venta.data() };

        const usuario = await usuariosBD.doc(ventaData.idUsuario).get();
        if (usuario.exists) {
            ventaData.nombreUsuario = usuario.data().nombre;
        } else {
            console.log("Usuario no encontrado con ID:", ventaData.idUsuario);
        }

        const producto = await productosBD.doc(ventaData.idProducto).get();
        if (producto.exists) {
            ventaData.nombreProducto = producto.data().nombre; 
        } else {
            console.log("Producto no encontrado con ID:", ventaData.idProducto);
        }

        return ventaData;
    } catch (error) {
        console.error("Error al buscar la venta por ID:", error.message);
        return null;
    }
}



async function editarVenta(id, { idUsuario, idProducto, cantidad }) {
    try {
        const ventaDoc = await ventasBD.doc(id).get();
        if (!ventaDoc.exists) {
            return { success: false, message: "Venta no encontrada" };
        }

        const usuarioDoc = await usuariosBD.doc(idUsuario).get();
        if (!usuarioDoc.exists) {
            return { success: false, message: "Usuario no encontrado" };
        }

        const productoDoc = await productosBD.doc(idProducto).get();
        if (!productoDoc.exists) {
            return { success: false, message: "Producto no encontrado" };
        }

        await ventasBD.doc(id).update({
            idUsuario,
            idProducto,
            cantidad,
        });

        return { success: true, message: "Venta actualizada exitosamente" };
    } catch (error) {
        console.error("Error al editar la venta:", error.message);
        throw new Error("Error al editar la venta: " + error.message);
    }
}

module.exports = { nuevaVenta, mostrarVentas, cancelarVenta, buscarUsuarios, buscarProductos, buscarVentaPorID, editarVenta };

