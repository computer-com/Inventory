const express = require('express');
const invenotryRoutes = require('./routes/inventoryroutes');
const app = express();
const port = 3110;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/', invenotryRoutes);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});