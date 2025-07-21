// HouseDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function HouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);

  useEffect(() => {
    const fetchHouse = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:3001/api/houses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHouse(data);
    };
    fetchHouse();
  }, [id]);

  if (!house)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100">
          &larr; Back
        </Button>

        <Card className="shadow-sm border bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">{house.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <img
              src={house.primary_image_url}
              alt={house.name}
              className="w-full h-64 object-cover rounded"
            />
            <div className="text-gray-700 space-y-2 text-sm">
              <p><span className="font-semibold">Description:</span> {house.description}</p>
              <p><span className="font-semibold">Address:</span> {house.address}</p>
              <p><span className="font-semibold">Capacity:</span> {house.capacity}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HouseDetails;
