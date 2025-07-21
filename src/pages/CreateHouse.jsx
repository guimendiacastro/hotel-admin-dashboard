import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('House created successfully!');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Create New House</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="House Name" onChange={handleChange} required />
              <Input name="description" placeholder="Description" onChange={handleChange} />
              <Input name="address" placeholder="Address" onChange={handleChange} />
              <Input name="primary_image_url" placeholder="Image URL" onChange={handleChange} />
              <Input name="capacity" placeholder="Capacity" type="number" onChange={handleChange} />
              <Button type="submit" className="w-full">Create</Button>
            </form>
            {message && <p className="mt-4 text-sm text-center text-blue-600">{message}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateHouse;
