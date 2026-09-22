import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AshokaEmblem from '../common/AshokaEmblem';
import { PhoneCall, Mail, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="mt-auto bg-[#1A331E] text-slate-200 border-t-4 border-gov-emerald">
      {/* Top Banner: Toll-Free Helpline */}
      <div className="bg-[#122415] py-3 px-4 border-b border-[#254A2B]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-gov-saffron animate-bounce" />
            <span className="font-bold text-gov-saffron">{t('footer.helpline')}</span>
            <span className="text-xs text-slate-400 hidden sm:inline">(24x7 All-India Toll-Free Farmer Support)</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              support@kisanmitra.gov.in
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-amber-300 font-medium">
              National Informatics Centre (NIC) Node
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Government Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <AshokaEmblem className="h-12 w-auto" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white font-outfit">
                  {t('app_name')}
                </h3>
                <p className="text-xs text-emerald-300 font-medium">
                  {i18n.language === 'hi' ? 'डिजिटल कृषि पहल' : 'Digital Agriculture Initiative'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('app_tagline')}. Built to eliminate procurement queue friction and deliver real-time transparency for Indian farmers across mandis.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/60 border border-emerald-600/40 text-[11px] text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span> Verified Prototype</span>
            </div>
          </div>

          {/* Column 2: Quick Portal Links */}
          <div>
            <h4 className="font-bold text-sm text-gov-saffron uppercase tracking-wider mb-3">
              {i18n.language === 'hi' ? 'महत्वपूर्ण लिंक' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-300 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/farmer/dashboard" className="hover:text-emerald-300 transition-colors">
                  {t('nav.farmer_portal')}
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-emerald-300 transition-colors">
                  {t('nav.admin_portal')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-300 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-300 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: National Portals Integration */}
          <div>
            <h4 className="font-bold text-sm text-gov-saffron uppercase tracking-wider mb-3">
              {i18n.language === 'hi' ? 'राष्ट्रीय डिजिटल पोर्टल' : 'National Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://enam.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>National Agriculture Market (e-NAM)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://fci.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>Food Corporation of India (FCI)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://dbtbharat.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>DBT Bharat Direct Transfer</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Supported States & SIH Info */}
          <div>
            <h4 className="font-bold text-sm text-gov-saffron uppercase tracking-wider mb-3">
              {i18n.language === 'hi' ? 'सक्रिय राज्य नेटवर्क' : 'Active State Network'}
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Kerala', 'Tamil Nadu', 'Jharkhand'].map((st) => (
                <span
                  key={st}
                  className="bg-[#244729] text-emerald-200 px-2 py-0.5 rounded border border-[#325d39]"
                >
                  {st}
                </span>
              ))}
            </div>
            <div className="mt-4 p-2.5 rounded bg-[#132717] border border-[#2b5231] text-[11px] text-slate-300">
              <span className="font-bold text-emerald-400">Problem Statement :</span>
              <p className="mt-0.5 text-slate-400 italic">
                "Eliminating farmer waiting times and lack of procurement transparency."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#2a4d2f] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-200">
              {t('footer.links.privacy')}
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-200">
              {t('footer.links.terms')}
            </Link>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> for Indian Farmers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
