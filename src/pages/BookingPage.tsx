import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useApp } from '../context/AppContext';
import { equipment as allEquipment } from '../data/mockData';
import { checkBookingConflict } from '../services/aiService';
import type { Equipment, TimeSlot, Booking } from '../types';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import clsx from 'clsx';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, bookings, addBooking } = useApp();

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(location.state?.equipment || null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedStart, setSelectedStart] = useState<string>(location.state?.slot?.startTime || '09:00');
  const [selectedEnd, setSelectedEnd] = useState<string>(location.state?.slot?.endTime || '13:00');
  const [form, setForm] = useState({
    projectTitle: '',
    projectDescription: '',
    purpose: '',
    priority: 'medium' as Booking['priority'],
    deadline: '',
  });
  const [conflict, setConflict] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newBookingId, setNewBookingId] = useState('');

  // Pre-fill from location state slot
  useEffect(() => {
    if (location.state?.slot) {
      setSelectedDate(location.state.slot.date);
      setSelectedStart(location.state.slot.startTime);
      setSelectedEnd(location.state.slot.endTime);
    }
  }, [location.state]);

  // Check conflicts whenever selection changes
  useEffect(() => {
    if (!selectedEquipment || !selectedDate || !selectedStart || !selectedEnd) return;
    const hasConflict = checkBookingConflict(bookings, selectedEquipment.id, selectedDate, selectedStart, selectedEnd);
    setConflict(hasConflict);
  }, [selectedEquipment, selectedDate, selectedStart, selectedEnd, bookings]);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const isSlotBooked = (date: string, time: string) => {
    if (!selectedEquipment) return false;
    return bookings.some(b =>
      b.equipmentId === selectedEquipment.id &&
      b.timeSlot.date === date &&
      b.status !== 'cancelled' && b.status !== 'rejected' &&
      time >= b.timeSlot.startTime && time < b.timeSlot.endTime
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment || conflict) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    const booking: Booking = {
      id: `bk-${Date.now()}`,
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      studentId: currentUser.id,
      studentName: currentUser.name,
      department: currentUser.department,
      projectTitle: form.projectTitle,
      projectDescription: form.projectDescription,
      purpose: form.purpose,
      timeSlot: { date: selectedDate, startTime: selectedStart, endTime: selectedEnd },
      status: selectedEquipment.requiresFacultyApproval ? 'pending' : 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      facultyApprovalRequired: selectedEquipment.requiresFacultyApproval,
      priority: form.priority,
      deadline: form.deadline,
    };

    addBooking(booking);
    setNewBookingId(booking.id);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <DashboardLayout title="Booking Confirmation">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-glow-cyan animate-pulse-glow">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            {selectedEquipment?.requiresFacultyApproval ? 'Request Submitted!' : 'Booking Confirmed!'}
          </h2>
          <p className="text-gray-400 mb-2">
            {selectedEquipment?.requiresFacultyApproval
              ? 'Your booking request has been sent for faculty approval. You\'ll receive a notification once reviewed.'
              : 'Your booking is confirmed! You\'re all set.'}
          </p>
          <div className="glass rounded-2xl p-6 my-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Equipment</span>
              <span className="text-white font-medium">{selectedEquipment?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="text-white font-medium">{format(new Date(selectedDate), 'EEEE, MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time</span>
              <span className="text-white font-medium">{selectedStart} – {selectedEnd}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className={selectedEquipment?.requiresFacultyApproval ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                {selectedEquipment?.requiresFacultyApproval ? 'Pending Approval' : 'Approved'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Booking ID</span>
              <span className="text-cyan-400 font-mono text-xs">{newBookingId}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/reservations')} className="btn-primary">
              View My Reservations
            </button>
            <button onClick={() => { setSubmitted(false); setSelectedEquipment(null); setForm({ projectTitle: '', projectDescription: '', purpose: '', priority: 'medium', deadline: '' }); }}
              className="btn-secondary">
              New Booking
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Smart Booking" subtitle="Reserve laboratory equipment for your project">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Equipment select + calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment selection */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-black text-xs font-bold flex items-center justify-center">1</span>
              Select Equipment
            </h3>
            <select
              value={selectedEquipment?.id || ''}
              onChange={e => {
                const eq = allEquipment.find(eq => eq.id === e.target.value);
                setSelectedEquipment(eq || null);
              }}
              className="input-field"
            >
              <option value="" className="bg-navy-800">— Choose equipment —</option>
              {allEquipment.filter(e => e.status === 'available').map(eq => (
                <option key={eq.id} value={eq.id} className="bg-navy-800">
                  {eq.name} ({eq.department} · {eq.availableCount} available)
                </option>
              ))}
            </select>

            {selectedEquipment && (
              <div className="mt-4 p-4 rounded-xl bg-white/3 flex items-center gap-4">
                <img src={selectedEquipment.image} alt={selectedEquipment.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={e => (e.currentTarget.src = `https://placehold.co/64x64/0a1628/22d3ee?text=${selectedEquipment.name[0]}`)} />
                <div>
                  <div className="font-semibold text-white">{selectedEquipment.name}</div>
                  <div className="text-xs text-gray-500">{selectedEquipment.location}</div>
                  <div className="text-xs text-gray-500 mt-1">Max booking: {selectedEquipment.maxBookingHours}h · {selectedEquipment.availableCount} units available</div>
                  {selectedEquipment.requiresFacultyApproval && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-amber-400">
                      <AlertTriangle size={10} /> Requires faculty approval
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                Select Date
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentWeek(w => addDays(w, -7))}
                  className="p-1.5 glass rounded-lg hover:border-white/20 transition-all">
                  <ChevronLeft size={16} className="text-gray-400" />
                </button>
                <span className="text-sm text-gray-400 font-medium min-w-[120px] text-center">
                  {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d')}
                </span>
                <button onClick={() => setCurrentWeek(w => addDays(w, 7))}
                  className="p-1.5 glass rounded-lg hover:border-white/20 transition-all">
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isPast = day < new Date() && !isSameDay(day, new Date());
                const isSelected = dateStr === selectedDate;
                return (
                  <button
                    key={dateStr}
                    disabled={isPast}
                    onClick={() => setSelectedDate(dateStr)}
                    className={clsx(
                      'flex flex-col items-center py-3 rounded-xl transition-all',
                      isPast ? 'opacity-30 cursor-not-allowed' :
                      isSelected ? 'bg-gradient-to-b from-cyan-500 to-violet-500 text-white shadow-glow-cyan' :
                      'glass hover:border-cyan-500/30 text-gray-400 hover:text-white'
                    )}
                  >
                    <span className="text-xs font-medium">{format(day, 'EEE')}</span>
                    <span className="text-lg font-bold mt-1">{format(day, 'd')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time selection */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">3</span>
              Select Time Slot
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Start Time</label>
                <select value={selectedStart} onChange={e => setSelectedStart(e.target.value)} className="input-field">
                  {timeSlots.map(t => (
                    <option key={t} value={t} className="bg-navy-800"
                      disabled={selectedEquipment ? isSlotBooked(selectedDate, t) : false}>
                      {t} {selectedEquipment && isSlotBooked(selectedDate, t) ? '(booked)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">End Time</label>
                <select value={selectedEnd} onChange={e => setSelectedEnd(e.target.value)} className="input-field">
                  {timeSlots.filter(t => t > selectedStart).map(t => (
                    <option key={t} value={t} className="bg-navy-800">{t}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Visual time grid */}
            <div className="overflow-x-auto">
              <div className="flex gap-1.5 min-w-max">
                {timeSlots.map(t => {
                  const booked = selectedEquipment ? isSlotBooked(selectedDate, t) : false;
                  const inRange = t >= selectedStart && t < selectedEnd;
                  return (
                    <div key={t} className={clsx(
                      'flex flex-col items-center w-10',
                    )}>
                      <div className={clsx(
                        'w-10 h-8 rounded-md transition-all',
                        booked ? 'bg-red-500/40' :
                        inRange ? 'bg-cyan-500/40 border border-cyan-500/50' :
                        'bg-white/5'
                      )} />
                      <span className="text-xs text-gray-600 mt-1">{t.split(':')[0]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-500/40" /> Selected</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/40" /> Booked</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white/5" /> Available</span>
              </div>
            </div>
            {conflict && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={16} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-400">Time slot conflict detected! Please choose a different time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">4</span>
              Booking Details
            </h3>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Project Title *</label>
              <input required value={form.projectTitle}
                onChange={e => setForm(f => ({ ...f, projectTitle: e.target.value }))}
                placeholder="Your project name"
                className="input-field text-sm" />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Project Description *</label>
              <textarea required rows={3} value={form.projectDescription}
                onChange={e => setForm(f => ({ ...f, projectDescription: e.target.value }))}
                placeholder="Brief description of your project..."
                className="input-field text-sm resize-none" />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Purpose *</label>
              <input required value={form.purpose}
                onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                placeholder="e.g. Circuit testing, model training..."
                className="input-field text-sm" />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Priority</label>
              <select value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as Booking['priority'] }))}
                className="input-field text-sm">
                <option value="low" className="bg-navy-800">🟢 Low</option>
                <option value="medium" className="bg-navy-800">🔵 Medium</option>
                <option value="high" className="bg-navy-800">🟡 High</option>
                <option value="urgent" className="bg-navy-800">🔴 Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Project Deadline</label>
              <input type="date" value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="input-field text-sm" />
            </div>

            {/* Summary */}
            {selectedEquipment && selectedDate && (
              <div className="p-4 rounded-xl bg-white/3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Equipment</span>
                  <span className="text-white font-medium truncate ml-2">{selectedEquipment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">{format(new Date(selectedDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="text-white">{selectedStart} – {selectedEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Approval needed</span>
                  <span className={selectedEquipment.requiresFacultyApproval ? 'text-amber-400' : 'text-emerald-400'}>
                    {selectedEquipment.requiresFacultyApproval ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedEquipment || conflict || submitting || !selectedDate}
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all',
                (!selectedEquipment || conflict || !selectedDate)
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              )}
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                <><Calendar size={16} /> {selectedEquipment?.requiresFacultyApproval ? 'Submit for Approval' : 'Confirm Booking'}</>
              )}
            </button>
          </form>

          {/* Legend */}
          <div className="glass rounded-xl p-4 text-xs text-gray-500 space-y-2">
            <p className="text-white font-medium text-sm mb-1">Booking Guidelines</p>
            <p>• Arrive 5 minutes before your slot</p>
            <p>• Cancel 2+ hours in advance if unable to attend</p>
            <p>• Maximum {selectedEquipment?.maxBookingHours || 8} hours per booking</p>
            <p>• Faculty-approval equipment takes 1-2 hours to review</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
