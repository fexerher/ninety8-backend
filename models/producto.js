const { DataTypes } = require('sequelize')
const { db } = require('../db/connection');
const { Variacion } = require('./atributo');

const Producto = db.define('Producto', {
    nombre: {
      type: DataTypes.STRING,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
    },
    descuento: {
      type: DataTypes.DECIMAL(10, 2),
    },
    image: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    public_id:{
      type: DataTypes.STRING,
    }
  });

  Producto.hasMany(Variacion, {
    as: 'variaciones',
    foreignKey: 'productoId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  module.exports = Producto;