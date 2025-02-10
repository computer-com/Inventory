const express = require('express');
const router = express.Router();
const { Inventory } = require('../models/inventorymodel');

// Get all items
router.get('/',async (req,res) =>{
    const items = await Inventory.findAll();
    res.render('index', { items });
});
//Add a new Item
router.get('/add',(req,res) =>{
    res.render('add');
});
router.post('/add',async (req,res) =>{
    const {name,quantity ,price ,description} = req.body;
    await Inventory.create({name,quantity,price,description});
    res.redirect('/');
});
//Edit an item
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const item = await Inventory.findOne({ where: { id } });
    res.render('edit', { item })
});
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, description } = req.body;
    await Inventory.update({ name, quantity, price, description }, { where: { id } });
    res.redirect('/');
});

//Delete an item
router.post('/delete/:id',async (req,res) =>{
    const {id} = req.params;
    await Inventory.destroy({where: {id}});
    res.redirect('/');
});

module.exports = router;

