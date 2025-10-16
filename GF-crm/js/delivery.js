// Assume deliveries are tied to sales or customers
let deliveries = JSON.parse(localStorage.getItem('deliveries')) || [];

window.loadDeliveryPage = function() {
  const content = `
    <h2 class="text-2xl font-bold mb-6">Delivery Tracking</h2>
    <div class="table-container bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Customer</th>
            <th class="px-4 py-2 text-left">Order</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Courier</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody id="delivery-table-body" class="divide-y divide-gray-200 dark:divide-gray-700">
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('page-content').innerHTML = content;
  renderDeliveries();
  setActiveLink('delivery');
}

function renderDeliveries() {
  // Auto-create deliveries from sales if not exists
  const sales = JSON.parse(localStorage.getItem('sales')) || [];
  if (deliveries.length === 0 && sales.length > 0) {
    deliveries = sales.map(s => ({
      id: s.id,
      customer: s.customer,
      order: s.product,
      status: 'pending',
      courier: ''
    }));
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }

  const tbody = document.getElementById('delivery-table-body');
  tbody.innerHTML = deliveries.map(d => `
    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td class="px-4 py-2">${d.customer}</td>
      <td class="px-4 py-2">${d.order}</td>
      <td class="px-4 py-2">
        <span class="px-2 py-1 rounded text-xs ${
          d.status === 'delivered' ? 'bg-green-100 text-green-800' :
          d.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
        }">${d.status}</span>
      </td>
      <td class="px-4 py-2">${d.courier || '-'}</td>
      <td class="px-4 py-2">
        <button onclick="updateDeliveryStatus(${d.id}, 'shipped')" class="text-blue-600 mr-2">Ship</button>
        <button onclick="updateDeliveryStatus(${d.id}, 'delivered')" class="text-green-600">Deliver</button>
      </td>
    </tr>
  `).join('');
}

function updateDeliveryStatus(id, status) {
  const delivery = deliveries.find(d => d.id === id);
  if (delivery) {
    delivery.status = status;
    if (status === 'shipped' && !delivery.courier) {
      delivery.courier = prompt("Enter courier name:") || 'N/A';
    }
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
    renderDeliveries();
    showNotification(`Order marked as ${status}!`, 'success');
  }
}