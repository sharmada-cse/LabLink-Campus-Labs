import DashboardLayout from '../components/DashboardLayout';
import { useApp } from '../context/AppContext';
import { User, Mail, Building, Hash, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser } = useApp();

  const fields = [
    { label: 'Full Name', value: currentUser.name, icon: User },
    { label: 'Email', value: currentUser.email, icon: Mail },
    { label: 'Department', value: currentUser.department, icon: Building },
    { label: 'Role', value: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1), icon: Shield },
    { label: currentUser.role === 'student' ? 'Student ID' : 'Faculty ID', value: currentUser.studentId || currentUser.facultyId || 'N/A', icon: Hash },
    { label: 'Member Since', value: currentUser.joinedAt, icon: Calendar },
  ];

  return (
    <DashboardLayout title="My Profile" subtitle="View and manage your account">
      <div className="max-w-2xl">
        {/* Avatar card */}
        <div className="glass rounded-2xl p-8 text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 shadow-glow-cyan">
            {currentUser.avatar}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h2>
          <p className="text-gray-400">{currentUser.email}</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className={`badge capitalize ${
              currentUser.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              currentUser.role === 'faculty' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
              'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              {currentUser.role}
            </span>
            <span className="badge bg-white/5 text-gray-400 border border-white/10">{currentUser.department}</span>
          </div>
        </div>

        {/* Details */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white mb-5">Account Details</h3>
          {fields.map(f => (
            <div key={f.label} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
              <div className="w-9 h-9 rounded-lg glass flex items-center justify-center shrink-0">
                <f.icon size={16} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{f.label}</div>
                <div className="text-sm font-medium text-white mt-0.5">{f.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo notice */}
        <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            ⚠️ <strong>Demo Mode:</strong> Profile editing is not available in demo mode.
            Connect Firebase Authentication for real user management.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
