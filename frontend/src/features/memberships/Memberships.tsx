import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import type { Membership } from '../../types';

export default function Memberships() {
  const { data, isLoading } = useQuery<Membership[]>({
    queryKey: ['memberships'],
    queryFn: () => api.get<Membership[]>('/memberships'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Memberships</h1>
        <p className="mt-1 text-sm text-gray-600">Manage memberships</p>
      </div>

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
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Start</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.map((membership: any) => (
                  <tr key={membership.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {membership.memberId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{membership.productId}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Badge variant={membership.status === 'active' ? 'success' : 'default'}>
                        {membership.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {new Date(membership.startsAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {membership.expiresAt ? new Date(membership.expiresAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
                {(!data || data.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      No memberships found.
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
