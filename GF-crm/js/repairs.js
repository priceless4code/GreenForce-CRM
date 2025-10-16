let repairs = JSON.parse(localStorage.getItem('repairs')) || [];

const repairStatuses = ['received', 'in repair', 'completed', 'returned'];

function loadRepairsPage() {
  const content = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Repairs Management</h2>
      <button onclick="openRepairModal()" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded">+ New Repair</button>
    </div>

    <div class="table-container bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Customer</th>
            <th class="px-4 py-2 text-left">Device</th>
            <th class="px-4 py-2 text-left">Issue</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody id="repairs-table-body" class="divide-y divide-gray-200 dark:divide-gray-700">
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('page-content').innerHTML = content;
  renderRepairs();
  setActiveLink('repairs');
}

function renderRepairs() {
  const tbody = document.getElementById('repairs-table-body');
  tbody.innerHTML = repairs.map(r => `
    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td class="px-4 py-2">${r.customer}</td>
      <td class="px-4 py-2">${r.device}</td>
      <td class="px-4 py-2">${r.issue}</td>
      <td class="px-4 py-2">
        <select onchange="updateRepairStatus(${r.id}, this.value)" class="bg-transparent ${
          r.status === 'completed' ? 'text-green-600' :
          r.status === 'received' ? 'text-yellow-600' : 'text-blue-600'
        }">
          ${repairStatuses.map(s => `<option value="${s}" ${r.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
        </select>
      </td>
      <td class="px-4 py-2">
        <button onclick="deleteRepair(${r.id})" class="text-red-600">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openRepairModal() {
  const customerOptions = (JSON.parse(localStorage.getItem('customers')) || []).map(c => 
    `<option value="${c.id}">${c.name}</option>`
  ).join('');

  const modal = `
    <div id="repair-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Log New Repair</h3>
        <form id="repair-form">
          <select id="repair-customer" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
            <option value="">Select Customer</option>
            ${customerOptions}
          </select>
          <input type="text" id="repair-device" placeholder="Device (e.g., Inverter)" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required>
          <textarea id="repair-issue" placeholder="Issue Description" class="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600" required></textarea>
          <div class="flex justify-end space-x-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2">Cancel</button>
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-root').innerHTML = modal;
  document.getElementById('repair-form').addEventListener('submit', saveRepair);
}

function saveRepair(e) {
  e.preventDefault();
  const customerId = document.getElementById('repair-customer').value;
  const device = document.getElementById('repair-device').value;
  const issue = document.getElementById('repair-issue').value;

  const customers = JSON.parse(localStorage.getItem('customers')) || [];
  const customer = customers.find(c => c.id == customerId)?.name || 'Walk-in';

  const newRepair = {
    id: Date.now(),
    customer,
    device,
    issue,
    status: 'received',
    technician: 'Unassigned'
  };

  repairs.push(newRepair);
  localStorage.setItem('repairs', JSON.stringify(repairs));
  closeModal();
  renderRepairs();
  showNotification('Repair logged!', 'success');
}

function updateRepairStatus(id, newStatus) {
  const repair = repairs.find(r => r.id === id);
  if (repair) {
    repair.status = newStatus;
    localStorage.setItem('repairs', JSON.stringify(repairs));
    showNotification('Status updated!', 'success');
  }
}

function deleteRepair(id) {
  repairs = repairs.filter(r => r.id !== id);
  localStorage.setItem('repairs', JSON.stringify(repairs));
  renderRepairs();
  showNotification('Repair deleted.', 'info');
}