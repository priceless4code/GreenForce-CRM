let inventory = JSON.parse(localStorage.getItem('inventory')) || [
  { id: 1, name: "Solar Panel 300W", category: "panels", stock: 15, minStock: 5 },
  { id: 2, name: "Inverter 2kW", category: "inverters", stock: 3, minStock: 4 }
];

const categories = ["panels", "inverters", "batteries", "fans", "street lights", "flood lights", "accessories"];

function loadInventoryPage() {
  const lowStock = inventory.filter(item => item.stock <= item.minStock).length;
  if (lowStock > 0) showNotification(`⚠️ ${lowStock} items are low on stock!`, 'error');

  const content = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Inventory Management</h2>
      <button onclick="openInventoryModal()" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded">+ Add Product</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      ${categories.map(cat => `
        <div class="bg-white dark:bg-gray-800 p-3 rounded shadow text-center">
          <p class="font-medium">${cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
          <p class="text-2xl font-bold text-primary">${inventory.filter(i => i.category === cat).reduce((sum, i) => sum + i.stock, 0)}</p>
        </div>
      `).join('')}
    </div>

    <div class="table-container bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Product</th>
            <th class="px-4 py-2 text-left">Category</th>
            <th class="px-4 py-2 text-left">Stock</th>
            <th class="px-4 py-2 text-left">Min Stock</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody id="inventory-table-body" class="divide-y divide-gray-200 dark:divide-gray-700">
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('page-content').innerHTML = content;
  renderInventory();
  setActiveLink('inventory');
}

function renderInventory() {
  const tbody = document.getElementById('inventory-table-body');
  tbody.innerHTML = inventory.map(item => `
    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td class="px-4 py-2">${item.name}</td>
      <td class="px-4 py-2">${item.category}</td>
      <td class="px-4 py-2 ${item.stock <= item.minStock ? 'text-red-600 font-bold' : ''}">${item.stock}</td>
      <td class="px-4 py-2">${item.minStock}</td>
      <td class="px-4 py-2">
        <button onclick="adjustStock(${item.id}, 'in')" class="text-green-600 mr-2">+ In</button>
        <button onclick="adjustStock(${item.id}, 'out')" class="text-red-600">- Out</button>
      </td>
    </tr>
  `).join('');
}

function openInventoryModal() {
  const modal = `
    <div id="inventory-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add Product</h3>
        <form id="inventory-form">
          <input type="text" id="prod-name" placeholder="Product Name" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
          <select id="prod-category" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
            ${categories.map(cat => `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`).join('')}
          </select>
          <input type="number" id="prod-stock" placeholder="Initial Stock" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required min="0">
          <input type="number" id="prod-min" placeholder="Min Stock Alert" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required min="0">
          <div class="flex justify-end space-x-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2">Cancel</button>
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-root').innerHTML = modal;
  document.getElementById('inventory-form').addEventListener('submit', saveInventoryItem);
}

function saveInventoryItem(e) {
  e.preventDefault();
  const newItem = {
    id: Date.now(),
    name: document.getElementById('prod-name').value,
    category: document.getElementById('prod-category').value,
    stock: parseInt(document.getElementById('prod-stock').value),
    minStock: parseInt(document.getElementById('prod-min').value)
  };
  inventory.push(newItem);
  localStorage.setItem('inventory', JSON.stringify(inventory));
  closeModal();
  renderInventory();
  showNotification('Product added!', 'success');
}

function adjustStock(id, type) {
  const item = inventory.find(i => i.id === id);
  if (type === 'in') {
    item.stock += 1;
  } else if (type === 'out' && item.stock > 0) {
    item.stock -= 1;
  }
  localStorage.setItem('inventory', JSON.stringify(inventory));
  renderInventory();
}