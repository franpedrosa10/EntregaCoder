const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const main = async () => {
  const productManager = new ProductManager();
  const cartManager = new CartManager();

  await productManager.init();
  await cartManager.init();

  // 1. Agregar productos
  const prod1 = await productManager.addProduct({ nombre: 'Teclado', precio: 50 });
  const prod2 = await productManager.addProduct({ nombre: 'Mouse', precio: 30 });
  console.log('Productos agregados:', prod1, prod2);

  // 2. Obtener todos los productos
  const allProducts = await productManager.getProducts();
  console.log('Todos los productos:', allProducts);

  // 3. Obtener un producto por ID
  const productById = await productManager.getProductById(prod1.id);
  console.log('Producto por ID:', productById);

  // 4. Actualizar un producto
  const updatedProduct = await productManager.updateProduct(prod1.id, { precio: 60 });
  console.log('Producto actualizado:', updatedProduct);

  // 5. Eliminar un producto
  await productManager.deleteProduct(prod2.id);
  console.log(`Producto con ID ${prod2.id} eliminado.`);

  // Verificamos productos después del borrado
  const productsAfterDelete = await productManager.getProducts();
  console.log('Productos después del borrado:', productsAfterDelete);

  // 6. Crear un carrito
  const newCart = await cartManager.createCart();
  console.log('Carrito creado:', newCart);

  // 7. Obtener carrito por ID
  const foundCart = await cartManager.getCartById(newCart.id);
  console.log('Carrito encontrado:', foundCart);

  // 8. Agregar producto al carrito (2 veces para ver incremento)
  await cartManager.addProductToCart(newCart.id, prod1.id);
  await cartManager.addProductToCart(newCart.id, prod1.id);

  // 9. Ver carrito actualizado
  const updatedCart = await cartManager.getCartById(newCart.id);
  console.log('Carrito actualizado con productos:', updatedCart);
};


main().catch(err => console.error('Error en la ejecución:', err));