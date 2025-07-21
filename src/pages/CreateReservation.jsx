import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

function CreateReservation() {
  const [houses, setHouses] = useState([]);
  const [form, setForm] = useState({
    house_id: '',
    reservation_code: '',
    check_in_date: '',
    check_out_date: '',
    contact_email: '',
    contact_phone: '',
    special_requests: '',
    status: 'confirmed'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchHouses = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:3001/api/houses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHouses(data);
    };
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/api/reservations', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Reservation created successfully!');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Create Reservation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="house_id"
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select a House</option>
                {houses.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
              <Input name="reservation_code" placeholder="Reservation Code" onChange={handleChange} required />
              <Input name="check_in_date" type="date" onChange={handleChange} required />
              <Input name="check_out_date" type="date" onChange={handleChange} required />
              <Input name="contact_email" placeholder="Contact Email" onChange={handleChange} />
              <Input name="contact_phone" placeholder="Contact Phone" onChange={handleChange} />
              <Textarea name="special_requests" placeholder="Special Requests" onChange={handleChange} />
              <Button type="submit" className="w-full">Create</Button>
            </form>
            {message && <p className="mt-4 text-sm text-center text-blue-600">{message}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateReservation;
