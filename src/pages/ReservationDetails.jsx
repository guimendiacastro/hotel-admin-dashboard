
// ReservationDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Phone, Users, AlertCircle, FileText } from 'lucide-react';

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const [reservationResponse, guestsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/reservations/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:3001/api/guests?reservationId=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setReservation(reservationResponse.data);
        setGuests(guestsResponse.data);
      } catch (err) {
        setError('Failed to load reservation details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReservationData();
  }, [id, navigate]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const formatDateOfBirth = (dateString) =>
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
          <p className="text-gray-600">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 hover:bg-gray-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card className="max-w-md mx-auto">
            <CardContent className="flex items-center p-6">
              <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Error</h3>
                <p className="text-gray-600 text-sm">{error || 'Reservation not found'}</p>
                <Button onClick={() => window.location.reload()} className="mt-3" size="sm">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reservations
        </Button>

        {/* Reservation Details */}
        <Card className="shadow-sm border bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Reservation #{reservation.reservation_code}
              </CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Check-in Date</p>
                    <p className="text-gray-700">{formatDate(reservation.check_in_date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Check-out Date</p>
                    <p className="text-gray-700">{formatDate(reservation.check_out_date)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Contact Email</p>
                    <p className="text-gray-700">{reservation.contact_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Contact Phone</p>
                    <p className="text-gray-700">{reservation.contact_phone}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-2">Special Requests</p>
                    {reservation.special_requests ? (
                      <Badge variant="outline" className="py-1 px-3 text-sm">
                        {reservation.special_requests}
                      </Badge>
                    ) : (
                      <p className="text-gray-500 italic">No special requests</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest List */}
        <Card className="shadow-sm border bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-lg font-medium text-gray-800">
                Guest List ({guests.length} {guests.length === 1 ? 'guest' : 'guests'})
              </CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            {guests.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No guests registered for this reservation</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full text-sm">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Full Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date of Birth</TableHead>
                      <TableHead className="font-semibold text-gray-700">Nationality</TableHead>
                      <TableHead className="font-semibold text-gray-700">Passport Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id} className="hover:bg-gray-50 cursor-pointer">
                        <TableCell className="font-medium text-gray-900">
                          {guest.first_name} {guest.last_name}
                        </TableCell>
                        <TableCell>{formatDateOfBirth(guest.date_of_birth)}</TableCell>
                        <TableCell>{guest.nationality}</TableCell>
                        <TableCell className="font-mono text-sm">{guest.passport_number}</TableCell>
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
