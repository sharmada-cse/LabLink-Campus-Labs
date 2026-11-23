import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BookingCard from '../components/BookingCard';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

export default function FacultyDashboard() {
  const { bookings, updateBooking, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingBookings = bookings.filter(b => b.status === 'pending' && b.facultyApprovalRequired);
  const allBookings = bookings.filter(b => b.facultyApprovalRequired);

  const displayed = activeTab === 'pending' ? pendingBookings : allBookings;

  const handleApprove = (id: string) => {
    updateBooking(id, { status: 'approved', facultyId: currentUser.id, facultyName: currentUser.name });
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    updateBooking(id, { status: 'rejected', rejectionReason: rejectReason, facultyId: currentUser.id, facultyName: currentUser.name });
    setRejectId(null);
    setRejectReason('');
  };

  const stats = [
    { label: 'Pending Review', value: pendingBookings.length, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: 'Approved', value: allBookings.filter(b => b.status === 'approved').length, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
    { label: 'Rejected', value: allBookings.filter(b => b.status === 'rejected').length, icon: XCircle, color: 'from-red-500 to-rose-500' },
    { label: 'Total Requests', value: allBookings.length, icon: TrendingUp, color: 'from-cyan-500 to-violet-500' },
  ];

  return (
    <DashboardLayout title={`Faculty Dashboard`} subtitle={`Welcome, ${currentUser.name} · ${currentUser.department}`}>
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
      <div className="flex gap-2 mb-6">
        {(['pending', 'all'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium px-5 py-2 rounded-full border transition-all capitalize ${
              activeTab === tab ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'glass text-gray-400 border-white/10'
            }`}>
            {tab === 'pending' ? `Pending Review (${pendingBookings.length})` : `All Requests (${allBookings.length})`}
          </button>
        ))}
      </div>

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 w-full max-w-md border border-red-500/20">
            <h3 className="text-lg font-bold text-white mb-2">Reject Booking Request</h3>
            <p className="text-sm text-gray-400 mb-5">Please provide a reason for rejection so the student can make necessary changes.</p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="input-field resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => handleReject(rejectId!)}
                disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-semibold text-sm transition-all disabled:opacity-40">
                Reject
              </button>
              <button onClick={() => { setRejectId(null); setRejectReason(''); }}
                className="flex-1 py-2.5 rounded-xl glass text-gray-400 border border-white/10 hover:border-white/20 font-semibold text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
          <p className="text-gray-500 text-sm">No pending requests at this time.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onApprove={handleApprove}
              onReject={(id) => { setRejectId(id); setRejectReason(''); }}
              showActions
              isFaculty
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
