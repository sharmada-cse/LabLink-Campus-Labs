import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Mail, Lock, Eye, EyeOff, AlertCircle, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { users } from '../data/mockData';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const success = login(email);
    if (success) {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'faculty') navigate('/faculty');
      else navigate('/dashboard');
    } else {
      setError('No account found with this email. Try a demo account below.');
    }
    setLoading(false);
  };

  const demoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-6">
      {/* Glow orbs */}
      <div className="glow-orb w-96 h-96 bg-cyan-400 top-0 left-0 opacity-15" />
      <div className="glow-orb w-80 h-80 bg-violet-500 bottom-0 right-0 opacity-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-glow-cyan mb-4">
            <FlaskConical size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Welcome back</h1>
          <p className="text-gray-400 mt-1 text-sm">Sign in to access your lab resources</p>
        </div>

        {/* Demo notice */}
        <div className="glass rounded-xl p-4 border border-amber-500/20 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-amber-400 font-medium mb-1">Demo Mode</p>
              <p className="text-xs text-gray-500">
                This is a demonstration. Any password works. Use demo accounts below for quick access.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@college.edu"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Any password (demo mode)"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                'Sign In to LabLink'
              )}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={12} /> Demo Accounts</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Student', email: 'arjun@lablink.edu', color: 'from-cyan-500 to-blue-500' },
              { label: 'Faculty', email: 'priya@lablink.edu', color: 'from-violet-500 to-purple-500' },
              { label: 'Admin', email: 'admin@lablink.edu', color: 'from-amber-500 to-orange-500' },
            ].map(d => (
              <button key={d.label} onClick={() => demoLogin(d.email)}
                className={`glass rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all text-center group`}>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center mx-auto mb-1.5`}>
                  <span className="text-white text-xs font-bold">{d.label[0]}</span>
                </div>
                <div className="text-xs font-medium text-white">{d.label}</div>
                <div className="text-xs text-gray-500 truncate">{d.email.split('@')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
