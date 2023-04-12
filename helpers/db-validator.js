const Rol = require("../models/rol");
const Usuario = require("../models/usuario");



const validarRol = async ( rol = 'ROL_USER') => {

    const existeRol = await Rol.findOne( {
        where: {
            nombre: rol
        }
    } );

    if(!existeRol){
        throw new Error('El rol no esta en la bd')
    }


}

const validarEmail = async ( email  ) => {

   
     //Verificar si el correo existe
     const existeEmail = await Usuario.findOne({
          where: {
           email
          }
     })
     if( existeEmail ) {
        
        throw new Error('Ya existe un usuario con el email ' + email)

     }

}

const validarUsuarioId = async ( id ) => {

    const usuario = await Usuario.findByPk( id );

    if(!usuario){
        throw new Error('No existe un usuario con el id' + id)
    }

}

module.exports = {
    validarRol,
    validarEmail,
    validarUsuarioId
}