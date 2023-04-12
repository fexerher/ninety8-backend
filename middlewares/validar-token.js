const { response,  request } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')


const validarJWT = async ( req = request, res = response,  next) => {

    const token = req.header('x-token')

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }
    try {

        const { uid:id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findByPk( id )
    
        if(!usuario){
            console.log('Usuario no encontrado');
            return res.status(400).json({
                msg: 'Token no valido'
            })
        }
        //Verificar si el uid tien estado true

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido'
            })
        }
        req.usuario = usuario

        next()

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }



}


module.exports= {
    validarJWT
}