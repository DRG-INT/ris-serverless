import Card from '../../components/ui/Card';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your organization settings</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Organization</h2>
            <p className="mt-1 text-sm text-gray-600">Manage organization details and settings.</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Organization settings are managed through the API.</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Users & Roles</h2>
            <p className="mt-1 text-sm text-gray-600">Manage staff, instructors, and permissions.</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">User management is available through the API.</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
            <p className="mt-1 text-sm text-gray-600">Configure third-party integrations.</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Integration settings are available through the API.</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            <p className="mt-1 text-sm text-gray-600">Security and authentication settings.</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Security settings are managed through the API.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
