const { DataTypes ,Model } = require("sequelize");
const { db } = require("../db/connection");
const Producto = require("./producto");

const DetalleCarrito = db.define('Detalle',{
    subtotal: {
        type: DataTypes.INTEGER
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2)
    },
    cantidad: {
        type: DataTypes.INTEGER
    },
    carritoId: {
        type: DataTypes.INTEGER
    }
});


DetalleCarrito.belongsTo( Producto )





module.exports = DetalleCarrito;

