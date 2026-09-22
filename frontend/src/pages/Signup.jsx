import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AshokaEmblem from '../components/common/AshokaEmblem';
import { User, Smartphone, Lock, MapPin, CheckCircle2, Shield, Eye, EyeOff, KeyRound } from 'lucide-react';

const STATES = [
  'Uttar Pradesh',
  'Bihar',
  'Madhya Pradesh',
  'Kerala',
  'Tamil Nadu',
  'Jharkhand'
];

export const Signup = () => {
  const { t, i18n } = useTranslation();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    role: 'FARMER',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    village: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.mobile.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.role === 'ADMIN' && !formData.adminCode) {
      setError('Admin Secret Code is required for Mandi Officer registration.');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      const data = await signup(payload);
      if (data.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/farmer/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#EFF6EE] via-white to-[#FFF8E1]">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-[0_20px_60px_-20px_rgba(27,94,32,0.18)] border border-[#E3EDE2] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#143614] via-[#1b5e20] to-[#2a7a2e] text-white px-8 py-7 flex gap-4 items-center">
          <div className="bg-white/15 backdrop-blur p-3 rounded-2xl hidden sm:flex">
            <AshokaEmblem className="h-10 w-auto" />
          </div>
          <div>
            <h1 className="text-[11px] font-bold tracking-[0.18em] text-amber-200 uppercase">KisanMitra • Government of India</h1>
            <h2 className="text-xl font-extrabold font-outfit mt-1">
              {i18n.language === 'hi' ? 'नया खाता बनाएं' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1">
              {formData.role === 'ADMIN' ? 'Mandi Officer Registration – Authorized Access Only' : 'Farmer Registration – DBT & Token Services'}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700 font-medium flex items-start gap-2">
              <span className="mt-0.5">⚠️</span> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-[12px]">
            {/* Role Toggle */}
            <div className="bg-[#F5F9F5] p-1.5 rounded-2xl flex gap-1.5 border border-[#E0EADF]">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'FARMER' })}
                className={`flex-1 py-2.5 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all ${formData.role === 'FARMER' ? 'bg-white text-[#1b5e20] shadow-sm border border-[#C8E6C9]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <span>🌾</span> {i18n.language === 'hi' ? 'किसान' : 'Farmer'}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                className={`flex-1 py-2.5 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all ${formData.role === 'ADMIN' ? 'bg-[#0d2a6f] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Shield className="w-3.5 h-3.5" /> {i18n.language === 'hi' ? 'अधिकारी' : 'Mandi Officer'}
              </button>
            </div>

            {formData.role === 'ADMIN' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-amber-900 text-[11px]">Admin Secret Code Required</p>
                  <p className="text-[11px] text-amber-800/80">Demo code: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold border border-amber-300">KISANMITRA_ADMIN2026</code></p>
                  <input
                    type="text"
                    name="adminCode"
                    value={formData.adminCode}
                    onChange={handleChange}
                    placeholder="Enter admin secret code"
                    className="mt-2 w-full px-3 py-2.5 border border-amber-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input type="text" required name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Ramesh Kumar" className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Mobile *</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type="tel" required name="mobile" maxLength={10} value={formData.mobile} onChange={handleChange} placeholder="9811223344" className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Email <span className="font-normal text-slate-400">(optional)</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ramesh@gmail.com" className="w-full px-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">State *</label>
                <select name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none">
                  {STATES.map((st) => (<option key={st} value={st}>{st}</option>))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">District *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type="text" required name="district" value={formData.district} onChange={handleChange} placeholder="Lucknow / Patna" className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Village / Ward</label>
              <input type="text" name="village" value={formData.village} onChange={handleChange} placeholder="e.g. Malihabad" className="w-full px-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type={showPass ? 'text' : 'password'} required name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Confirm Password *</label>
                <input type={showPass ? 'text' : 'password'} required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" className="w-full px-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#1b5e20] to-[#2E7D32] hover:from-[#144517] hover:to-[#1b5e20] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-[0_8px_20px_rgba(27,94,32,0.3)] transition-all flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : (formData.role === 'ADMIN' ? 'Register as Mandi Officer' : 'Create Farmer Account')}</span>
            </button>

            <p className="text-[11px] text-center text-slate-500">By registering, you agree to our Terms & Privacy Policy. Aadhaar-linked DBT enabled.</p>
          </form>

          <div className="text-center pt-4 text-xs text-slate-600 border-t border-slate-100 mt-6">
            Already have an account? <Link to="/login" className="font-bold text-[#1b5e20] hover:underline">Login Here →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
