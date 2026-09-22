import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import type { Attendance } from '../../types';

export default function Attendance() {
  const { data, isLoading } = useQuery<Attendance[]>({
    queryKey: ['attendance'],
    queryFn: () => api.get<Attendance[]>('/attendance'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-1 text-sm text-gray-600">Track attendance</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Session</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Checked In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.map((record: any) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {record.memberId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{record.sessionId}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{record.method}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {new Date(record.checkedInAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(!data || data.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                      No attendance records found.
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
