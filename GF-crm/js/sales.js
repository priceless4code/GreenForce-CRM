let sales = JSON.parse(localStorage.getItem('sales')) || [];

function loadSalesPage() {
  const content = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Sales Management</h2>
      <button onclick="openSalesModal()" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded">+ New Sale</button>
    </div>

    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
      <h3 class="font-bold mb-2">Sales Summary</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>Daily: $1,200</div>
        <div>Weekly: $8,400</div>
        <div>Monthly: $12,450</div>
      </div>
    </div>

    <div class="table-container bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-left">Customer</th>
            <th class="px-4 py-2 text-left">Product</th>
            <th class="px-4 py-2 text-left">Amount</th>
          </tr>
        </thead>
        <tbody id="sales-table-body" class="divide-y divide-gray-200 dark:divide-gray-700">
        </tbody>
      </table>
    </div>
    <button onclick="exportSales()" class="mt-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded">Export CSV</button>
  `;
  document.getElementById('page-content').innerHTML = content;
  renderSales();
  setActiveLink('sales');
}

function renderSales() {
  const tbody = document.getElementById('sales-table-body');
  tbody.innerHTML = sales.map(s => `
    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td class="px-4 py-2">${new Date(s.date).toLocaleDateString()}</td>
      <td class="px-4 py-2">${s.customer}</td>
      <td class="px-4 py-2">${s.product}</td>
      <td class="px-4 py-2">$${s.amount}</td>
    </tr>
  `).join('');
}

function openSalesModal() {
  // Fetch customers and inventory for dropdowns
  const customerOptions = (JSON.parse(localStorage.getItem('customers')) || []).map(c => 
    `<option value="${c.id}">${c.name}</option>`
  ).join('');
  const productOptions = (JSON.parse(localStorage.getItem('inventory')) || []).map(i => 
    `<option value="${i.id}">${i.name}</option>`
  ).join('');

  const modal = `
    <div id="sales-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Record New Sale</h3>
        <form id="sales-form">
          <select id="sale-customer" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
            <option value="">Select Customer</option>
            ${customerOptions}
          </select>
          <select id="sale-product" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
            <option value="">Select Product</option>
            ${productOptions}
          </select>
          <input type="number" id="sale-amount" placeholder="Amount ($)" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required min="0">
          <div class="flex justify-end space-x-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2">Cancel</button>
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded">Save Sale</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-root').innerHTML = modal;
  document.getElementById('sales-form').addEventListener('submit', saveSale);
}

function saveSale(e) {
  e.preventDefault();
  const customerId = document.getElementById('sale-customer').value;
  const productId = document.getElementById('sale-product').value;
  const amount = document.getElementById('sale-amount').value;

  const customers = JSON.parse(localStorage.getItem('customers')) || [];
  const customer = customers.find(c => c.id == customerId)?.name || 'Unknown';

  const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  const product = inventory.find(i => i.id == productId)?.name || 'Unknown';

  const newSale = {
    id: Date.now(),
    date: new Date().toISOString(),
    customer,
    product,
    amount: parseFloat(amount)
  };

  sales.push(newSale);
  localStorage.setItem('sales', JSON.stringify(sales));

  // Reduce inventory stock
  const item = inventory.find(i => i.id == productId);
  if (item) {
    item.stock -= 1;
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }

  closeModal();
  renderSales();
  showNotification('Sale recorded!', 'success');
}

function exportSales() {
  if (sales.length === 0) return showNotification('No sales to export', 'error');
  exportToCSV(sales, 'greenforce_sales.csv');
}