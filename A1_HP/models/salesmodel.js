const {DataTypes , Sequelize} = require('sequelize');
const { Inventory } = require('../models/inventorymodel');
const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_Jvq3t0KlmRyk', {
        host: 'ep-billowing-base-a5aix9lm-pooler.us-east-2.aws.neon.tech',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
            ssl: { rejectUnauthorized: false },
        },
    });

const Sales = sequelize.define('sales', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    itemId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Assignment1_Inventory',
            key: 'id'
        }
    },
    quantitySold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    pricePerItem: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0
        }
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    saleDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
},{
    tableName: 'Assignment1_Sales',
    createdAt: false,
    updatedAt: false
});

Sales.belongsTo(Inventory, { foreignKey: 'itemId' });
Inventory.hasMany(Sales, { foreignKey: 'itemId' });

sequelize.sync()
    .then(() => {
        console.log('Sales table synchronized');
    })
    .catch((error) => {
        console.log('Error syncing Sales table:', error);
    });

module.exports = { Sales };