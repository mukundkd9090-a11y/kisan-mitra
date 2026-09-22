import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AshokaEmblem from '../components/common/AshokaEmblem';
import api from '../api/client';
import {
  Tractor,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Sparkles,
  Smartphone,
  Radio,
  FileCheck,
  ChevronRight,
  ExternalLink,
  Users,
  Building2
} from 'lucide-react';

const STATE_MANDIS = [
  { state: 'Uttar Pradesh', capital: 'Lucknow', centre: 'Mohan Road Krishi Mandi', capacity: 200, inQueue: 18, waitMins: 25, status: 'Normal' },
  { state: 'Bihar', capital: 'Patna', centre: 'Mithapur Krishi Utpadan Samiti', capacity: 160, inQueue: 14, waitMins: 30, status: 'Normal' },
  { state: 'Madhya Pradesh', capital: 'Bhopal', centre: 'Karond Krishi Upaj Mandi', capacity: 250, inQueue: 28, waitMins: 45, status: 'Moderate Rush' },
  { state: 'Kerala', capital: 'Palakkad', centre: 'Palakkad Paddy Procurement Depot', capacity: 140, inQueue: 9, waitMins: 15, status: 'Smooth Flow' },
  { state: 'Tamil Nadu', capital: 'Thanjavur', centre: 'Delta Direct Purchase Centre', capacity: 190, inQueue: 12, waitMins: 20, status: 'Smooth Flow' },
  { state: 'Jharkhand', capital: 'Ranchi', centre: 'Pandra Bazaar Samiti Yard', capacity: 130, inQueue: 11, waitMins: 22, status: 'Smooth Flow' }
];

