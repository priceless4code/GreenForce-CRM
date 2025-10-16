// Notification system
function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `fixed top-20 right-4 p-3 rounded shadow-lg z-50 ${
    type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
  } text-white`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// Export to CSV
function exportToCSV(data, filename) {
  const csv = data.map(row => Object.values(row).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Toggle dark mode
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

const isDark = localStorage.getItem('darkMode') === 'true';
if (isDark) document.documentElement.classList.add('dark');

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isNowDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('darkMode', isNowDark);
  themeIcon.innerHTML = isNowDark ?
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />' :
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
});

// Mobile menu toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('-translate-x-full');
});