import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import type { Member } from '../../types';

export default function Members() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['members', page],
    queryFn: () => api.get<{ data: Member[]; meta: { total: number; page: number; limit: number } }>(`/members?page=${page}&limit=20`),
  });

  const createMutation = useMutation({
    mutationFn: (data: unknown) => api.post('/members', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your members</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Member'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">New Member</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                value={form.firstName}
                onChange={update('firstName')}
                required
              />
              <Input
                label="Last name"
                value={form.lastName}
                onChange={update('lastName')}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={update('email')}
              required
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={update('phone')}
            />
            {createMutation.isError && (
              <p className="text-sm text-error">
                {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create member'}
              </p>
            )}
            <Button type="submit" loading={createMutation.isPending}>
              Create Member
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
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.data?.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{member.email}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{member.phone || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <Badge variant={member.status === 'active' ? 'success' : 'default'}>
                          {member.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {(!data?.data || data.data.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                        No members found. Create your first member to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data?.meta && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                <div className="text-sm text-gray-700">
                  Page {data.meta.page} of {Math.ceil(data.meta.total / data.meta.limit) || 1}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= Math.ceil(data.meta.total / data.meta.limit)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
