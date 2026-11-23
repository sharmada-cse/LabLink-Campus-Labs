import type { Booking } from '../types';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Loader2, Ban } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: Booking;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  showActions?: boolean;
  isFaculty?: boolean;
}

const statusConfig = {
  pending: { icon: Loader2, label: 'Pending Review', class: 'status-pending', iconClass: 'text-blue-400 animate-spin' },
  approved: { icon: CheckCircle, label: 'Approved', class: 'status-available', iconClass: 'text-emerald-400' },
  rejected: { icon: XCircle, label: 'Rejected', class: 'status-unavailable', iconClass: 'text-red-400' },
  active: { icon: AlertCircle, label: 'Active', class: 'bg-violet-500/20 text-violet-400 border border-violet-500/30', iconClass: 'text-violet-400' },
  completed: { icon: CheckCircle, label: 'Completed', class: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', iconClass: 'text-gray-400' },
  cancelled: { icon: Ban, label: 'Cancelled', class: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', iconClass: 'text-gray-400' },
};

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-amber-400',
  urgent: 'text-red-400',
};

export default function BookingCard({ booking, onApprove, onReject, onCancel, showActions, isFaculty }: BookingCardProps) {
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  return (
    <div className="glass rounded-xl p-5 hover:border-white/15 transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge ${status.class} flex items-center gap-1`}>
              <StatusIcon size={12} className={status.iconClass} />
              {status.label}
            </span>
            <span className={`text-xs font-medium ${priorityColors[booking.priority]}`}>
              {booking.priority.toUpperCase()} PRIORITY
            </span>
          </div>
          <h3 className="font-semibold text-white text-sm">{booking.equipmentName}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{booking.projectTitle}</p>
        </div>
        {booking.deadline && (
          <div className="text-right shrink-0">
            <div className="text-xs text-gray-500">Deadline</div>
            <div className="text-xs font-medium text-amber-400">
              {format(new Date(booking.deadline), 'MMM d, yyyy')}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-cyan-400" />
          <span>{format(new Date(booking.timeSlot.date), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-violet-400" />
          <span>{booking.timeSlot.startTime} – {booking.timeSlot.endTime}</span>
        </div>
      </div>

      {isFaculty && (
        <div className="mb-3 text-xs text-gray-400">
          <span className="text-gray-500">Student: </span>
          <span className="text-white">{booking.studentName}</span>
          <span className="text-gray-500"> · </span>
          <span>{booking.department}</span>
        </div>
      )}

      {booking.rejectionReason && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-400"><span className="font-medium">Reason: </span>{booking.rejectionReason}</p>
        </div>
      )}

      {showActions && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/8">
          {isFaculty && booking.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove?.(booking.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-semibold transition-all"
              >
                <CheckCircle size={14} /> Approve
              </button>
              <button
                onClick={() => onReject?.(booking.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-xs font-semibold transition-all"
              >
                <XCircle size={14} /> Reject
              </button>
            </>
          )}
          {!isFaculty && (booking.status === 'pending' || booking.status === 'approved') && (
            <button
              onClick={() => onCancel?.(booking.id)}
              className={clsx(
                'flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold transition-all',
                'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
              )}
            >
              <Ban size={14} /> Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
