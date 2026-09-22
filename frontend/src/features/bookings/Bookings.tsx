import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import type { Booking } from '../../types';

export default function Bookings() {
  const queryClient = useQueryClient();
  const [memberId, setMemberId] = useState('');
  const [sessionId, setSessionId] = useState('');

  const { data, isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () => api.get<Booking[]>('/bookings'),
  });

  const createMutation = useMutation({
    mutationFn: (data: unknown) => api.post('/bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setMemberId('');
      setSessionId('');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.post(`/bookings/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ memberId, sessionId });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-600">Manage class bookings</p>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">New Booking</h2>
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <Input
              label="Member ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
            />
          </div>
          <div className="w-64">
            <Input
              label="Session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
            />
          </div>
          <Button type="submit" loading={createMutation.isPending}>
            Create Booking
          </Button>
        </form>
        {createMutation.isError && (
          <p className="mt-2 text-sm text-error">
            {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create booking'}
          </p>
        )}
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Session</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{booking.id}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{booking.memberId}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{booking.sessionId}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'waitlisted' ? 'warning' : 'default'}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {booking.status !== 'cancelled' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => cancelMutation.mutate(booking.id)}
                          loading={cancelMutation.isPending}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {(!data || data.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
