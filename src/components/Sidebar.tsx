import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Zap, Brain, FolderOpen, Calendar,
  Bell, User, LogOut, ChevronRight, FlaskConical, Settings, Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import clsx from 'clsx';

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/equipment', icon: Search, label: 'Explore Equipment' },
  { to: '/booking', icon: Calendar, label: 'Smart Booking' },
  { to: '/smartlab', icon: Brain, label: 'SmartLab AI' },
  { to: '/projects', icon: FolderOpen, label: 'My Projects' },
  { to: '/reservations', icon: Zap, label: 'My Reservations' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const facultyLinks = [
  { to: '/faculty', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/faculty/requests', icon: Bell, label: 'Access Requests' },
  { to: '/faculty/equipment', icon: Search, label: 'Equipment' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/equipment', icon: FlaskConical, label: 'Equipment' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/bookings', icon: Calendar, label: 'Reservations' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { currentUser, unreadCount, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const links =
    currentUser.role === 'admin' ? adminLinks :
    currentUser.role === 'faculty' ? facultyLinks :
    studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50 border-r border-white/8"
      style={{ background: 'linear-gradient(180deg, #060d1f 0%, #0a1628 100%)' }}>
      {/* Logo */}
      <div className="p-6 border-b border-white/8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-glow-cyan">
            <FlaskConical size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-none">LabLink</div>
            <div className="text-xs text-gray-500 leading-none mt-0.5">Campus Labs</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="bg-cyan-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
              {isActive && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{currentUser.name}</div>
            <div className="text-xs text-gray-500 capitalize">{currentUser.role} · {currentUser.department}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
