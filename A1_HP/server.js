const express = require('express');
const inventoryRoutes = require('./routes/inventoryroutes');
const salesRoutes = require('./routes/salesroutes');
const app = express();
const port = 3110;

// View engine setup
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', inventoryRoutes);
app.use('/', salesRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error: ' + err.message);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});