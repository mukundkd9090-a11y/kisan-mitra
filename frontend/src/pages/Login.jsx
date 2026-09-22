import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AshokaEmblem from '../components/common/AshokaEmblem';
import { Smartphone, Lock, LogIn, Sparkles, Shield, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { t, i18n } = useTranslation();
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) {
      setError('Please enter mobile/email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await login(identifier.trim(), password);
      if (data.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/farmer/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    try {
      const data = await demoLogin(role);
      if (data.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/farmer/dashboard', { replace: true });
      }
    } catch (err) {
      setError('Demo login failed. Please seed database: npm run db:seed');
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#EFF6EE] via-white to-[#FFF8E1]">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_20px_60px_-20px_rgba(27,94,32,0.18)] border border-[#E3EDE2] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#143614] via-[#1b5e20] to-[#2a7a2e] text-white px-8 py-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/15 backdrop-blur p-2.5 rounded-2xl">
              <AshokaEmblem className="h-10 w-auto" />
            </div>
          </div>
          <h1 className="text-[11px] font-bold tracking-[0.16em] text-amber-200 uppercase">KisanMitra • Government of India</h1>
          <h2 className="text-xl font-extrabold font-outfit mt-1">
            {i18n.language === 'hi' ? 'किसानमित्र पोर्टल लॉगिन' : 'Welcome Back to KisanMitra'}
          </h2>
          <p className="text-xs text-emerald-100/85 mt-1.5">Digital Procurement Token & Queue Intelligence</p>
        </div>

        <div className="p-7 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700 font-medium flex gap-2">
              <span>⚠️</span> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Mobile or Email *</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="9811223344 / admin@kisanmitra.gov.in" className="w-full text-sm pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Demo: 9811223344 / 9876543210  (pass: kisan123)</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">Password *</label>
                <button type="button" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered mobile via SMS.'); }} className="text-[11px] font-bold text-[#1b5e20] hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full text-sm pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-[#1b5e20] to-[#2E7D32] hover:from-[#144517] hover:to-[#1b5e20] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-[0_8px_20px_rgba(27,94,32,0.3)] transition-all flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing in...' : 'Sign In Securely'}</span>
            </button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Demo Access</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => handleDemo('farmer')} className="group p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 text-left transition-all hover:shadow-sm">
              <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs"><Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition" /> Farmer Demo</div>
              <div className="text-[11px] text-amber-800/80 mt-0.5">Ramesh Kumar</div>
              <div className="text-[10px] font-mono text-amber-700/60">UP • 9811223344</div>
            </button>
            <button type="button" onClick={() => handleDemo('admin')} className="group p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-left transition-all hover:shadow-sm">
              <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs"><Shield className="w-3.5 h-3.5 text-blue-600" /> Officer Demo</div>
              <div className="text-[11px] text-blue-800/80 mt-0.5">Vijay Sharma</div>
              <div className="text-[10px] font-mono text-blue-700/60">LKO • 9876543210</div>
            </button>
          </div>

          <div className="text-center text-xs text-slate-600 pt-2">
            No account yet? <Link to="/signup" className="font-extrabold text-[#1b5e20] hover:underline">Create Account →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
