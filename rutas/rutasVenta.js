var rutas = require("express").Router();
var { nuevaVenta, mostrarVentas, buscarVentaPorID, cancelarVenta, buscarProductos, buscarUsuarios, editarVenta } = require("../bd/ventaBD");

rutas.post("/nuevaVenta", async (req, res) => {
        const resultado = await nuevaVenta(req.body);
        res.json(resultado);
});

rutas.get("/mostrarVentas", async (req, res) => {
    const ventas = await mostrarVentas();
    res.json(ventas);
});

rutas.get('/buscarVentaPorID/:id', async (req, res) => {
    try {
        const venta = await buscarVentaPorID(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.json(venta);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la venta", error: error.message });
    }
});

rutas.get("/buscarUsuarios", async (req, res) => {
    const usuarios = await buscarUsuarios(req.query.q);
    res.json(usuarios);
});

rutas.get("/buscarProductos", async (req, res) => {
    const productos = await buscarProductos(req.query.q);
    res.json(productos);
});

rutas.put("/cancelarVenta/:id", async (req, res) => {
    const resultado = await cancelarVenta(req.params.id);
    res.json(resultado);
});

rutas.put("/editarVenta/:id", async (req, res) => {
    const { id } = req.params;
    const { idUsuario, idProducto, cantidad } = req.body;

    if (!idUsuario || !idProducto || !cantidad) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const resultado = await editarVenta(id, { idUsuario, idProducto, cantidad });

        if (!resultado.success) {
            return res.status(400).json({ message: resultado.message });
        }

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Error al editar la venta", error: error.message });
    }
});


module.exports = rutas;