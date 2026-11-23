import { useState } from 'react';
import { Brain, Sparkles, AlertCircle, CheckCircle, Clock, MapPin, ChevronRight, Loader2, Info } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useApp } from '../context/AppContext';
import { getSmartLabRecommendations } from '../services/aiService';
import type { SmartLabRequest, AIRecommendation } from '../types';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';

const departments = ['Any', 'CSE', 'ECE', 'MECH', 'CHEM', 'BIO', 'PHY'];

export default function SmartLabPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [isAI, setIsAI] = useState(false);
  const [summary, setSummary] = useState('');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const [form, setForm] = useState<SmartLabRequest>({
    projectTitle: '',
    projectDescription: '',
    requiredEquipment: [],
    preferredDepartment: currentUser.department,
    deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    requiredDuration: 4,
    priority: 'medium',
  });
  const [equipmentInput, setEquipmentInput] = useState('');

  const addEquipment = () => {
    const val = equipmentInput.trim();
    if (val && !form.requiredEquipment.includes(val)) {
      setForm(f => ({ ...f, requiredEquipment: [...f.requiredEquipment, val] }));
      setEquipmentInput('');
    }
  };

  const removeEquipment = (item: string) => {
    setForm(f => ({ ...f, requiredEquipment: f.requiredEquipment.filter(e => e !== item) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    try {
      const result = await getSmartLabRecommendations(form);
      setRecommendations(result.recommendations);
      setIsAI(result.isAI);
      setSummary(result.summary);
      setStep('results');
    } catch {
      setStep('form');
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-orange-400';
  };

  const scoreBar = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-teal-500';
    if (score >= 50) return 'from-amber-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  return (
    <DashboardLayout
      title="SmartLab AI"
      subtitle="AI-powered equipment recommendation and scheduling"
    >
      {/* Header badge */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-glow-violet animate-pulse-glow">
          <Brain size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">SmartLab Recommendation Engine</h2>
          <p className="text-sm text-gray-400">
            {isAI ? '🤖 Powered by Google Gemini AI' : '⚙️ Demo Rule-Based Engine — Connect Gemini API for full AI'}
          </p>
        </div>
        {!isAI && (
          <div className="ml-auto glass rounded-xl px-4 py-2 border border-amber-500/20 flex items-center gap-2">
            <Info size={14} className="text-amber-400" />
            <span className="text-xs text-amber-400">Demo Mode</span>
          </div>
        )}
      </div>

      {step === 'form' && (
        <div className="max-w-3xl">
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6">Describe Your Project</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={form.projectTitle}
                    onChange={e => setForm(f => ({ ...f, projectTitle: e.target.value }))}
                    placeholder="e.g. Smart Traffic Management using Computer Vision"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={form.projectDescription}
                    onChange={e => setForm(f => ({ ...f, projectDescription: e.target.value }))}
                    placeholder="Describe what you're building, the technology stack, and what experiments you need to run..."
                    className="input-field resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Required Equipment / Technology</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={equipmentInput}
                      onChange={e => setEquipmentInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                      placeholder="e.g. Raspberry Pi, oscilloscope... press Enter"
                      className="input-field flex-1"
                    />
                    <button type="button" onClick={addEquipment}
                      className="btn-secondary text-sm px-4">Add</button>
                  </div>
                  {form.requiredEquipment.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.requiredEquipment.map(item => (
                        <span key={item}
                          className="flex items-center gap-1.5 text-xs bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-full">
                          {item}
                          <button type="button" onClick={() => removeEquipment(item)}
                            className="hover:text-white text-cyan-300">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Preferred Department</label>
                  <select
                    value={form.preferredDepartment}
                    onChange={e => setForm(f => ({ ...f, preferredDepartment: e.target.value }))}
                    className="input-field"
                  >
                    {departments.map(d => <option key={d} value={d} className="bg-navy-800">{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Priority Level</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as SmartLabRequest['priority'] }))}
                    className="input-field"
                  >
                    <option value="low" className="bg-navy-800">🟢 Low</option>
                    <option value="medium" className="bg-navy-800">🔵 Medium</option>
                    <option value="high" className="bg-navy-800">🟡 High</option>
                    <option value="urgent" className="bg-navy-800">🔴 Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Deadline *</label>
                  <input
                    type="date"
                    required
                    value={form.deadline}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Required Duration: <span className="text-cyan-400">{form.requiredDuration} hours</span>
                  </label>
                  <input
                    type="range"
                    min={1} max={12} step={1}
                    value={form.requiredDuration}
                    onChange={e => setForm(f => ({ ...f, requiredDuration: parseInt(e.target.value) }))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>1h</span><span>6h</span><span>12h</span>
                  </div>
                </div>
              </div>

              <button type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
                <Sparkles size={18} />
                Get AI Recommendations
              </button>
            </form>
          </div>

          {/* Quick presets */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-3">Quick presets:</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: '🤖 ML Project', title: 'Deep Learning Image Classifier', desc: 'Training CNN model for image classification using PyTorch and GPU computing', equipment: ['GPU', 'Python', 'CUDA'] },
                { label: '📡 IoT Project', title: 'Smart Environmental Monitor', desc: 'IoT sensors for real-time air quality and temperature monitoring with cloud dashboard', equipment: ['Raspberry Pi', 'sensors', 'WiFi'] },
                { label: '🦾 Robotics', title: 'Autonomous Navigation Robot', desc: 'Programming a wheeled robot for obstacle avoidance using computer vision', equipment: ['Arduino', 'camera', 'servo motors'] },
              ].map(preset => (
                <button key={preset.label}
                  onClick={() => setForm(f => ({ ...f, projectTitle: preset.title, projectDescription: preset.desc, requiredEquipment: preset.equipment }))}
                  className="glass rounded-xl px-4 py-2.5 text-sm text-gray-300 border border-white/10 hover:border-cyan-500/30 hover:text-white transition-all">
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-500/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-violet-500/30 flex items-center justify-center">
                <Brain size={28} className="text-cyan-400" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-transparent animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analysing your project...</h3>
          <div className="text-gray-400 text-sm space-y-1 text-center">
            <p>🔍 Scanning 821 equipment items across all departments</p>
            <p>📅 Checking availability and scheduling conflicts</p>
            <p>⚡ Applying deadline priority algorithms</p>
            <p>🎯 Generating personalised recommendations</p>
          </div>
          <div className="mt-8 flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {step === 'results' && (
        <div>
          {/* Summary banner */}
          <div className="glass rounded-2xl p-5 border border-cyan-500/20 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
                <Brain size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">Recommendation Summary</span>
                  {!isAI && (
                    <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      ⚙️ Demo Engine
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{summary}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {recommendations.length} Recommendations Found
            </h3>
            <button onClick={() => { setStep('form'); setRecommendations([]); }}
              className="btn-secondary text-sm py-2 px-4">
              ← New Search
            </button>
          </div>

          <div className="space-y-6">
            {recommendations.map((rec, idx) => (
              <div key={rec.equipment.id} className="glass rounded-2xl p-6 border border-white/8 hover:border-cyan-500/20 transition-all">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Equipment info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative shrink-0">
                        <img
                          src={rec.equipment.image}
                          alt={rec.equipment.name}
                          className="w-20 h-20 rounded-xl object-cover"
                          onError={e => (e.currentTarget.src = `https://placehold.co/80x80/0a1628/22d3ee?text=${rec.equipment.name[0]}`)}
                        />
                        {idx === 0 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs">
                            ★
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {idx === 0 && (
                            <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">
                              🏆 Best Match
                            </span>
                          )}
                          <span className={`badge ${rec.equipment.status === 'available' ? 'status-available' : 'status-booked'}`}>
                            {rec.equipment.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-lg leading-tight">{rec.equipment.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><MapPin size={11} />{rec.equipment.location}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />Max {rec.equipment.maxBookingHours}h</span>
                        </div>
                      </div>
                      {/* Score */}
                      <div className="text-right shrink-0">
                        <div className={`text-3xl font-black ${scoreColor(rec.score)}`}>{rec.score}%</div>
                        <div className="text-xs text-gray-500">match score</div>
                        <div className="mt-2 w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${scoreBar(rec.score)} transition-all duration-700`}
                            style={{ width: `${rec.score}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Reasons */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 mb-2">Why this recommendation:</p>
                      <div className="space-y-1.5">
                        {rec.reasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="shrink-0">{r.split(' ')[0]}</span>
                            <span>{r.split(' ').slice(1).join(' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warnings */}
                    {rec.warnings && rec.warnings.length > 0 && (
                      <div className="space-y-1.5">
                        {rec.warnings.map((w, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2">
                            <AlertCircle size={12} className="shrink-0" />
                            {w}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Available slots */}
                  <div className="lg:w-72 shrink-0">
                    <p className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
                      <Clock size={12} className="text-cyan-400" /> Available Slots
                    </p>
                    <div className="space-y-2">
                      {rec.availableSlots.length === 0 ? (
                        <p className="text-xs text-gray-500">No slots available in next 7 days</p>
                      ) : rec.availableSlots.map((slot, si) => (
                        <button
                          key={si}
                          onClick={() => navigate('/booking', { state: { equipment: rec.equipment, slot } })}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-cyan-500/10 border border-white/8 hover:border-cyan-500/30 transition-all group"
                        >
                          <div className="text-left">
                            <div className="text-xs font-medium text-white">
                              {format(new Date(slot.date), 'EEE, MMM d')}
                            </div>
                            <div className="text-xs text-gray-500">{slot.startTime} – {slot.endTime}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-emerald-400">Available</span>
                            <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate('/booking', { state: { equipment: rec.equipment } })}
                      className="w-full mt-3 btn-primary text-sm py-2 flex items-center justify-center gap-1.5">
                      <CheckCircle size={14} /> Book This Equipment
                    </button>

                    {rec.alternatives && rec.alternatives.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1.5">Alternatives:</p>
                        {rec.alternatives.map(alt => (
                          <div key={alt.id}
                            onClick={() => navigate('/equipment')}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/3 cursor-pointer transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            <span className="text-xs text-gray-400 hover:text-white transition-colors">{alt.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recommendations.length === 0 && (
            <div className="glass rounded-2xl p-16 text-center">
              <Brain size={40} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No strong matches found</h3>
              <p className="text-gray-500 text-sm">Try broadening your project description or department preference.</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
