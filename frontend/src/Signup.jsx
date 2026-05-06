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
      // Using your environment variable for the backend URL
      const url = `${import.meta.env.VITE_API_URL}/api/auth/signup`;
      const response = await axios.post(url, formData);

      // 1. Success Case: Backend returns 201 Created
      if (response.status === 201) {
        alert("Signed up successfully! 🎉 You can now log in.");
        // Clear form after success
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      // 2. Error Case: Access the specific message sent by your backend
      const errorMessage = err.response?.data?.message || "Signup failed";

      if (errorMessage === "User already exists") {
        alert("User already exists! ⚠️ Please use a different email or Login.");
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        
        <input 
          className="w-full mb-4 p-3 border rounded-xl" 
          type="text" 
          name="name"
          placeholder="Name" 
          required 
          value={formData.name}
          onChange={handleChange} 
        />
        
        <input 
          className="w-full mb-4 p-3 border rounded-xl" 
          type="email" 
          name="email"
          placeholder="Email" 
          required 
          value={formData.email}
          onChange={handleChange} 
        />
        
        <input 
          className="w-full mb-6 p-3 border rounded-xl" 
          type="password" 
          name="password"
          placeholder="Password" 
          required 
          value={formData.password}
          onChange={handleChange} 
        />
        
        <button 
          type="submit" 
          className="w-full bg-brand-500 text-white p-3 rounded-xl font-bold hover:bg-brand-600 transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;