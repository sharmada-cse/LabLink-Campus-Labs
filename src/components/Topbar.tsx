import { Bell, Search, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { currentUser, unreadCount } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 backdrop-blur-xl"
      style={{ background: 'rgba(2, 8, 24, 0.85)' }}>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2 w-72 border border-white/10">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search equipment, labs..."
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
              onFocus={() => navigate('/equipment')}
            />
          </div>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2.5 glass rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all"
          >
            <Bell size={18} className="text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <button className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/10 hover:border-white/20 transition-all">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
              {currentUser.avatar}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium text-white leading-none">{currentUser.name.split(' ')[0]}</div>
              <div className="text-xs text-gray-500 capitalize leading-none mt-0.5">{currentUser.role}</div>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
