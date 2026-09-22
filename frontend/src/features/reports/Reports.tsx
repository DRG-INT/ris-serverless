import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

interface RevenueResponse {
  total: number;
  count: number;
  currency: string;
}

interface BookingsResponse {
  total: number;
  byStatus: Record<string, number>;
}

interface MembersResponse {
  total: number;
  activeMemberships: number;
}

export default function Reports() {
  const { data: revenue } = useQuery<RevenueResponse>({
    queryKey: ['reports', 'revenue'],
    queryFn: () => api.get<RevenueResponse>('/reports/revenue'),
  });

  const { data: bookings } = useQuery<BookingsResponse>({
    queryKey: ['reports', 'bookings'],
    queryFn: () => api.get<BookingsResponse>('/reports/bookings'),
  });

  const { data: members } = useQuery<MembersResponse>({
    queryKey: ['reports', 'members'],
    queryFn: () => api.get<MembersResponse>('/reports/members'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-600">Business insights</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
            {revenue?.total !== undefined ? (
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {revenue.total.toLocaleString()} {revenue.currency}
              </p>
            ) : (
              <Spinner />
            )}
            <p className="mt-1 text-xs text-gray-500">{revenue?.count || 0} transactions</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-600">Bookings</h3>
            {bookings?.total !== undefined ? (
              <p className="mt-2 text-3xl font-bold text-gray-900">{bookings.total}</p>
            ) : (
              <Spinner />
            )}
            <p className="mt-1 text-xs text-gray-500">
              {Object.entries(bookings?.byStatus || {}).map(([status, count]) => (
                <span key={status} className="mr-2">
                  {status}: {(count as number)}
                </span>
              ))}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-600">Members</h3>
            {members?.total !== undefined ? (
              <p className="mt-2 text-3xl font-bold text-gray-900">{members.total}</p>
            ) : (
              <Spinner />
            )}
            <p className="mt-1 text-xs text-gray-500">{members?.activeMemberships || 0} active memberships</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
