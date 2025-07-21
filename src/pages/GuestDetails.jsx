import { useState } from 'react';
import axios from 'axios';

function CreateHouse() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    primary_image_url: '',
    capacity: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/api/houses', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('House created successfully!');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New House</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="House Name" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input name="description" placeholder="Description" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="address" placeholder="Address" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="primary_image_url" placeholder="Image URL" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="capacity" placeholder="Capacity" type="number" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <button className="bg-green-600 text-white py-2 px-4 rounded">Create</button>
      </form>
      {message && <p className="mt-4 text-sm text-center text-blue-600">{message}</p>}
    </div>
  );
}

export default CreateHouse;
