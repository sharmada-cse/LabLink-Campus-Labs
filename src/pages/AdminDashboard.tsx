import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useApp } from '../context/AppContext';
import { equipment as allEquipment, departments, users } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Users as UsersIcon, Calendar, TrendingUp, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import type { Equipment } from '../types';
import clsx from 'clsx';

const deptChartData = departments.map(d => ({
  name: d.shortName,
  equipment: d.equipmentCount,
  labs: d.labCount,
}));

const utilizationData = allEquipment.slice(0, 6).map(eq => ({
  name: eq.name.substring(0, 15),
  bookings: eq.totalBookings,
}));

const statusPieData = [
  { name: 'Available', value: allEquipment.filter(e => e.status === 'available').length, color: '#4ade80' },
  { name: 'Booked', value: allEquipment.filter(e => e.status === 'booked').length, color: '#fbbf24' },
  { name: 'Maintenance', value: allEquipment.filter(e => e.status === 'maintenance').length, color: '#f87171' },
];

export default function AdminDashboard() {
  const { bookings } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'equipment' | 'users' | 'bookings'>('overview');
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(allEquipment);
  const [addingEq, setAddingEq] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const toggleEquipmentStatus = (id: string) => {
    setEquipmentList(prev => prev.map(eq =>
      eq.id === id ? { ...eq, status: eq.status === 'available' ? 'maintenance' : 'available' } : eq
    ));
    showNotification('Equipment status updated');
  };

  const stats = [
    { label: 'Total Equipment', value: equipmentList.length, icon: Package, color: 'from-cyan-500 to-blue-500' },
    { label: 'Total Users', value: users.length, icon: UsersIcon, color: 'from-violet-500 to-purple-500' },
    { label: 'All Bookings', value: bookings.length, icon: Calendar, color: 'from-amber-500 to-orange-500' },
    { label: 'Pending Requests', value: bookings.filter(b => b.status === 'pending').length, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
  ];

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'users', label: 'Users' },
    { key: 'bookings', label: 'Reservations' },
  ] as const;

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Manage campus laboratory resources">
      {/* Notification toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 glass rounded-xl px-5 py-3 border border-emerald-500/30 flex items-center gap-2 animate-slide-up">
          <CheckCircle size={16} className="text-emerald-400" />
          <span className="text-sm text-white">{notification}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'flex-shrink-0 text-sm font-medium px-5 py-2 rounded-full border transition-all',
              activeTab === tab.key ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'glass text-gray-400 border-white/10'
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Department equipment */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-5">Equipment by Department</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deptChartData} barSize={28}>
                  <XAxis dataKey="name" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="equipment" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status pie */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-5">Equipment Status</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {statusPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {statusPieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                      <span className="text-sm text-gray-300">{d.name}</span>
                      <span className="text-sm font-bold text-white ml-auto pl-4">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top utilization */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-5">Top Equipment by Bookings</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={utilizationData} layout="vertical" barSize={16}>
                <XAxis type="number" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 10 }} width={120} />
                <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="bookings" fill="#22d3ee" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Equipment management */}
      {activeTab === 'equipment' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white">Equipment Inventory ({equipmentList.length} items)</h3>
            <button onClick={() => setAddingEq(!addingEq)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <Plus size={16} /> Add Equipment
            </button>
          </div>
          {addingEq && (
            <div className="glass rounded-2xl p-6 mb-6 border border-cyan-500/20 animate-slide-up">
              <h4 className="font-semibold text-white mb-4">Add New Equipment</h4>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {['Name', 'Department', 'Lab', 'Location'].map(field => (
                  <div key={field}>
                    <label className="text-xs text-gray-500 mb-1.5 block">{field}</label>
                    <input placeholder={field} className="input-field text-sm" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setAddingEq(false); showNotification('Equipment added successfully (demo)'); }}
                  className="btn-primary text-sm py-2 px-4">Save Equipment</button>
                <button onClick={() => setAddingEq(false)} className="btn-ghost text-sm py-2 px-4">Cancel</button>
              </div>
            </div>
          )}
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/8">
                <tr className="text-left">
                  {['Equipment', 'Department', 'Status', 'Available', 'Bookings', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {equipmentList.slice(0, 10).map(eq => (
                  <tr key={eq.id} className="hover:bg-white/2 transition-all">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-white">{eq.name}</div>
                      <div className="text-xs text-gray-500">{eq.category}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{eq.department}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${
                        eq.status === 'available' ? 'status-available' :
                        eq.status === 'booked' ? 'status-booked' : 'status-unavailable'
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{eq.availableCount}/{eq.quantity}</td>
                    <td className="px-4 py-3 text-sm text-white">{eq.totalBookings}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toggleEquipmentStatus(eq.id)}
                          className="p-1.5 glass rounded-lg text-gray-400 hover:text-cyan-400 transition-all" title="Toggle status">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => { showNotification('Equipment removed (demo)'); }}
                          className="p-1.5 glass rounded-lg text-gray-400 hover:text-red-400 transition-all" title="Remove">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div>
          <h3 className="font-bold text-white mb-5">User Management ({users.length} users)</h3>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/8">
                <tr>
                  {['User', 'Role', 'Department', 'Email', 'Joined'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-white/2 transition-all">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                          {user.avatar}
                        </div>
                        <span className="text-sm font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs capitalize ${
                        user.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        user.role === 'faculty' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                        'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{user.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{user.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings management */}
      {activeTab === 'bookings' && (
        <div>
          <h3 className="font-bold text-white mb-5">All Reservations ({bookings.length})</h3>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/8">
                <tr>
                  {['Student', 'Equipment', 'Date & Time', 'Status', 'Priority'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/2 transition-all">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-white">{b.studentName}</div>
                      <div className="text-xs text-gray-500">{b.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white">{b.equipmentName}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[180px]">{b.projectTitle}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      <div>{b.timeSlot.date}</div>
                      <div>{b.timeSlot.startTime}–{b.timeSlot.endTime}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${
                        b.status === 'approved' ? 'status-available' :
                        b.status === 'pending' ? 'status-pending' :
                        b.status === 'rejected' ? 'status-unavailable' :
                        'status-booked'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold capitalize ${
                        b.priority === 'urgent' ? 'text-red-400' :
                        b.priority === 'high' ? 'text-amber-400' :
                        b.priority === 'medium' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                        {b.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
