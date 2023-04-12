const { Sequelize } = require('sequelize');



const db = new Sequelize('ninety8', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false
})

module.exports = {
    db
};