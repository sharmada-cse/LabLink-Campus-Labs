import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BookingCard from '../components/BookingCard';
import { useApp } from '../context/AppContext';
import { Calendar, Filter } from 'lucide-react';
import clsx from 'clsx';

const statusTabs = ['all', 'pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'];

export default function ReservationsPage() {
  const { currentUser, bookings, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const myBookings = bookings
    .filter(b => b.studentId === currentUser.id)
    .filter(b => activeTab === 'all' || b.status === activeTab)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <DashboardLayout title="My Reservations" subtitle="Track all your equipment booking requests">
      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {statusTabs.map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full border capitalize transition-all',
              activeTab === tab
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'glass text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
            )}>
            {tab === 'all' ? `All (${bookings.filter(b => b.studentId === currentUser.id).length})` : tab}
          </button>
        ))}
      </div>

      {myBookings.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Calendar size={40} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
          <p className="text-gray-500 text-sm">Start by exploring equipment and making a booking.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {myBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={cancelBooking}
              showActions
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
