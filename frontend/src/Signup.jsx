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

      // Backend returns 201 for new users
      if (response.status === 201) {
        alert("Signed up successfully! 🎉 You can now log in.");
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      // Access the specific message "User already exists" from your backend
      const serverMessage = err.response?.data?.message || "Signup failed";

      if (serverMessage === "User already exists") {
        alert("User already exists! ⚠️ Please use a different email or Login.");
      } else {
        // If it still says "Server error", the DB connection dropped again
        alert(`Error: ${serverMessage}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <div className="space-y-4">
          <input className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} />
          <input className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
          <input className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
          <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition-all transform active:scale-95">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;