export const Home = () => {
  const { t, i18n } = useTranslation();
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [selectedStateIndex, setSelectedStateIndex] = useState(0);

  // Parallax scroll controls for Hero & Tractor section — medium speed: reaches CENTER by middle of section
  const { scrollYProgress } = useScroll();
  const tractorX = useTransform(scrollYProgress, [0.18, 0.33], ['0%', '46%']);
  const flagWave = useTransform(scrollYProgress, [0.18, 0.33], [0, 15]);

  const handleDemo = async (role) => {
    await demoLogin(role);
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/farmer/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ========================================================================= */}
      {/* SECTION 1: FULL SCREEN HERO WITH LUSH GREEN FARMLAND & ANIMATED FARMER    */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#144517] via-[#1b5e20] to-[#2E7D32] text-white">
        {/* Animated Background Vector Farm & Sky */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full object-cover" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
            {/* Mountain / Hills Horizon */}
            <path d="M0 450 C320 380, 580 490, 880 420 C1180 350, 1340 430, 1440 410 L1440 800 L0 800 Z" fill="#0d3010" opacity="0.6" />
            <path d="M0 500 C420 440, 780 540, 1140 480 C1300 450, 1380 490, 1440 480 L1440 800 L0 800 Z" fill="#184b1b" opacity="0.8" />
            
            {/* Green Farmland Terraces */}
            <path d="M0 560 C360 520, 720 600, 1080 540 C1280 510, 1380 550, 1440 540 L1440 800 L0 800 Z" fill="#246828" />
            
            {/* Wind and Crop Stalk Ripples */}
            <g opacity="0.4" stroke="#A5D6A7" strokeWidth="1.5" strokeLinecap="round">
              <path d="M120 680 C130 650, 140 640, 150 630" className="animate-sway" />
              <path d="M220 700 C230 670, 240 650, 250 640" className="animate-sway" />
              <path d="M420 690 C430 660, 440 640, 450 630" className="animate-sway" />
              <path d="M720 710 C730 680, 740 660, 750 650" className="animate-sway" />
              <path d="M980 695 C990 665, 1000 645, 1010 635" className="animate-sway" />
              <path d="M1220 710 C1230 680, 1240 660, 1250 650" className="animate-sway" />
            </g>
          </svg>
        </div>

        {/* Floating Sun Rays / Ambient Aura */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Main Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text Column */}
          <div className="max-w-2xl space-y-6">
            {/* Government Badges */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-gov-saffron animate-ping" />
              <span>Digital Agriculture Initiative</span>
              <span className="text-white/40">•</span>
              <span className="text-amber-300 font-bold"> Solution</span>
            </div>

            {/* Main Headline (English & Hindi) */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-outfit text-white">
                {t('hero.title_main')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-gov-saffron block mt-1">
                  {t('hero.title_highlight')}
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-emerald-100/90 font-hindi">
                {i18n.language === 'en'
                  ? '“अपनी प्रोक्योरमेंट क्यू और समय की जानकारी, घर बैठे पाएं”'
                  : '“Know Your Procurement Queue Before You Go”'}
              </p>
            </div>

            {/* Description Subtitle */}
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-xl">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start items-center gap-4">
              <Link
                to={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/farmer/dashboard') : '/login'}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-gov-saffron to-amber-500 hover:from-amber-500 hover:to-gov-saffron text-slate-950 font-extrabold text-sm sm:text-base shadow-gov-lg hover:shadow-glow-saffron transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>{t('hero.cta_farmer')}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-emerald-300" />
                <span>{t('hero.cta_admin')}</span>
              </Link>
            </div>

            {/* 1-Click Evaluation Logins for SIH Judges */}
            <div className="pt-4 flex flex-wrap justify-center lg:justify-start items-center gap-2.5 text-xs text-emerald-200">
              <span className="font-semibold">{i18n.language === 'hi' ? 'त्वरित डेमो:' : 'Instant Demo:'}</span>
              <button
                onClick={() => handleDemo('farmer')}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 font-bold transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ramesh Kumar (UP Farmer)</span>
              </button>
              <button
                onClick={() => handleDemo('admin')}
                className="px-3 py-1.5 rounded-lg bg-blue-400/20 hover:bg-blue-400/30 text-blue-200 border border-blue-400/40 font-bold transition-all flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>Lucknow Mandi Officer</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Graphic: Indian Farmer Working in Lush Fields SVG */}
          <div className="relative w-full max-w-md lg:max-w-lg flex items-center justify-center">
            {/* Glowing Backdrop Circle */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-500/20 border-2 border-emerald-400/30 animate-pulse-subtle" />

            {/* Hero SVG Illustration */}
            <svg
              className="w-full h-auto max-h-[380px] drop-shadow-2xl z-10"
              viewBox="0 0 500 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Golden Wheat Fields Base */}
              <ellipse cx="250" cy="360" rx="200" ry="40" fill="#246828" />
              <ellipse cx="250" cy="350" rx="170" ry="30" fill="#2e7d32" />

              {/* Golden Wheat Stalks */}
              <g stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round">
                <path d="M80 350 Q90 280 110 250 M110 250 L105 240 M110 250 L118 242 M110 250 L112 230" />
                <path d="M130 360 Q140 270 160 230 M160 230 L155 220 M160 230 L168 222 M160 230 L162 210" />
                <path d="M370 360 Q360 270 340 230 M340 230 L345 220 M340 230 L332 222 M340 230 L338 210" />
                <path d="M420 350 Q410 280 390 250 M390 250 L395 240 M390 250 L382 242 M390 250 L388 230" />
              </g>

              {/* Indian Farmer Character (Male/Female working in field) */}
              <g transform="translate(180, 100)">
                {/* Farmer Turban / Pagdi */}
                <path d="M45 42 C40 25, 80 15, 95 35 C105 45, 100 60, 85 62 C65 65, 48 55, 45 42 Z" fill="#E65100" />
                <path d="M40 50 C50 42, 90 40, 100 52 C85 58, 55 58, 40 50 Z" fill="#FF9933" />
                
                {/* Face & Ear */}
                <circle cx="70" cy="70" r="22" fill="#D7A177" />
                <circle cx="48" cy="70" r="4" fill="#D7A177" />
                <circle cx="92" cy="70" r="4" fill="#D7A177" />
                {/* Friendly Smile & Eyes */}
                <circle cx="63" cy="67" r="2" fill="#2E1C0C" />
                <circle cx="77" cy="67" r="2" fill="#2E1C0C" />
                <path d="M64 78 Q70 84 76 78" stroke="#2E1C0C" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M58 72 Q70 76 82 72" stroke="#2E1C0C" strokeWidth="2.5" fill="none" />

                {/* Kurta / Body */}
                <path d="M45 92 L25 180 L115 180 L95 92 Q70 98 45 92 Z" fill="#FFFFFF" />
                <path d="M60 94 L80 94 L75 140 L65 140 Z" fill="#E0E0E0" />
                
                {/* Vest / Nehru Jacket (Emerald Green) */}
                <path d="M45 92 L35 150 L60 150 L65 95 Z" fill="#1b5e20" />
                <path d="M95 92 L105 150 L80 150 L75 95 Z" fill="#1b5e20" />

                {/* Arms Holding Golden Harvested Wheat Bundle */}
                <path d="M35 110 Q10 140 30 165" stroke="#D7A177" strokeWidth="12" strokeLinecap="round" />
                <path d="M105 110 Q130 140 110 165" stroke="#D7A177" strokeWidth="12" strokeLinecap="round" />

                {/* Golden Wheat Sheaf in Hand */}
                <g stroke="#FFD54F" strokeWidth="3" strokeLinecap="round" fill="#FBC02D">
                  <path d="M40 160 Q70 140 100 160 Q70 180 40 160 Z" />
                  <line x1="70" y1="130" x2="70" y2="190" stroke="#F57F17" strokeWidth="2" />
                  <line x1="50" y1="140" x2="90" y2="180" stroke="#F57F17" strokeWidth="2" />
                  <line x1="90" y1="140" x2="50" y2="180" stroke="#F57F17" strokeWidth="2" />
                </g>
              </g>

              {/* Floating Token ETA Pill in Field */}
              <g transform="translate(20, 80)">
                <rect width="180" height="52" rx="16" fill="#FFFFFF" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.25))" />
                <circle cx="28" cy="26" r="14" fill="#E8F5E9" />
                <text x="28" y="31" textAnchor="middle" fontSize="14">🌾</text>
                <text x="50" y="22" fill="#1b5e20" fontSize="11" fontWeight="bold">TKN-UP-2026-00142</text>
                <text x="50" y="38" fill="#558B2F" fontSize="10" fontWeight="bold">ETA: 01:30 PM (Queue #3)</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-md border-t border-white/10 py-3.5 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg sm:text-xl font-black text-amber-300 font-outfit">1,24,000+</div>
              <div className="text-[11px] text-emerald-200 font-medium">{t('hero.stats_farmers')}</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-emerald-300 font-outfit">3.8 Hours</div>
              <div className="text-[11px] text-emerald-200 font-medium">{t('hero.stats_wait_saved')}</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-amber-300 font-outfit">1,500+ Mandis</div>
              <div className="text-[11px] text-emerald-200 font-medium">{t('hero.stats_mandis')}</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-emerald-300 font-outfit">₹482 Cr+ DBT</div>
              <div className="text-[11px] text-emerald-200 font-medium">{t('hero.stats_msp')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ANIMATED TRACTOR JOURNEY TO PROCUREMENT CENTRE (FRAMER MOTION) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-[#F9FBF7] to-[#EEF5EB] border-b border-gov-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-extrabold text-gov-emerald uppercase tracking-wider bg-gov-lightgreen px-3 py-1 rounded-full border border-gov-emerald/30">
              {i18n.language === 'hi' ? 'सहज व पारदर्शी यात्रा' : 'Seamless Transparent Flow'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">
              {t('tractor_journey.title')}
            </h2>
            <p className="text-base text-gov-emerald font-bold font-hindi">
              {t('tractor_journey.subtitle')}
            </p>
          </div>

          {/* Interactive Tractor Animation Canvas */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-gov border border-gov-border mb-12">
            <div className="relative h-44 sm:h-52 w-full bg-gradient-to-b from-sky-50 via-emerald-50 to-[#E0EFE0] rounded-2xl overflow-hidden border border-emerald-200 flex items-end px-4 sm:px-8">
              {/* Background Road & Mandi Gate */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-700 border-t-2 border-amber-400">
                <div className="w-full h-full flex items-center justify-around">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-8 h-1 bg-amber-400 rounded" />
                  ))}
                </div>
              </div>

              {/* Right Side: Government Mandi Centre with Indian Flag */}
              <div className="absolute right-4 sm:right-10 bottom-10 flex flex-col items-center">
                {/* Flying Indian Flag */}
                <div className="flex items-start">
                  <div className="w-1 h-16 bg-slate-800" />
                  <motion.div
                    animate={{ rotate: [0, 4, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-10 h-6 flex flex-col shadow-sm"
                  >
                    <div className="h-2 bg-[#FF9933]" />
                    <div className="h-2 bg-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full border border-[#0D47A1]" />
                    </div>
                    <div className="h-2 bg-[#138808]" />
                  </motion.div>
                </div>

                {/* Mandi Building Facade */}
                <div className="bg-[#1b5e20] text-white px-3 py-2 rounded-t-xl border-2 border-[#144517] text-center shadow-md">
                  <div className="text-[10px] font-extrabold text-amber-300">GOVT. MANDI</div>
                  <div className="text-[8px] text-emerald-200">PROCUREMENT CENTRE</div>
                </div>
              </div>

              {/* Animated Tractor Driving Towards Mandi (Framer Motion) */}
              <motion.div
                style={{ x: tractorX }}
                className="relative bottom-7 z-20 flex items-end"
              >
                {/* Tractor SVG */}
                <svg className="w-28 sm:w-36 h-auto drop-shadow-md" viewBox="0 0 160 100" fill="none">
                  {/* Farmer in Seat */}
                  <circle cx="85" cy="30" r="10" fill="#D7A177" />
                  <path d="M78 26 C75 18, 95 15, 96 25 Z" fill="#E65100" />
                  <path d="M78 40 L92 40 L95 60 L75 60 Z" fill="#1b5e20" />
                  <path d="M92 45 L108 48" stroke="#D7A177" strokeWidth="4" strokeLinecap="round" />
                  {/* Steering Wheel */}
                  <line x1="108" y1="42" x2="108" y2="54" stroke="#222" strokeWidth="3" />

                  {/* Tractor Body (Government Green) */}
                  <path d="M60 50 L115 50 L125 65 L135 65 L135 75 L60 75 Z" fill="#2E7D32" />
                  {/* Exhaust Pipe & Smoke Puff */}
                  <rect x="120" y="32" width="4" height="20" fill="#333" />
                  <circle cx="122" cy="26" r="3" fill="#B0BEC5" opacity="0.7" />

                  {/* Rear Big Wheel */}
                  <circle cx="65" cy="75" r="22" fill="#263238" />
                  <circle cx="65" cy="75" r="14" fill="#FFB300" />
                  <circle cx="65" cy="75" r="6" fill="#263238" />

                  {/* Front Small Wheel */}
                  <circle cx="130" cy="80" r="14" fill="#263238" />
                  <circle cx="130" cy="80" r="8" fill="#FFB300" />
                  <circle cx="130" cy="80" r="3" fill="#263238" />

                  {/* Attached Trolley Loaded with Harvest Produce */}
                  <rect x="5" y="48" width="48" height="26" rx="3" fill="#C62828" />
                  {/* Golden Grain Heaps */}
                  <path d="M5 48 Q28 28 53 48 Z" fill="#FBC02D" />
                  {/* Trolley Wheel */}
                  <circle cx="28" cy="78" r="15" fill="#263238" />
                  <circle cx="28" cy="78" r="8" fill="#E0E0E0" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* 4 Journey Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-gov transition-all border border-gov-border hover:border-gov-emerald group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                🎫
              </div>
              <h3 className="font-bold text-base text-slate-900 font-outfit mb-1">
                {t('tractor_journey.step1_title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('tractor_journey.step1_desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-gov transition-all border border-gov-border hover:border-gov-emerald group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                🚜
              </div>
              <h3 className="font-bold text-base text-slate-900 font-outfit mb-1">
                {t('tractor_journey.step2_title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('tractor_journey.step2_desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-gov transition-all border border-gov-border hover:border-gov-emerald group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                🔬
              </div>
              <h3 className="font-bold text-base text-slate-900 font-outfit mb-1">
                {t('tractor_journey.step3_title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('tractor_journey.step3_desc')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-gov transition-all border border-gov-border hover:border-gov-emerald group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-gov-emerald flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="font-bold text-base text-slate-900 font-outfit mb-1">
                {t('tractor_journey.step4_title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('tractor_journey.step4_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: LIVE STATE MANDI PROCUREMENT RADAR                             */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-b border-gov-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-gov-emerald uppercase tracking-wider">
                {i18n.language === 'hi' ? 'वास्तविक समय निगरानी' : 'Real-Time State Telemetry'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit mt-1">
                {t('mandi_radar.title')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t('mandi_radar.subtitle')}
              </p>
            </div>

            {/* State Switcher Pills */}
            <div className="flex flex-wrap gap-1.5">
              {STATE_MANDIS.map((m, idx) => (
                <button
                  key={m.state}
                  onClick={() => setSelectedStateIndex(idx)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    selectedStateIndex === idx
                      ? 'bg-gov-emerald text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {m.state}
                </button>
              ))}
            </div>
          </div>

          {/* Active Mandi Showcase Card */}
          {STATE_MANDIS[selectedStateIndex] && (
            <div className="bg-gradient-to-r from-[#F4F9F2] to-white rounded-3xl p-6 sm:p-8 border border-gov-border shadow-gov grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="space-y-3 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="bg-gov-emerald text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    {STATE_MANDIS[selectedStateIndex].state}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    District: {STATE_MANDIS[selectedStateIndex].capital}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit">
                  {STATE_MANDIS[selectedStateIndex].centre}
                </h3>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">
                      {t('mandi_radar.active_queue')}
                    </span>
                    <span className="text-2xl font-black text-gov-emerald">
                      {STATE_MANDIS[selectedStateIndex].inQueue}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Tractors waiting</span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">
                      {t('mandi_radar.daily_capacity')}
                    </span>
                    <span className="text-2xl font-black text-slate-800">
                      {STATE_MANDIS[selectedStateIndex].capacity}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Slots per day</span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">
                      {t('mandi_radar.avg_wait')}
                    </span>
                    <span className="text-2xl font-black text-amber-600">
                      {STATE_MANDIS[selectedStateIndex].waitMins}m
                    </span>
                    <span className="text-[10px] text-slate-400 block">Avg. turnaround</span>
                  </div>
                </div>
              </div>

              {/* Quick Book CTA for selected centre */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-center space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Predictive Slot Allotment Ready</span>
                </div>
                <p className="text-xs text-slate-600">
                  Book directly for {STATE_MANDIS[selectedStateIndex].centre} and receive guaranteed gate entry.
                </p>
                <Link
                  to="/login"
                  className="w-full text-center py-3 bg-gov-emerald hover:bg-gov-green text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  {t('mandi_radar.book_now')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4:  PROBLEM STATEMENT & SOLUTION PILLARS                  */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#F8FAF6] border-b border-gov-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-gov-emerald uppercase tracking-wider">
              Digital Agriculture Initiative Focus
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
              Solving Problem Statement 
            </h2>
            <p className="text-xs text-slate-600">
              "Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: AI Waiting Time & ETA Engine */}
            <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-gov-emerald flex items-center justify-center font-bold">
                🧠
              </div>
              <h3 className="font-bold text-base text-slate-900 font-outfit">
                AI Time-Series Queue Forecasting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                FastAPI Python microservice predicts waiting times per crop density, lab moisture testing duration, and real-time counter throughput.
              </p>
            </div>

            {/* Feature 2: Low Network / 2G Offline SMS Gateway */}
            <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                📶
              </div>
              <h3 className="font-bold text-base text-slate-900 font-outfit">
                Zero-Internet SMS & WhatsApp Gateway
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enables remote farmers to check queue status by texting <span className="font-mono font-bold">KISAN &lt;Token&gt; to 166066</span> without internet connectivity.
              </p>
            </div>

            {/* Feature 3: Immutable Audit Transparency */}
            <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                ⚖️
              </div>
              <h3 className="font-bold text-base text-slate-900 font-outfit">
                Fair Queueing & Audit Ledger
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory justification required for any priority override, immutably recorded with operator timestamps for anti-corruption vigilance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
