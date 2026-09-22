import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import type { Activity } from '../../types';

export default function Activities() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', capacity: '', duration: '' });

  const { data, isLoading } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: () => api.get<Activity[]>('/activities'),
  });

  const createMutation = useMutation({
    mutationFn: (data: unknown) => api.post('/activities', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setShowForm(false);
      setForm({ name: '', type: '', capacity: '', duration: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      capacity: form.capacity ? parseInt(form.capacity) : undefined,
      duration: form.duration ? parseInt(form.duration) : undefined,
    });
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="mt-1 text-sm text-gray-600">Manage activities and classes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Activity'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">New Activity</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                value={form.name}
                onChange={update('name')}
                required
              />
              <Input
                label="Type"
                value={form.type}
                onChange={update('type')}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Capacity"
                type="number"
                value={form.capacity}
                onChange={update('capacity')}
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={form.duration}
                onChange={update('duration')}
              />
            </div>
            {createMutation.isError && (
              <p className="text-sm text-error">
                {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create activity'}
              </p>
            )}
            <Button type="submit" loading={createMutation.isPending}>
              Create Activity
            </Button>
          </form>
        </Card>
      )}

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
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.map((activity: any) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {activity.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{activity.type}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{activity.capacity || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{activity.duration || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Badge variant={activity.status === 'active' ? 'success' : 'default'}>
                        {activity.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!data || data.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      No activities found. Create your first activity to get started.
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
