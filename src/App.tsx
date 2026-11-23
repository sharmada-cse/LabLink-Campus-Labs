import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import type { ReactNode } from 'react';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import EquipmentPage from './pages/EquipmentPage';
import SmartLabPage from './pages/SmartLabPage';
import BookingPage from './pages/BookingPage';
import ReservationsPage from './pages/ReservationsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Route guards
function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireRole({ role, children }: { role: string | string[]; children: ReactNode }) {
  const { currentUser, isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(currentUser.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Student routes */}
      <Route path="/dashboard" element={<RequireAuth><StudentDashboard /></RequireAuth>} />
      <Route path="/equipment" element={<RequireAuth><EquipmentPage /></RequireAuth>} />
      <Route path="/smartlab" element={<RequireAuth><SmartLabPage /></RequireAuth>} />
      <Route path="/booking" element={<RequireAuth><BookingPage /></RequireAuth>} />
      <Route path="/reservations" element={<RequireAuth><ReservationsPage /></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/projects" element={<RequireAuth><ProjectsPage /></RequireAuth>} />

      {/* Faculty routes */}
      <Route path="/faculty" element={<RequireRole role="faculty"><FacultyDashboard /></RequireRole>} />
      <Route path="/faculty/requests" element={<RequireRole role="faculty"><FacultyDashboard /></RequireRole>} />
      <Route path="/faculty/equipment" element={<RequireRole role={['faculty', 'admin']}><EquipmentPage /></RequireRole>} />

      {/* Admin routes */}
      <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
      <Route path="/admin/equipment" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
      <Route path="/admin/users" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
      <Route path="/admin/bookings" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
      <Route path="/admin/settings" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
