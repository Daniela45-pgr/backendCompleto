const { ventasBD, productosBD, usuariosBD } = require("./Conexion");
const Venta = require("../clases/Venta");

async function nuevaVenta(data) {
    try {
        // Validar que se proporcionen los campos requeridos
        if (!data.idUsuario || !data.idProducto) {
            throw new Error("idUsuario y idProducto son requeridos");
        }

        const venta = new Venta(data);
        await ventasBD.add(venta.getVenta); // Aquí solo se envían los campos necesarios

        console.log("Venta creada exitosamente:", venta.getVenta);
        return { success: true, message: "Venta creada exitosamente" };
    } catch (error) {
        console.error("Error al crear la venta:", error.message);
        return { success: false, message: "Error al crear la venta", error: error.message };
    }
}

async function mostrarVentas() {
    try {
        const snapshot = await ventasBD.get();
        const ventas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Ventas encontradas:", ventas); // Mostrar todas las ventas en la terminal
        return ventas;
    } catch (error) {
        console.error("Error al mostrar las ventas:", error.message); // Mostrar el error en la terminal
        return [];
    }
}

async function buscarVentaPorID(id) {
    try {
        // Obtener la venta por ID
        const venta = await ventasBD.doc(id).get();
        if (!venta.exists) {
            console.log("Venta no encontrada con ID:", id);
            return null;
        }

        const ventaData = { id: venta.id, ...venta.data() };

        // Obtener el nombre del usuario con el idUsuario
        const usuario = await usuariosBD.doc(ventaData.idUsuario).get();
        if (usuario.exists) {
            ventaData.nombreUsuario = usuario.data().nombre; // Asegúrate de que en la base de datos de usuarios tienes el campo 'nombre'
        } else {
            console.log("Usuario no encontrado con ID:", ventaData.idUsuario);
        }

        // Obtener el nombre del producto con el idProducto
        const producto = await productosBD.doc(ventaData.idProducto).get();
        if (producto.exists) {
            ventaData.nombreProducto = producto.data().nombre; // Asumiendo que tienes el campo 'nombre' para los productos
        } else {
            console.log("Producto no encontrado con ID:", ventaData.idProducto);
        }

        console.log("Venta encontrada:", ventaData);
        return ventaData;
    } catch (error) {
        console.error("Error al buscar la venta por ID:", error.message);
        return null;
    }
}




async function cancelarVenta(id) {
    try {
        const venta = await ventasBD.doc(id).get();
        if (!venta.exists) {
            console.log("Venta no encontrada con ID para cancelar:", id); // Mostrar mensaje si no se encuentra la venta
            return { success: false, message: "Venta no encontrada" };
        }
        await ventasBD.doc(id).update({ estatus: "cancelado" });
        console.log("Venta cancelada exitosamente con ID:", id); // Mostrar mensaje si la venta se cancela
        return { success: true, message: "Venta cancelada exitosamente" };
    } catch (error) {
        console.error("Error al cancelar la venta:", error.message); // Mostrar el error en la terminal
        return { success: false, message: "Error al cancelar la venta", error: error.message };
    }
}

module.exports = {
    nuevaVenta,
    mostrarVentas,
    buscarVentaPorID,
    cancelarVenta,
};
