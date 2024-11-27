const { usuariosBD } = require("./Conexion");
const Usuario = require("../clases/Usuario");
const { encriptarPassword, validarPassword } = require("../middlewares/funcionesPassword");

function validar(usuario) {
    var valido = false;
    if (usuario.nombre != undefined && usuario.usuario != undefined && usuario.password != undefined) {

        valido = true;
    }
    return valido;
}

async function mostrarUsuarios() {
    const usuarios = await usuariosBD.get();
    usuariosValidos = [];
    usuarios.forEach(usuario => {    
        const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
        
        if (validar(usuario1.datos)) {
            usuariosValidos.push(usuario1.datos);
        }
    });
    return usuariosValidos;
}

async function buscarPorId(id) {
    var usuariosValido;
    const usuario = await usuariosBD.doc(id).get();
    const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
    if (validar(usuario1.datos)) {
        usuariosValido = usuario1.datos;
    }
    return usuariosValido;
}


async function nuevoUsuario(data) {
    const { hash, salt } = encriptarPassword(data.password);
    data.password = hash;
    data.salt = salt;
    data.tipoUsuario = "usuario";
    const usuario1 = new Usuario(data)
    var usuariosValido = {};
    var usuarioGuardado = false;
    
    if (validar(usuario1.datos)) {
        usuariosValido = usuario1.datos;
        await usuariosBD.doc().set(usuariosValido);
        usuarioGuardado=true;
    }
    return usuarioGuardado;
}


async function borrarUsuario(id) {
    var usuarioBorrado = false;
    if (await buscarPorId(id) != undefined) {
        await usuariosBD.doc(id).delete();
        usuarioBorrado = true;
    }
    return usuarioBorrado;
}
 
module.exports = {
    mostrarUsuarios,
    nuevoUsuario,
    borrarUsuario,
    buscarPorId
}