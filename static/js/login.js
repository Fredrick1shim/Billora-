document.querySelector('.login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('form-message');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = "Login successfull! Redirecting..."
      msg.style.color = "green"
      window.location.href = '/mainpage';  // ✅ Redirect via Flask route
    } else {
      msg.textContent = "❌ " + (data.error || "Login failed.");
      msg.style.color = "red";
    }
  } catch (err) {
    msg.textContent = "❌ Network error.";
    msg.style.color = "red";
  }
});