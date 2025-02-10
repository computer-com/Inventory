const { DataTypes , Sequelize } = require('sequelize');
const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_Jvq3t0KlmRyk', {
    host: 'ep-billowing-base-a5aix9lm-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });
const Inventory = sequelize.define('inventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'Assignment1_Inventory',
    createdAt: false,
    updatedAt: false
});
sequelize.sync()
    .then(() => {
        console.log('Database synchronised');
    })
    .catch((error) => {
        console.log('Error syncing database :', error);
    });

module.exports = {Inventory};

