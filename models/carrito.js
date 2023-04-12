const { DataTypes } = require("sequelize");
const { db } = require("../db/connection");
const DetalleCarrito = require("./detallecarrito");



const Carrito = db.define('carritos',{
    subtotal: {
        type: DataTypes.DECIMAL
    },
    total:{
        type: DataTypes.DECIMAL
    },
    sessionId: {
        type: DataTypes.STRING
    }
})

Carrito.hasMany( DetalleCarrito )


module.exports = Carrito