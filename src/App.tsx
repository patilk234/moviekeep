import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/Layout/AppLayout';
import { Browse } from './pages/Browse';
import { MyLists } from './pages/MyLists';
import { AddCustomMovie } from './pages/AddCustomMovie';
import { WatchlistDetail } from './pages/WatchlistDetail';
import { Login } from './pages/Login';

// Auth wrapper component
const AuthenticatedApp = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--color-text-muted)',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/lists" element={<MyLists />} />
        <Route path="/lists/:id" element={<WatchlistDetail />} />
        <Route path="/add-custom" element={<AddCustomMovie />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthenticatedApp />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
