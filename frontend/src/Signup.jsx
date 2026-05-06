import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/auth/signup`;
    const response = await axios.post(url, formData);

    // If the backend returns status 201 (Created)
    if (response.status === 201) {
      alert("Signed up successfully! 🎉 You can now log in.");
    }
  } catch (err) {
    // Axios puts the backend's JSON response in err.response.data
    const serverMessage = err.response?.data?.message;

    if (serverMessage === "User already exists") {
      alert("User already exists! ⚠️ Please use a different email or Login.");
    } else {
      alert(serverMessage || "Signup failed. Please try again.");
    }
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        <input className="w-full mb-4 p-3 border rounded-xl" type="text" placeholder="Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input className="w-full mb-4 p-3 border rounded-xl" type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input className="w-full mb-6 p-3 border rounded-xl" type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit" className="w-full bg-brand-500 text-white p-3 rounded-xl font-bold hover:bg-brand-600">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;