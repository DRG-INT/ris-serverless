import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import type { Message } from '../../types';

export default function Messages() {
  const { data, isLoading } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: () => api.get<Message[]>('/messages'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-600">Communications</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.map((message: any) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {message.channel}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{message.subject || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Badge variant={message.status === 'sent' ? 'success' : 'warning'}>{message.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {message.sentAt ? new Date(message.sentAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
                {(!data || data.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                      No messages found.
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
