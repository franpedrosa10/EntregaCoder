const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

class ProductManager {
  constructor() {
    this.products = [];
  }

  async init() {
    try {
      await fs.access(PRODUCTS_FILE);
    } catch {
      await fs.writeFile(PRODUCTS_FILE, '[]');
    }
    await this.loadProducts();
  }

  async loadProducts() {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    this.products = JSON.parse(data);
  }

  async saveProducts() {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(this.products, null, 2));
  }

  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.loadProducts();
    return this.products.find(p => p.id === id);
  }

  async addProduct(obj) {
    await this.loadProducts();
    const id = this.products.reduce((maxId, p) => p.id > maxId ? p.id : maxId, 0) + 1;
    const newProduct = { id, ...obj };
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  async updateProduct(id, updateFields) {
    await this.loadProducts();
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updateFields, id };
    await this.saveProducts();
    return this.products[index];
  }

  async deleteProduct(id) {
    await this.loadProducts();
    this.products = this.products.filter(p => p.id !== id);
    await this.saveProducts();
  }
}

module.exports = ProductManager;
