const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generarJWT");



const login = async ( req, resp = response ) => {

   const { email, password }  = req.body


   try {

      //Verificar si el email existe
      const usuario = await Usuario.findOne({ where: { 
            email , 
            estado: true
         } 
      })

      //Verificar si el usuario esta activo
      if(!usuario){
         return resp.status(400).json({
            msg: 'Usuario / Password no son correctos'
         })
      }

      //Verificar la contraseña
      const validPassword = bcryptjs.compareSync( password , usuario.password);
      if(!validPassword){
         return resp.status(400).json({
            msg: 'Usuario / Password no son correctos'
         })
      }

      //Generar el JWT
      const token = await generarJWT( usuario.id )
      
      resp.json({
        usuario,
        token
      })
   } catch (error) {
      return resp.status(500).json({
         msg: 'Hable con el administrador'
      })
   }

 }

 module.exports = {
    login
 }