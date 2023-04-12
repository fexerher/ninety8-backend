
const { DataTypes } = require('sequelize')
const { db } = require('../db/connection')

const Usuario = db.define('User', {

    nombre: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING,
    },
    estado: {
        type: DataTypes.TINYINT
    },
    rol: {
        type: DataTypes.STRING,
    }
        

})

Usuario.prototype.toJSON = function(){
    let values = Object.assign({}, this.get());
 
    delete values.password;
    return values;
}


module.exports = Usuario