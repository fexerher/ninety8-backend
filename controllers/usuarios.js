
const { response } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')

const usuariosGet = async (req, res = response) => {

    const { limite = 5, page = 1 } = req.query

    
    const usuarios = await Usuario.findAndCountAll( {
        where:{
            estado: true
        },
        limit:  isNaN( limite ) ? 5 : Number(limite) ,
        offset: isNaN( page ) && isNaN(limite) ? 1 : ((page-1)*limite) ,
    } )

  
    res.json( usuarios )
    
}

const usuarioGet = async ( req, res = response ) => {

    const { id } = req.params

    const usuario = await Usuario.findByPk( id )

    if(!usuario) {
        return res.status(404).json({
            msg: 'No se encontró el usuario'
        })
    }
    res.json( usuario )

}
const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { email, password, ...resto  } = req.body;

    try {

        const usuario = await Usuario.findByPk( id );

        if(!usuario){
            return res.status(404).json({
                msg: 'No existe un usuario con el id' + id
            })
        }
        if(password) {
            const salt = bcryptjs.genSaltSync()
            resto.password = bcryptjs.hashSync( password , salt )
        }
        
        await usuario.update( resto )
        
        res.json( usuario )

    } catch (error) {
        console.log( error );
        res.json({
            msg: 'Hable con el administrador',
        })
    }
  
}

const usuariosPost = async ( req, res = response ) => {

            
         try {   
            const { nombre, email, password ,rol } = req.body
            
            const usuario = new Usuario( {nombre, email, password, rol} )

            //Encriptar la contraseña
            const salt = bcryptjs.genSaltSync()
            usuario.password = bcryptjs.hashSync( password , salt )

            //Guardar en DB
            await usuario.save();

            res.json( usuario )

        } catch (error) {
            console.log( error );
            res.json({
                msg: 'Hable con el administrador',
            })
        }


}
const usuariosDelete = async ( req, res = response ) => {

    const { id } = req.params;

    
    const usuario = await Usuario.findByPk(id)
    
    if(!usuario){
        return res.status(400).json({
            msg: 'No hay un usuario con el id' + id
        })
    }
    
    
    await usuario.update({ estado: false })
    
    const userAuth = req.usuario

    res.json({ usuario, userAuth})

}

module.exports = {
    usuarioGet,
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
}