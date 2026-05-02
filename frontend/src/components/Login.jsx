const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/auth/login`;
    const res = await axios.post(url, { email, password });
    
    // Save the token so the browser remembers the user
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    window.location.href = "/"; // Send them to the homepage
  } catch (err) {
    alert("Invalid credentials");
  }
};