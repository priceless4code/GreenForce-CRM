function loadDashboard() {
  const content = `
    <h2 class="text-2xl font-bold mb-6">Dashboard Overview</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 class="text-gray-500 dark:text-gray-400">Total Sales (This Month)</h3>
        <p class="text-2xl font-bold text-primary">$12,450</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 class="text-gray-500 dark:text-gray-400">Repairs Completed</h3>
        <p class="text-2xl font-bold text-primary">87</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 class="text-gray-500 dark:text-gray-400">Inventory Items</h3>
        <p class="text-2xl font-bold text-primary">142</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 class="text-gray-500 dark:text-gray-400">Pending Deliveries</h3>
        <p class="text-2xl font-bold text-primary">12</p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
      <h3 class="font-bold mb-4">Sales Trend (Last 7 Days)</h3>
      <div class="h-64 flex items-end space-x-2">
        ${[40, 60, 45, 70, 55, 80, 65].map(val => 
          `<div class="bg-primary w-10 rounded-t" style="height: ${val}%"></div>`
        ).join('')}
      </div>
    </div>
  `;
  document.getElementById('page-content').innerHTML = content;
  setActiveLink('dashboard');
}

// Load dashboard on start
document.addEventListener('DOMContentLoaded', loadDashboard);

function setActiveLink(page) {
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active-link'));
  document.querySelector(`nav a[data-page="${page}"]`)?.classList.add('active-link');
}