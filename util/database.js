const Sequelize = require('sequelize');

const sequelize = new Sequelize('u336047552_insurancehouse','u336047552_na4660', 'n/P3j~PVU&5', 
{ 
    dialect: 'mysql', 
    host: 'sql161.main-hosting.eu'
});

module.exports = sequelize;