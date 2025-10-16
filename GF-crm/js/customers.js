let customers = JSON.parse(localStorage.getItem('customers')) || [
  { id: 1, name: "John Doe", phone: "555-1234", address: "123 Solar St", orderType: "purchase", status: "delivered" }
];

function loadCustomersPage() {
  const content = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Customer Management</h2>
      <button onclick="openCustomerModal()" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded">+ Add Customer</button>
    </div>

    <div class="mb-4">
      <input type="text" id="customer-search" placeholder="Search customers..." class="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700">
    </div>

    <div class="table-container bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Phone</th>
            <th class="px-4 py-2 text-left">Address</th>
            <th class="px-4 py-2 text-left">Order Type</th>
            <th class="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody id="customers-table-body" class="divide-y divide-gray-200 dark:divide-gray-700">
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('page-content').innerHTML = content;
  renderCustomers();
  document.getElementById('customer-search').addEventListener('input', renderCustomers);
  setActiveLink('customers');
}

function renderCustomers() {
  const searchTerm = document.getElementById('customer-search').value.toLowerCase();
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm) ||
    c.phone.includes(searchTerm)
  );

  const tbody = document.getElementById('customers-table-body');
  tbody.innerHTML = filtered.map(c => `
    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td class="px-4 py-2">${c.name}</td>
      <td class="px-4 py-2">${c.phone}</td>
      <td class="px-4 py-2">${c.address}</td>
      <td class="px-4 py-2">${c.orderType}</td>
      <td class="px-4 py-2">
        <span class="px-2 py-1 rounded text-xs ${
          c.status === 'delivered' ? 'bg-green-100 text-green-800' :
          c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }">${c.status}</span>
      </td>
    </tr>
  `).join('');
}

function openCustomerModal() {
  const modal = `
    <div id="customer-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add New Customer</h3>
        <form id="customer-form">
          <input type="text" id="cust-name" placeholder="Name" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
          <input type="text" id="cust-phone" placeholder="Phone" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
          <input type="text" id="cust-address" placeholder="Address" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
          <select id="cust-order-type" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600">
            <option value="purchase">Purchase</option>
            <option value="repair">Repair</option>
          </select>
          <div class="flex justify-end space-x-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2">Cancel</button>
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-root').innerHTML = modal;
  document.getElementById('customer-form').addEventListener('submit', saveCustomer);
}

function saveCustomer(e) {
  e.preventDefault();
  const newCustomer = {
    id: Date.now(),
    name: document.getElementById('cust-name').value,
    phone: document.getElementById('cust-phone').value,
    address: document.getElementById('cust-address').value,
    orderType: document.getElementById('cust-order-type').value,
    status: 'pending'
  };
  customers.push(newCustomer);
  localStorage.setItem('customers', JSON.stringify(customers));
  closeModal();
  renderCustomers();
  showNotification('Customer added successfully!', 'success');
}

function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
}