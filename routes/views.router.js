const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();
productManager.init();

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

module.exports = router;
