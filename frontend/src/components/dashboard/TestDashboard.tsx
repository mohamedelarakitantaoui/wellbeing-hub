import { useAuth } from '../../context/AuthContext';

export function TestDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">No user found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        Test Dashboard
      </h1>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-neutral-700">
          User: {user.name || user.email}
        </p>
        <p className="text-neutral-700">
          Role: {user.role}
        </p>
      </div>
    </div>
  );
}
