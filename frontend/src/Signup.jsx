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
      // Using the environment variable you set in Render
      const url = `${import.meta.env.VITE_API_URL}/api/auth/signup`;
      const response = await axios.post(url, formData);

      // If backend returns status 201 (Created)
      if (response.status === 201) {
        alert("Signed up successfully! 🎉 You can now log in.");
        setFormData({ name: '', email: '', password: '' }); // Clear form
      }
    } catch (err) {
      // Axios puts the backend's "User already exists" message here
      const serverMessage = err.response?.data?.message || "Signup failed";

      if (serverMessage === "User already exists") {
        alert("User already exists! ⚠️ Please use a different email or Login.");
      } else {
        // This will show "Server error" if the DB connection is still broken
        alert(`Error: ${serverMessage}`);
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
          <button type="submit" className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold hover:bg-orange-700 transition-colors">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;