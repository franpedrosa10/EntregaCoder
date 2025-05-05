const socket = io();

const addForm = document.getElementById('addForm');
const deleteForm = document.getElementById('deleteForm');
const productList = document.getElementById('productList');

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(addForm);
  const data = Object.fromEntries(formData);
  data.precio = parseFloat(data.precio);
  socket.emit('newProduct', data);
  addForm.reset();
});

deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(deleteForm);
  const id = parseInt(formData.get('id'));
  socket.emit('deleteProduct', id);
  deleteForm.reset();
});

socket.on('productsUpdated', products => {
  productList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `ID: ${p.id} - ${p.nombre} - $${p.precio}`;
    productList.appendChild(li);
  });
});
