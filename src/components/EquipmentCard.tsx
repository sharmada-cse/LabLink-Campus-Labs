import type { Equipment } from '../types';
import { MapPin, Clock, Star, Users, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface EquipmentCardProps {
  equipment: Equipment;
  onBook?: (equipment: Equipment) => void;
  compact?: boolean;
}

const statusConfig = {
  available: { label: 'Available', class: 'status-available' },
  booked: { label: 'Fully Booked', class: 'status-booked' },
  maintenance: { label: 'Maintenance', class: 'status-unavailable' },
  unavailable: { label: 'Unavailable', class: 'status-unavailable' },
};

const categoryColors: Record<string, string> = {
  microcontroller: 'from-blue-500 to-cyan-500',
  computing: 'from-violet-500 to-purple-600',
  iot: 'from-cyan-500 to-teal-500',
  robotics: 'from-orange-500 to-amber-500',
  measurement: 'from-green-500 to-emerald-500',
  fabrication: 'from-pink-500 to-rose-500',
  networking: 'from-blue-600 to-indigo-500',
  sensors: 'from-yellow-500 to-amber-500',
};

export default function EquipmentCard({ equipment: eq, onBook, compact }: EquipmentCardProps) {
  const status = statusConfig[eq.status];
  const gradientClass = categoryColors[eq.category] || 'from-cyan-500 to-violet-500';

  if (compact) {
    return (
      <div className="glass rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group"
        onClick={() => onBook?.(eq)}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-lg shrink-0`}>
            🔬
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{eq.name}</div>
            <div className="text-xs text-gray-500">{eq.department} · {eq.lab}</div>
          </div>
          <span className={`badge ${status.class} shrink-0`}>{status.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden hover:border-cyan-500/20 hover:shadow-glow-sm transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={eq.image}
          alt={eq.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/0a1628/22d3ee?text=${encodeURIComponent(eq.name.substring(0, 15))}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`badge ${status.class}`}>{status.label}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs text-white font-medium">{eq.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${gradientClass} text-white`}>
            {eq.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-white text-base leading-tight mb-1">{eq.name}</h3>
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{eq.description}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-cyan-400" />
            <span>{eq.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-violet-400" />
            <span>Max {eq.maxBookingHours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} className="text-green-400" />
            <span>{eq.availableCount}/{eq.quantity}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {eq.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/8">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="text-white font-medium">{eq.totalBookings}</span> total bookings
          </div>
          <button
            onClick={() => onBook?.(eq)}
            disabled={eq.status !== 'available'}
            className={clsx(
              'flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200',
              eq.status === 'available'
                ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:shadow-glow-cyan hover:scale-105 active:scale-95'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            )}
          >
            {eq.status === 'available' ? 'Book Now' : 'Unavailable'}
            {eq.status === 'available' && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
