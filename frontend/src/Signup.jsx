import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend URL from your environment variables
      const url = `${import.meta.env.VITE_API_URL}/api/auth/signup`;
      const response = await axios.post(url, formData);

      // Status 201 means account was created successfully
      if (response.status === 201) {
        alert("Signed up successfully! 🎉 You can now log in.");
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      // Access the backend message: "User already exists" or "Server error"
      const msg = err.response?.data?.message || "Signup failed";

      if (msg === "User already exists") {
        alert("User already exists! ⚠️ Please use a different email or Login.");
      } else {
        alert(`Error: ${msg}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <div className="space-y-4">
          <input className="w-full p-3 border rounded-xl" type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
          <input className="w-full p-3 border rounded-xl" type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
          <input className="w-full p-3 border rounded-xl" type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
          <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;