import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organizationName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Recreation in Sport</h1>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-error">{error}</div>
          )}

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
            label="Organization name"
            value={form.organizationName}
            onChange={update('organizationName')}
            required
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={update('email')}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            required
            minLength={8}
            autoComplete="new-password"
          />

          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
