import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import type { ClassSession } from '../../types';

export default function Calendar() {
  const { data: sessions, isLoading } = useQuery<ClassSession[]>({
    queryKey: ['sessions'],
    queryFn: () => api.get<ClassSession[]>('/scheduling'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="mt-1 text-sm text-gray-600">Schedule and sessions</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Activity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Starts</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Ends</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sessions?.map((session: any) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {session.activityId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{session.locationId}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {new Date(session.startsAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {new Date(session.endsAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{session.capacity || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Badge variant={session.status === 'scheduled' ? 'info' : 'default'}>
                        {session.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!sessions || sessions.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                      No sessions found.
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
