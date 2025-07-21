import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservations } from '../api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calendar, Plus } from 'lucide-react';

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const { data } = await getReservations(token);
        setReservations(data);
      } catch (err) {
        setError('Failed to load reservations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex items-center p-6">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Error</h3>
              <p className="text-gray-600 text-sm">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-3" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto max-w-6xl px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-7 w-7 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Reservations</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/create-reservation')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Reservation
            </Button>
            <Button variant="outline" onClick={() => navigate('/houses')}>
              View Houses
            </Button>
          </div>
        </div>

        {/* Reservation Table Card */}
        <Card className="shadow-sm border bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800">
              All Reservations ({reservations.length})
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-md font-medium text-gray-800 mb-1">No reservations found</h3>
                <p className="text-gray-500 mb-3 text-sm">Create your first reservation to get started.</p>
                <Button onClick={() => navigate('/create-reservation')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Reservation
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full text-sm">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Code</TableHead>
                      <TableHead className="font-semibold text-gray-700">Check-In</TableHead>
                      <TableHead className="font-semibold text-gray-700">Check-Out</TableHead>
                      <TableHead className="font-semibold text-gray-700">Contact Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((r) => (
                      <TableRow
                        key={r.id}
                        onClick={() => navigate(`/reservations/${r.id}`)}
                        className="cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        <TableCell className="font-medium text-blue-600">{r.reservation_code}</TableCell>
                        <TableCell>{formatDate(r.check_in_date)}</TableCell>
                        <TableCell>{formatDate(r.check_out_date)}</TableCell>
                        <TableCell className="text-gray-600">{r.contact_email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
