const fs = require('fs').promises;
const path = require('path');
const ProductManager = require('./ProductManager');

const CARTS_FILE = path.join(__dirname, 'carts.json');

class CartManager {
  constructor() {
    this.carts = [];
    this.productManager = new ProductManager();
  }

  async init() {
    try {
      await fs.access(CARTS_FILE);
    } catch {
      await fs.writeFile(CARTS_FILE, '[]');
    }
    await this.loadCarts();
  }

  async loadCarts() {
    const data = await fs.readFile(CARTS_FILE, 'utf-8');
    this.carts = JSON.parse(data);
  }

  async saveCarts() {
    await fs.writeFile(CARTS_FILE, JSON.stringify(this.carts, null, 2));
  }

  async createCart() {
    await this.loadCarts();
    const id = this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1;
    const newCart = { id, products: [] };
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(cid) {
    await this.loadCarts();
    return this.carts.find(c => c.id === cid);
  }

  async addProductToCart(cid, pid) {
    await this.loadCarts();
    const cart = this.carts.find(c => c.id === cid);
    if (!cart) return null;

    const product = await this.productManager.getProductById(pid);
    if (!product) return null;

    const item = cart.products.find(p => p.product === pid);
    if (item) {
      item.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this.saveCarts();
    return cart;
  }
}

module.exports = CartManager;
