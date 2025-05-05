const express = require('express');
const { Server } = require('socket.io');
const path = require('path');
const exphbs = require('express-handlebars');
const http = require('http');

const ProductManager = require('./managers/ProductManager');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

// WebSocket
io.on('connection', socket => {
  console.log('Cliente conectado');

  socket.on('newProduct', async data => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProducts();
    io.emit('productsUpdated', updatedProducts);
  });

  socket.on('deleteProduct', async id => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit('productsUpdated', updatedProducts);
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
