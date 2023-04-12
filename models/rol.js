
const { DataTypes } = require('sequelize')
const { db } = require('../db/connection')

const Rol = db.define('Rol', {

    nombre: {
        type: DataTypes.STRING
    },
    
})


module.exports = Rol