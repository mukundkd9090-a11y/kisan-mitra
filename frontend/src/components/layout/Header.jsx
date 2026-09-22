import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import AshokaEmblem from '../common/AshokaEmblem';
import { Globe, Bell, LogOut, Menu, X, Shield, Sparkles, Tractor, Leaf } from 'lucide-react';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, demoLogin } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('kisanmitra_lang', nextLang);
  };

  const handleDemo = async (role) => {
    await demoLogin(role);
    if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    else navigate('/farmer/dashboard', { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#DDE8DB] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      {/* Tricolor */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Ministry bar */}
      <div className="bg-[#F4F8F3] border-b border-[#E4EFE3] px-4 py-[6px] text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 font-extrabold text-[#1A4D1E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] animate-pulse" />
              {i18n.language === 'hi' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
            </span>
            <span className="hidden lg:inline text-slate-500">|</span>
            <span className="hidden lg:inline text-slate-600 font-medium truncate">
              {i18n.language === 'hi' ? 'किसानमित्र - डिजिटल मंडी प्रणाली' : 'KisanMitra • Digital Mandi Ecosystem'}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#1B5E20] font-bold text-[11px]">
              <Leaf className="w-3 h-3" /> {t('sih_badge')}
            </span>
            <button onClick={toggleLanguage} className="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full bg-white border border-[#C8E6C9] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition-colors">
              <Globe className="w-3.5 h-3.5" />
              {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="bg-[#F1F8F1] p-2 rounded-xl border border-[#E0EADF] group-hover:shadow-sm transition">
            <AshokaEmblem className="h-9 w-auto" />
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] font-black tracking-tight text-[#1B5E20] font-outfit">KisanMitra</span>
              <span className="hidden sm:inline text-[10px] font-black tracking-widest text-white bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-1.5 py-0.5 rounded">OFFICIAL</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">{t('app_tagline')}</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1.5">
          <Link to="/" className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-[#F4F8F3] hover:text-[#1B5E20] transition">Home</Link>
          {user?.role === 'FARMER' && <Link to="/farmer/dashboard" className="px-3 py-2 rounded-xl text-sm font-bold bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] flex items-center gap-1.5"><Tractor className="w-4 h-4" /> {t('nav.farmer_portal')}</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin/dashboard" className="px-3 py-2 rounded-xl text-sm font-bold bg-[#EFF6FF] text-[#1E3A8A] border border-[#DBEAFE] flex items-center gap-1.5"><Shield className="w-4 h-4" /> {t('nav.admin_portal')}</Link>}
          <Link to="/about" className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-[#F4F8F3] transition">{t('nav.about')}</Link>
          <Link to="/contact" className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-[#F4F8F3] transition">{t('nav.contact')}</Link>
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/notifications" className="relative p-2.5 rounded-xl bg-[#F4F8F3] text-slate-600 hover:text-[#1B5E20] border border-[#E4EFE3] transition">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{unreadCount}</span>}
              </Link>
              <div className="flex items-center gap-3 pl-3 ml-1 border-l border-slate-200">
                <div className="hidden md:block text-right leading-tight">
                  <div className="text-xs font-extrabold text-slate-900 truncate max-w-[140px]">{user.fullName}</div>
                  <div className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wide">{user.role === 'ADMIN' ? 'Mandi Officer' : user.district || user.state}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B5E20] to-[#388E3C] text-white flex items-center justify-center font-black text-xs">
                  {user.fullName?.charAt(0) || 'K'}
                </div>
                <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition" title="Logout"><LogOut className="w-4 h-4" /></button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition">Login</Link>
              <Link to="/signup" className="px-5 py-2.5 rounded-xl text-sm font-extrabold bg-[#1B5E20] text-white hover:bg-[#144517] shadow-[0_6px_16px_rgba(27,94,32,0.25)] transition">Register</Link>
              <div className="hidden xl:flex items-center gap-1.5 pl-3 ml-1 border-l border-slate-200">
                <button onClick={() => handleDemo('farmer')} className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-600" /> Demo Farmer</button>
                <button onClick={() => handleDemo('admin')} className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-xs flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-600" /> Demo Officer</button>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E4EFE3] bg-white px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-center rounded-xl bg-slate-100 font-bold text-sm">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-center rounded-xl bg-slate-100 font-bold text-sm">About</Link>
          </div>
          {user?.role === 'FARMER' && <Link to="/farmer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-center rounded-xl bg-[#E8F5E9] text-[#1B5E20] font-bold border border-[#C8E6C9]">🌾 Farmer Dashboard</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-center rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-200">🛡️ Admin Dashboard</Link>}
          {!user ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 text-center rounded-xl bg-slate-900 text-white font-bold">Login</Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="py-3 text-center rounded-xl bg-[#1B5E20] text-white font-bold">Register</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setMobileMenuOpen(false); handleDemo('farmer'); }} className="py-2.5 rounded-xl bg-amber-50 border border-amber-200 font-bold text-xs">🌾 Demo Farmer</button>
                <button onClick={() => { setMobileMenuOpen(false); handleDemo('admin'); }} className="py-2.5 rounded-xl bg-blue-50 border border-blue-200 font-bold text-xs">🛡️ Demo Officer</button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border">
              <span className="text-xs font-bold">{user.fullName} • {user.role}</span>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold">Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
