import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import type { Payment } from '../../types';

export default function Payments() {
  const { data, isLoading } = useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: () => api.get<Payment[]>('/payments'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-600">Payment transactions</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Currency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {payment.memberId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {Number(payment.amount).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{payment.currency}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Badge variant={payment.status === 'succeeded' ? 'success' : payment.status === 'pending' ? 'warning' : 'error'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{payment.provider}</td>
                  </tr>
                ))}
                {(!data || data.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      No payments found.
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
