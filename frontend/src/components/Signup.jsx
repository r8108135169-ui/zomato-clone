import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This uses the live URL you set in your Render environment variables!
      const url = `${import.meta.env.VITE_API_URL}/api/auth/signup`;
      const res = await axios.post(url, formData);
      alert("Signup successful! You can now log in.");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
      <button type="submit">Sign Up</button>
    </form>
  );
};