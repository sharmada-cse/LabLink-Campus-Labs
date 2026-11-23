import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FlaskConical, Zap, Brain, ChevronRight, Star, ArrowRight,
  Cpu, Wifi, Box, Monitor, Wrench, Network, Play, Shield, Clock, Users
} from 'lucide-react';
import { departments, equipment, platformStats } from '../data/mockData';
import { useApp } from '../context/AppContext';

const floatingCards = [
  { icon: Cpu, label: 'Arduino Kits', count: '20 units', color: 'from-blue-500 to-cyan-500', delay: '0s' },
  { icon: Monitor, label: 'GPU Workstations', count: '4 units', color: 'from-violet-500 to-purple-600', delay: '1.5s' },
  { icon: Box, label: '3D Printers', count: '5 units', color: 'from-pink-500 to-rose-500', delay: '0.8s' },
  { icon: Wifi, label: 'IoT Kits', count: '25 units', color: 'from-cyan-500 to-teal-500', delay: '2s' },
];

const steps = [
  {
    step: '01',
    title: 'Discover Equipment',
    desc: 'Browse 800+ specialised lab instruments, kits and workstations across all departments.',
    icon: FlaskConical,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    step: '02',
    title: 'SmartLab AI Match',
    desc: 'Our AI analyses your project and recommends the perfect equipment with optimal time slots.',
    icon: Brain,
    color: 'from-violet-500 to-purple-500',
  },
  {
    step: '03',
    title: 'Book & Get Approved',
    desc: 'Request your slot, get faculty approval, and walk into the lab ready to build.',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
  },
];

