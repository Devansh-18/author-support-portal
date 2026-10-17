import { useAuth } from './context/AuthContext.jsx';
import { LoginPage } from './components/auth/LoginPage.jsx';
import { AuthorDashboard } from './components/author/AuthorDashboard.jsx';
import { AdminDashboard } from './components/admin/AdminDashboard.jsx';

export default function App() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAF7F2',
          color: '#8C847A',
          fontSize: '15px'
        }}
      >
        Initializing BookLeaf Studio...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <AuthorDashboard />;
}
