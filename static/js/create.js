document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('.signup-form');
  const toggleBtn = document.querySelector('.toggle-visibility');
  const msg = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          // ✅ No localStorage — we're now relying on Flask session
          window.location.href = '/mainpage';
        } else {
          msg.textContent = "❌ " + (data.error || "Registration failed.");
          msg.style.color = "red";
        }
      } catch (err) {
        msg.textContent = "❌ Network error.";
        msg.style.color = "red";
      }
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const pwd = document.getElementById('password');
      pwd.type = pwd.type === 'password' ? 'text' : 'password';
    });
  }
});