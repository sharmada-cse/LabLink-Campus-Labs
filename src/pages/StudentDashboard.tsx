import { useNavigate } from 'react-router-dom';
import {
  Calendar, Package, Clock, TrendingUp, ArrowRight,
  Zap, Brain, Bell, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useApp } from '../context/AppContext';
import { equipment, departments } from '../data/mockData';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const activityData = [
  { day: 'Mon', bookings: 4, available: 18 },
  { day: 'Tue', bookings: 7, available: 15 },
  { day: 'Wed', bookings: 5, available: 16 },
  { day: 'Thu', bookings: 9, available: 12 },
  { day: 'Fri', bookings: 11, available: 10 },
  { day: 'Sat', bookings: 3, available: 20 },
  { day: 'Sun', bookings: 2, available: 22 },
];

export default function StudentDashboard() {
  const { currentUser, bookings, notifications } = useApp();
  const navigate = useNavigate();

  const myBookings = bookings.filter(b => b.studentId === currentUser.id);
  const pendingCount = myBookings.filter(b => b.status === 'pending').length;
  const approvedCount = myBookings.filter(b => b.status === 'approved').length;
  const availableEquipment = equipment.filter(e => e.status === 'available').length;

  const upcomingBookings = myBookings
    .filter(b => b.status === 'approved' || b.status === 'active')
    .sort((a, b) => new Date(a.timeSlot.date).getTime() - new Date(b.timeSlot.date).getTime())
    .slice(0, 3);

  const recommendations = equipment
    .filter(e => e.status === 'available' && e.department === currentUser.department)
    .slice(0, 4);

  const stats = [
    {
      label: 'Total Bookings',
      value: myBookings.length,
      icon: Calendar,
      color: 'from-cyan-500 to-blue-500',
      glow: 'shadow-glow-cyan',
      change: '+2 this week',
    },
    {
      label: 'Available Equipment',
      value: availableEquipment,
      icon: Package,
      color: 'from-emerald-500 to-teal-500',
      glow: '',
      change: 'in your dept',
    },
    {
      label: 'Pending Requests',
      value: pendingCount,
      icon: Loader2,
      color: 'from-amber-500 to-orange-500',
      glow: '',
      change: 'awaiting review',
    },
    {
      label: 'Approved',
      value: approvedCount,
      icon: CheckCircle,
      color: 'from-violet-500 to-purple-500',
      glow: 'shadow-glow-violet',
      change: 'ready to use',
    },
  ];

  return (
    <DashboardLayout
      title={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${currentUser.name.split(' ')[0]} 👋`}
      subtitle={`${format(new Date(), 'EEEE, MMMM d, yyyy')} · ${currentUser.department} Department`}
    >
      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => navigate('/equipment')}
          className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Package size={16} /> Explore Equipment
        </button>
        <button onClick={() => navigate('/smartlab')}
          className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
          <Brain size={16} /> SmartLab AI
        </button>
        <button onClick={() => navigate('/booking')}
          className="btn-ghost flex items-center gap-2 text-sm py-2 px-4">
          <Calendar size={16} /> New Booking
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className={`stat-card group hover:scale-105 transition-all duration-300`}>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${stat.color}`} style={{ opacity: 0.03 }} />
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 ${stat.glow}`}>
              <stat.icon size={22} className="text-white" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-300">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Activity chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Lab Activity</h2>
              <p className="text-xs text-gray-500">Bookings vs available slots this week</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Bookings</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-400" /> Available</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="bookings" stroke="#22d3ee" fill="url(#cyanGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="available" stroke="#a78bfa" fill="url(#violetGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell size={18} className="text-cyan-400" /> Alerts
            </h2>
            <button onClick={() => navigate('/notifications')}
              className="text-xs text-cyan-400 hover:text-cyan-300">View all</button>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
            ) : notifications.slice(0, 4).map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${n.read ? 'opacity-50' : 'bg-white/3'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'booking_approved' ? 'bg-emerald-500/20' :
                  n.type === 'booking_rejected' ? 'bg-red-500/20' : 'bg-cyan-500/20'
                }`}>
                  {n.type === 'booking_approved' ? <CheckCircle size={14} className="text-emerald-400" /> :
                   n.type === 'booking_rejected' ? <AlertCircle size={14} className="text-red-400" /> :
                   <Bell size={14} className="text-cyan-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white leading-tight">{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-tight">{n.message}</div>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming reservations */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-violet-400" /> Upcoming Reservations
            </h2>
            <button onClick={() => navigate('/reservations')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={28} className="text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No upcoming reservations</p>
                <button onClick={() => navigate('/equipment')}
                  className="mt-3 text-xs text-cyan-400 hover:text-cyan-300">
                  Book equipment now →
                </button>
              </div>
            ) : upcomingBookings.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center shrink-0">
                  <Zap size={16} className="text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{b.equipmentName}</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(b.timeSlot.date), 'MMM d')} · {b.timeSlot.startTime}–{b.timeSlot.endTime}
                  </div>
                </div>
                <span className="badge status-available text-xs">{b.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" /> Recommended for You
            </h2>
            <button onClick={() => navigate('/equipment')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recommendations.map(eq => (
              <div key={eq.id}
                onClick={() => navigate('/equipment')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all cursor-pointer group">
                <img
                  src={eq.image}
                  alt={eq.name}
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={e => (e.currentTarget.src = `https://placehold.co/40x40/0a1628/22d3ee?text=${eq.name[0]}`)}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{eq.name}</div>
                  <div className="text-xs text-gray-500">{eq.availableCount} available · {eq.lab}</div>
                </div>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department overview */}
      <div className="mt-6 glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-5">Department Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {departments.map(dept => (
            <div key={dept.id}
              onClick={() => navigate('/equipment')}
              className="p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-all cursor-pointer group">
              <div className="text-2xl mb-2">{dept.icon}</div>
              <div className="text-sm font-semibold text-white">{dept.shortName}</div>
              <div className="text-xs text-gray-500 mb-2">{dept.equipmentCount} items</div>
              <div className="h-1 rounded-full bg-white/10">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(dept.equipmentCount / 250) * 100}%`, background: dept.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
