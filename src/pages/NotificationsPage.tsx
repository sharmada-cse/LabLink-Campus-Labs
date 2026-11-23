import DashboardLayout from '../components/DashboardLayout';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking_approved': return <CheckCircle size={18} className="text-emerald-400" />;
      case 'booking_rejected': return <AlertCircle size={18} className="text-red-400" />;
      default: return <Info size={18} className="text-cyan-400" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'booking_approved': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'booking_rejected': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <DashboardLayout title="Notifications" subtitle="Stay updated on your bookings and equipment">
      {notifications.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Bell size={40} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
          <p className="text-gray-500">No notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                n.read ? 'opacity-50 glass border-white/8' : `glass ${getBg(n.type)}`
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getBg(n.type)}`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-white text-sm">{n.title}</h4>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1 ml-3" />}
                </div>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                <p className="text-xs text-gray-600 mt-2">{format(new Date(n.createdAt), 'MMM d, yyyy · h:mm a')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
