document.addEventListener('DOMContentLoaded', () => {
  const billForm = document.getElementById('addBillForm');
  const printBtn = document.getElementById('printBtn');
  const tableBody = document.getElementById('billsTableBody');

  // Submit new bill
  billForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const billData = {
      name: document.getElementById('payer').value.trim(),
      amount: parseFloat(document.getElementById('amount').value),
      category: document.getElementById('category').value || 'Other', // <-- updated
      due_date: document.getElementById('dueDate').value,
      frequency: 'One-Time',
      is_paid: false
    };

    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(billData)
      });

      if (!res.ok) throw new Error('Failed to add bill');

      alert('✅ Bill added successfully!');
      billForm.reset();
      window.location.href = '/mainpage';

    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  });

  // Print PDF
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Load bills into table
  async function loadBills() {
    try {
      const res = await fetch('/api/bills', {
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Unauthorized or failed to fetch bills');

      const bills = await res.json();

      tableBody.innerHTML = '';
      bills.forEach(bill => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${bill.name}</td>
          <td>$${bill.amount.toFixed(2)}</td>
          <td>${new Date(bill.due_date).toLocaleDateString()}</td>
          <td>${bill.is_paid ? 'Paid' : 'Unpaid'}</td>
          <td>${bill.category || 'Other'}</td> <!-- show category -->
          <td><button onclick="alert('Bill ID: ${bill.id}')">Details</button></td>
        `;
        tableBody.appendChild(row);
      });

    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="6" style="color:red;text-align:center;">❌ Could not load bills</td></tr>`;
    }
  }

  loadBills();
});