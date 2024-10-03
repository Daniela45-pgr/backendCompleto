const express = require("express");
const usuarioRutas = require("./rutas/rutasUsuarios");
const rutasVenta = require("./rutas/rutasVenta");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Esto es importante para que req.body funcione
app.use("/usuarios", usuarioRutas);
app.use("/ventas", rutasVenta);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servidor en http://localhost:" + port);
});

