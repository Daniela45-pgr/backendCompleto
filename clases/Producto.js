class Producto {
    constructor(data) {
        this.id = data.id; 
        this.nombre = data.nombre; 
        this.precio = data.precio; 
        this.stock = data.stock; 
    }

    set id(id) {
        this._id = id;
    }

    set nombre(nombre =""){
        if (nombre.length>0){
            this._nombre=nombre;    
        }  
    }
  

    set precio(precio = 0) {
        const valor = Number(precio); 
        this._precio = (typeof valor === "number" && valor >= 0) ? valor : 0; 
    }

    set stock(stock = 0) {
        const valor = Number(stock); 
        this._stock = (typeof valor === "number" && valor >= 0) ? valor : 0; 
    }

    get id() {
        return this._id;
    }
    
    get nombre() {
        return this._nombre;
    }

    get precio() {
        return this._precio;
    }

    get stock() {
        return this._stock;
    }

    get datos() {
        if (this.id !== undefined) {
            return {
                id: this.id,
                nombre: this.nombre,
                precio: this.precio,
                stock: this.stock
            };
        } else {
            return {
                nombre: this.nombre,
                precio: this.precio,
                stock: this.stock
            };
        }
    }
}

module.exports = Producto;