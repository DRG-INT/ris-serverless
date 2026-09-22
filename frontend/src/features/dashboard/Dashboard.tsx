import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import Spinner from '../../components/ui/Spinner';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import type { Member, Activity } from '../../types';

interface RevenueResponse {
  total: number;
  count: number;
  currency: string;
}

export default function Dashboard() {
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => api.get<{ data: Member[]; meta: { total: number; page: number; limit: number } }>('/members'),
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: () => api.get<Activity[]>('/activities'),
  });

  const { data: revenue } = useQuery({
    queryKey: ['reports', 'revenue'],
    queryFn: () => api.get<RevenueResponse>('/reports/revenue'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome to Recreation in Sport</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-600">Total Members</p>
            {membersLoading ? (
              <Spinner />
            ) : (
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {members?.meta?.total || 0}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-600">Activities</p>
            {activitiesLoading ? (
              <Spinner />
            ) : (
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {activities?.length || 0}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            {revenue?.total !== undefined ? (
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {revenue.total.toLocaleString()} {revenue.currency}
              </p>
            ) : (
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="mt-2 text-3xl font-bold text-green-600">Active</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            {activitiesLoading ? (
              <Spinner />
            ) : activities && activities.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {activities.slice(0, 5).map((activity) => (
                  <li key={activity.id} className="text-sm text-gray-700">
                    {activity.name} - {activity.type}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No activities yet.</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API</span>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Authentication</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
