const { DataTypes } = require('sequelize');
const { db } = require('../db/connection');
const Producto = require('./producto');

const Valor = db.define('valor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  valor: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'valor'
});

const Variacion = db.define('Variacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  descuento: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
}, {
  tableName: 'variacion'
});

Variacion.belongsToMany(Valor, {
  through: 'VariacionValor',
  as: 'valores',
  foreignKey: 'variacionId'
});

const Atributo = db.define('Atributo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'atributo'
});

const ValorAtributo = db.define('ValorAtributo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  tableName: 'valor_atributo'
});

Valor.belongsToMany(Atributo, {
  through: ValorAtributo,
  foreignKey: 'valorId',
  as: 'atributos'
});

Atributo.belongsToMany(Valor, {
  through: ValorAtributo,
  foreignKey: 'atributoId',
  as: 'valores'
});

const ProductoAtributo = db.define('ProductoAtributo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  valor: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'producto_atributo'
});

Valor.belongsToMany(Variacion, {
  through: 'VariacionValor',
  as: 'variaciones',
  foreignKey: 'valorId'
});

const VariacionValor = db.define('variacion_valor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  tableName: 'variacion_valor'
});

// Relaciones
VariacionValor.belongsTo(Variacion, { foreignKey: 'variacionId' });
VariacionValor.belongsTo(Atributo, { foreignKey: 'atributoId' });
VariacionValor.belongsTo(Valor, { foreignKey: 'valorId' });


module.exports = {
  Variacion,
  Atributo,
  ValorAtributo,
  ProductoAtributo,
  Valor,
  VariacionValor
};