export default function LandingPage() {
  const { isAuthenticated, currentUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(currentUser.role === 'admin' ? '/admin' : currentUser.role === 'faculty' ? '/faculty' : '/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen mesh-bg text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 backdrop-blur-xl"
        style={{ background: 'rgba(2, 8, 24, 0.85)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-glow-cyan">
              <FlaskConical size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-white">LabLink</span>
              <span className="ml-2 text-xs text-cyan-400 font-medium hidden sm:inline">BETA</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Equipment', 'Departments', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <button onClick={handleGetStarted}
              className="btn-primary text-sm py-2 px-5">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Glow orbs */}
        <div className="glow-orb w-96 h-96 bg-cyan-400 top-20 -left-20 opacity-20" />
        <div className="glow-orb w-96 h-96 bg-violet-500 top-10 right-0 opacity-15" />
        <div className="glow-orb w-64 h-64 bg-cyan-300 bottom-0 right-1/3 opacity-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 glass border border-cyan-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-400 font-medium">GenAI-Powered Campus Lab Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
              Your Campus.<br />
              <span className="gradient-text">Your Resources.</span><br />
              Unlimited Possibilities.
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
              One intelligent platform to discover, access and share laboratory resources across your campus.
              AI-powered scheduling. Zero conflicts.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button onClick={() => navigate('/equipment')}
                className="btn-primary flex items-center gap-2 text-base">
                <FlaskConical size={18} />
                Explore Equipment
              </button>
              <button onClick={() => navigate(isAuthenticated ? '/smartlab' : '/login')}
                className="btn-secondary flex items-center gap-2 text-base">
                <Brain size={18} />
                SmartLab AI
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {[
                { label: 'Equipment Items', value: platformStats.totalEquipment.toLocaleString() + '+' },
                { label: 'Active Students', value: platformStats.activeStudents.toLocaleString() + '+' },
                { label: 'Departments', value: platformStats.departments + '' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-black gradient-text">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated cards */}
          <div className="relative hidden lg:flex items-center justify-center h-[480px]">
            {/* Central orb */}
            <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 flex items-center justify-center animate-pulse-glow">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-violet-500/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-glow-cyan">
                  <Brain size={36} className="text-white" />
                </div>
              </div>
            </div>

            {/* Floating cards */}
            {floatingCards.map((card, i) => {
              const positions = [
                'top-8 left-0',
                'bottom-16 left-4',
                'top-16 right-0',
                'bottom-8 right-8',
              ];
              return (
                <div key={card.label}
                  className={`absolute ${positions[i]} glass rounded-2xl p-4 border border-white/10 shadow-glass animate-float`}
                  style={{ animationDelay: card.delay, animationDuration: `${5 + i}s` }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-2`}>
                    <card.icon size={18} className="text-white" />
                  </div>
                  <div className="text-xs font-semibold text-white whitespace-nowrap">{card.label}</div>
                  <div className="text-xs text-cyan-400">{card.count} available</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <section className="py-10 border-y border-white/8 bg-white/2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Equipment', value: `${platformStats.totalEquipment}+`, icon: FlaskConical, color: 'text-cyan-400' },
              { label: 'Monthly Bookings', value: platformStats.bookingsThisMonth.toString(), icon: Clock, color: 'text-violet-400' },
              { label: 'Avg Approval Time', value: platformStats.avgApprovalTime, icon: Zap, color: 'text-amber-400' },
              { label: 'Utilisation Rate', value: `${platformStats.utilizationRate}%`, icon: Star, color: 'text-emerald-400' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center shrink-0">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass border border-violet-500/30 rounded-full px-4 py-1.5 mb-4">
              <Play size={12} className="text-violet-400" />
              <span className="text-xs text-violet-400 font-medium">How It Works</span>
            </div>
            <h2 className="text-4xl font-black mb-4">
              Three steps to your <span className="gradient-text">perfect lab session</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From project idea to lab access in minutes. Our AI handles the complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-cyan-500/30 to-transparent z-10" />
                )}
                <div className="glass rounded-2xl p-8 hover:border-cyan-500/20 transition-all duration-300 group">
                  <div className="text-6xl font-black text-white/5 mb-4 leading-none">{step.step}</div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:shadow-glow-cyan transition-all`}>
                    <step.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEPARTMENTS ─── */}
      <section id="departments" className="py-24 px-6 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Resources across <span className="gradient-text">every department</span>
            </h2>
            <p className="text-gray-400">Explore equipment from 6 engineering departments</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {departments.map(dept => (
              <div key={dept.id}
                className="glass rounded-2xl p-6 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate('/equipment')}>
                <div className="text-3xl mb-4">{dept.icon}</div>
                <div className="font-bold text-white mb-1">{dept.shortName}</div>
                <div className="text-xs text-gray-500 mb-3 leading-relaxed">{dept.name}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500"><span className="text-white font-semibold">{dept.equipmentCount}</span> items</span>
                  <span className="text-gray-500"><span className="text-white font-semibold">{dept.labCount}</span> labs</span>
                </div>
                <div className="mt-4 h-0.5 rounded-full" style={{ background: dept.color, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED EQUIPMENT ─── */}
      <section id="equipment" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black mb-2">
                Featured <span className="gradient-text">Equipment</span>
              </h2>
              <p className="text-gray-400">Most popular across campus this week</p>
            </div>
            <button onClick={() => navigate('/equipment')}
              className="btn-secondary flex items-center gap-2 text-sm">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {equipment.slice(0, 3).map(eq => (
              <div key={eq.id} className="glass rounded-2xl overflow-hidden hover:border-cyan-500/20 hover:shadow-glow-sm transition-all duration-300 group">
                <div className="h-40 overflow-hidden relative">
                  <img src={eq.image} alt={eq.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => (e.currentTarget.src = `https://placehold.co/400x300/0a1628/22d3ee?text=${eq.name.substring(0, 10)}`)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`badge ${eq.status === 'available' ? 'status-available' : 'status-booked'}`}>
                      {eq.availableCount > 0 ? `${eq.availableCount} Available` : 'Fully Booked'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="font-bold text-white mb-1">{eq.name}</div>
                  <div className="text-xs text-gray-500 mb-3">{eq.department} · {eq.lab}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-400">{eq.rating}</span>
                    </div>
                    <button onClick={() => navigate(isAuthenticated ? '/equipment' : '/login')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                      Book Now <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SMARTLAB AI PROMO ─── */}
      <section className="py-24 px-6 bg-white/2">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-violet-500/20 relative overflow-hidden">
            <div className="glow-orb w-80 h-80 bg-violet-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-glow-violet animate-pulse-glow">
                <Brain size={36} className="text-white" />
              </div>
              <h2 className="text-4xl font-black mb-4">
                Meet <span className="gradient-text">SmartLab AI</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Describe your project and let our AI find the perfect equipment, resolve scheduling conflicts,
                and book the optimal time slot — automatically.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['Deadline-aware scheduling', 'Conflict resolution', 'Alternative suggestions', 'Fair allocation'].map(f => (
                  <span key={f} className="glass rounded-full px-4 py-1.5 text-sm text-cyan-400 border border-cyan-500/20">
                    ✓ {f}
                  </span>
                ))}
              </div>
              <button onClick={() => navigate(isAuthenticated ? '/smartlab' : '/login')}
                className="btn-primary text-base flex items-center gap-2 mx-auto">
                <Brain size={20} /> Try SmartLab AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">
            Ready to <span className="gradient-text">Discover. Connect. Innovate.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join 1,247+ students already using LabLink to access cutting-edge laboratory resources.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your college email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field flex-1"
            />
            <button onClick={handleGetStarted}
              className="btn-primary flex items-center gap-2 whitespace-nowrap">
              Get Access <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/8 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
                  <FlaskConical size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">LabLink</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Making college laboratories more accessible through intelligent resource sharing.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Shield size={14} className="text-cyan-400" />
                <span className="text-xs text-gray-500">Secure · Private · Campus-first</span>
              </div>
            </div>
            {[
              { title: 'Platform', links: ['Equipment Catalog', 'SmartLab AI', 'Booking System', 'Dashboard'] },
              { title: 'Departments', links: ['CSE', 'ECE', 'Mechanical', 'Chemical', 'Biotechnology'] },
              { title: 'Support', links: ['Documentation', 'Help Center', 'Contact Admin', 'Report Issue'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© 2026 LabLink. Campus Innovation Platform. Built for Hackathon.</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
