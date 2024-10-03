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
        // console.log(usuario.id);  //.id para mostrar el id y el data() sirve para mostrar los demas datos     
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
    //console.log(usuario.data());
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
    //console.log(await buscarPorId(id));
    var usuarioBorrado = false;
    if (await buscarPorId(id) != undefined) {
        //console.log("Se borrora al usuario");
        await usuariosBD.doc(id).delete();
        usuarioBorrado = true;
    }
    return usuarioBorrado;
}
 borrarUsuario("DvnUP8zKXJKY1gwVDRgY");
//mostrarUsuarios();

//buscarPorId("100");

/*var data = {
    nombre: "Pacho Villa",
    usuario: "pancho",
    password: "123"
}*/

var data = {
    nombre: "Daniela",
    usuario: "sfs",
    password: "abc"
}
nuevoUsuario(data);

module.exports = {
    mostrarUsuarios,
    nuevoUsuario,
    borrarUsuario,
    buscarPorId
}