import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/auth/login`;
      const res = await axios.post(url, { email, password });
      
      // Save token so the user stays logged in
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert("Welcome back!");
      window.location.href = "/"; // Redirect to home
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" required 
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required 
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;