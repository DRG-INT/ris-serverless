import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import type { Lead } from '../../types';

export default function Crm() {
  const { data, isLoading } = useQuery<Lead[]>({
    queryKey: ['crm'],
    queryFn: () => api.get<Lead[]>('/crm'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
        <p className="mt-1 text-sm text-gray-600">Leads and pipeline</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Notes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{lead.source}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Badge variant={lead.status === 'converted' ? 'success' : lead.status === 'lost' ? 'error' : 'warning'}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{lead.notes || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!data || data.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                      No leads found.
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
