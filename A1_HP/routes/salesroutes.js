const express = require('express');
const router = express.Router();
const { Sales } = require('../models/salesmodel');
const { Inventory } = require('../models/inventorymodel');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_Jvq3t0KlmRyk', {
    host: 'ep-billowing-base-a5aix9lm-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
});
// Get all sales
router.get('/sales', async (req, res) => {
    const sales = await Sales.findAll({
        include: [{
            model: Inventory,
            attributes: ['name']
        }],
        order: [['saleDate', 'DESC']]
    });
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    res.render('sales', { sales, totalRevenue, totalSales: sales.length });
});

// Get sell item page with item details
router.get('/sell/:id', async (req, res) => {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
        return res.status(404).send('Item not found');
    }
    res.render('sellitem', { item });
});
// Add a sale 
router.post('/sell', async (req, res) => {
    const { itemId, quantity, price } = req.body;
    
    const result = await sequelize.transaction(async (t) => {
        const item = await Inventory.findByPk(itemId, { transaction: t });
        
        if (!item) {
            throw new Error('Item not found');
        }
        
        if (item.quantity < quantity) {
            throw new Error('Not enough quantity in stock');
        }

        const totalAmount = quantity * price;
        
        const sale = await Sales.create({
            itemId,
            quantitySold: parseInt(quantity),
            pricePerItem: parseFloat(price),
            totalAmount: totalAmount
        }, { transaction: t });

        await item.update({
            quantity: item.quantity - parseInt(quantity)
        }, { transaction: t });

        return sale;
    });

    res.redirect('/sales');
});
// Get ledger page
router.get('/ledger', async (req, res) => {
    const sales = await Sales.findAll({
        include: [{
            model: Inventory,
            attributes: ['name', 'price']
        }],
        order: [['saleDate', 'DESC']]
    });
    
    const inventory = await Inventory.findAll();

    const totalAssets = inventory.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0);
        
    const totalRevenue = sales.reduce((sum, sale) =>
        sum + sale.totalAmount, 0);

    res.render('ledger', {
        sales,
        inventory,
        totalAssets,
        totalRevenue
    });
});

module.exports = router;
