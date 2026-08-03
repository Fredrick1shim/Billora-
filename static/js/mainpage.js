let categoryChart = null;
document.addEventListener('DOMContentLoaded', () => {
  const billsList = document.getElementById('billsList');
  const filterStatus = document.getElementById('filterStatus');
  const sortBills = document.getElementById('sortBills');
  const printBtn = document.getElementById('printBtn');
  const addBillBtn = document.getElementById('addBillBtn');

  const totalBillsElement = document.getElementById('totalBills');
  const unpaidBillsElement = document.getElementById('unpaidBills');
  const overdueBillsElement = document.getElementById('overdueBills');
  const totalAmountElement = document.getElementById('totalAmount');

  let bills = [];

  async function fetchBills() {
    try {
      const response = await fetch('/api/bills', { credentials: 'include' });
      bills = await response.json();
      renderBills();
      updateDashboard();
    } catch (err) {
      billsList.innerHTML = '<div class="p-6 text-red-600 text-center">Failed to load bills.</div>';
    }
  }

  function renderBills() {
    const statusFilter = filterStatus.value;
    const sortOption = sortBills.value;
    const today = new Date().toISOString().split('T')[0];

    let filtered = bills.filter(b => {
      const isOverdue = b.due_date < today && !b.is_paid;
      if (statusFilter === 'paid') return b.is_paid;
      if (statusFilter === 'unpaid') return !b.is_paid && !isOverdue;
      if (statusFilter === 'overdue') return isOverdue;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'dueDateAsc': return new Date(a.due_date) - new Date(b.due_date);
        case 'dueDateDesc': return new Date(b.due_date) - new Date(a.due_date);
        case 'amountAsc': return a.amount - b.amount;
        case 'amountDesc': return b.amount - a.amount;
        default: return 0;
      }
    });

    billsList.innerHTML = '';

    if (!filtered.length) {
      billsList.innerHTML = '<div class="p-6 text-gray-500 text-center">No bills match your filters.</div>';
      return;
    }

    filtered.forEach(bill => {
      const isOverdue = bill.due_date < today && !bill.is_paid;
      const statusText = isOverdue ? 'Overdue' : bill.is_paid ? 'Paid' : 'Unpaid';
      const statusClass = isOverdue ? 'text-red-600 bg-red-100' : bill.is_paid ? 'text-green-600 bg-green-100' : 'text-yellow-800 bg-yellow-100';

      const div = document.createElement('div');
      div.className = 'bill-card';
      if (isOverdue)
        div.classList.add('overdue');
      else if (bill.is.paid)
        div.classList.add('paid');
      else div.classList.add('unpaid');
      div.innerHTML = `
        <div>
          <h3 class="bill-name">${bill.name}</h3>
          <p class="bill-category">${bill.category}</p>
        </div>
        <div class="bill-meta">
          <span class="bill-status ${statusClass}">${statusText}</span>
          <p>$${bill.amount.toFixed(2)}</p>
          <p class="${isOverdue ? 'text-danger' : ''}">${new Date(bill.due_date).toLocaleDateString()}</p>
          <button class="delete-btn"data-id="${bills.id}">Delete</button>
        </div>
      `;
      billsList.appendChild(div);
    });
    // INSIDE renderBills()
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm("Delete this bill?")) {
          const res = await fetch(`/api/bills/${id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          if (res.ok) {
            await fetchBills(); // reload everything cleanly
          } else {
            alert("Failed to delete");
          }
        }
      });
    });    
    
  }

  function renderCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');

    // Calculate spending by category from bills
    const categories = {};
    bills.forEach(b => {
        if (!categories[b.category]) categories[b.category] = 0;
        categories[b.category] += b.amount;
    });

    const data = {
        labels: Object.keys(categories),
        datasets: [{
            label: 'Spending by Category',
            data: Object.values(categories),
            backgroundColor: [
                '#20a42b',
                '#1b7124fe',
                '#21d297',
                '#ef4444',
                '#f59e0b',
                '#a855f7',
                '#3b82f6',
                '#facc15'
            ]
        }]
    };

    if (categoryChart) categoryChart.destroy(); // remove old chart before creating new

    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
            }
        }
    });
}

  function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];

    totalBillsElement.textContent = bills.length;
    unpaidBillsElement.textContent = bills.filter(b => !b.is_paid && b.due_date >= today).length;
    overdueBillsElement.textContent = bills.filter(b => !b.is_paid && b.due_date < today).length;
    totalAmountElement.textContent = '$' + bills.reduce((sum, b) => sum + b.amount, 0).toFixed(2);
  }
  addBillBtn.addEventListener('click', () => window.location.href = '/the_project');
  printBtn.addEventListener('click', () => window.print());
  filterStatus.addEventListener('change', renderBills);
  sortBills.addEventListener('change', renderBills);
  fetchBills().then(() => renderCategoryChart());
});