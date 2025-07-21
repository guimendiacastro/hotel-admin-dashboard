import { useEffect, useState } from 'react';
import { getHouses } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function HouseList() {
  const [houses, setHouses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const { data } = await getHouses(token);
      setHouses(data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">All Houses</h1>
          <Button onClick={() => navigate('/create-house')}>Add New House</Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {houses.map((house) => (
            <Card
              key={house.id}
              className="overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/houses/${house.id}`)}
            >
              <img
                src={house.primary_image_url}
                alt={house.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold text-gray-900">{house.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{house.address}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HouseList;
