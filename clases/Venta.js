class Venta {
    constructor(data) {
        this.idUsuario = data.idUsuario;
        this.idProducto = data.idProducto;
        this.fechaHora = new Date().toISOString(); 
        this.cantidad= data.cantidad;
        this.estatus = "vendido";
    }

    getVenta() {
        return {
            idUsuario: this.idUsuario,
            idProducto: this.idProducto,
            fechaHora: this.fechaHora,
            cantidad: this.cantidad,
            estatus: this.estatus
        };
    }
}

module.exports = Venta;

