import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, QrCode, ShieldCheck, ChevronRight, RotateCcw, AlertTriangle, Sparkles, Printer, Smartphone } from 'lucide-react';

export const TokenCard = ({ token, onOpenSmsModal, onOpenWhatsAppModal, onPrintToken }) => {
  const { t, i18n } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Calculate live countdown timer
  useEffect(() => {
    if (!token) return;

    const computeSeconds = () => {
      // If completed or rejected, no countdown
      if (['ACCEPTED', 'REJECTED', 'PAYMENT_PROCESSED'].includes(token.stage)) {
        setSecondsRemaining(0);
        return;
      }

      // Convert estimatedWaitMinutes into seconds or base on arrival window
      const waitSecs = (token.estimatedWaitMinutes || 25) * 60;
      setSecondsRemaining(Math.max(0, waitSecs));
    };

    computeSeconds;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  const formatCountdown = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n) => String(n).padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case 'GENERATED':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DOCS_VERIFIED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PRODUCE_RECEIVED':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'QUALITY_CHECKED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PAYMENT_PROCESSED':
        return 'bg-green-600 text-white border-green-700 shadow-sm';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const isCompleted = ['ACCEPTED', 'PAYMENT_PROCESSED'].includes(token.stage);
  const isRejected = token.stage === 'REJECTED';

  return (
    <div className="relative w-full max-w-lg mx-auto perspective-1000 my-4">
      {/* 3D Container */}
      <div
        className={`w-full transition-transform duration-700 transform-style-3d relative rounded-3xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= FRONT SIDE ================= */}
        <div className="w-full bg-white rounded-3xl shadow-gov-lg border-2 border-gov-emerald/30 overflow-hidden relative backface-hidden">
          {/* Top Tricolor Accent */}
          <div className="gov-tricolor-strip w-full" />

          {/* Card Header */}
          <div className="bg-gradient-to-r from-gov-darkgreen via-gov-emerald to-[#276E2A] text-white p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider">
                    {i18n.language === 'hi' ? 'डिजिटल प्रोक्योरमेंट पास' : 'Digital Mandi Token'}
                  </span>
                  {token.isPriority && (
                    <span className="text-[10px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded uppercase animate-pulse">
                      ⚡ {i18n.language === 'hi' ? 'प्राथमिकता टोकन' : 'Priority Queue'}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black font-mono tracking-wider text-amber-300 mt-1">
                  {token.tokenNumber}
                </h3>
              </div>

              <button
                onClick={() => setIsFlipped(true)}
                className="text-xs bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 rounded-lg border border-white/30 flex items-center gap-1 transition-colors"
                title="Flip to view QR & MSP Details"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{i18n.language === 'hi' ? 'विवरण' : 'Details'}</span>
              </button>
            </div>

            {/* Centre & Crop Info */}
            <div className="mt-3 flex items-center justify-between text-xs text-emerald-100 border-t border-white/15 pt-2.5">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{token.centre?.name || 'Mandi Centre'}</span>
              </div>
              <span className="font-bold bg-white/10 px-2 py-0.5 rounded text-white">
                🌾 {token.cropType} ({token.estimatedQuantity} Qtl)
              </span>
            </div>
          </div>

          {/* Main Card Body */}
          <div className="p-5 space-y-4">
            {/* Live Queue Radar Box */}
            <div className="grid grid-cols-2 gap-3 bg-[#F4F9F2] p-3.5 rounded-2xl border border-gov-border">
              {/* Queue Position */}
              <div className="text-center border-r border-slate-200 pr-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  {t('farmer.queue_position')}
                </span>
                <div className="text-3xl font-black text-gov-emerald mt-0.5">
                  #{token.queuePosition}
                </div>
                <span className="text-[10px] text-slate-600 font-medium">
                  {i18n.language === 'hi' ? 'आगे लगभग 2 किसान' : 'in line ahead of you'}
                </span>
              </div>

              {/* Live Countdown Timer */}
              <div className="text-center pl-2 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  {t('farmer.time_remaining')}
                </span>
                <div className="text-2xl font-black font-mono text-slate-800 tracking-tight mt-0.5">
                  {isCompleted ? (
                    <span className="text-emerald-600 text-lg">✅ Completed</span>
                  ) : isRejected ? (
                    <span className="text-red-600 text-lg">❌ Rejected</span>
                  ) : (
                    formatCountdown(secondsRemaining)
                  )}
                </div>
                <span className="text-[10px] text-slate-500">
                  {i18n.language === 'hi' ? 'लाइव सेकंड काउंटर' : 'Real-time live sync'}
                </span>
              </div>
            </div>

            {/* Arrival Window Slot */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                  {t('farmer.arrival_window')}
                </span>
                <div className="text-sm font-extrabold text-amber-950">
                  {token.arrivalWindowStart} – {token.arrivalWindowEnd}
                </div>
              </div>
              <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-1 rounded-md">
                {token.tokenDate}
              </span>
            </div>

            {/* Current Stage Status Badge */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-semibold text-slate-500">{t('farmer.status')}:</span>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStageBadgeColor(
                  token.stage
                )}`}
              >
                {t(`stages.${token.stage}`) || token.stage}
              </span>
            </div>

            {/* Quick Action Bar (SMS, WhatsApp, Print) */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 no-print">
              <button
                onClick={onOpenSmsModal}
                className="flex items-center justify-center gap-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl transition-colors"
                title="Check token status offline via SMS 166066"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>{i18n.language === 'hi' ? 'SMS जांच' : 'SMS Check'}</span>
              </button>

              <button
                onClick={onOpenWhatsAppModal}
                className="flex items-center justify-center gap-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-2 rounded-xl transition-colors"
                title="Preview WhatsApp notifications"
              >
                <span className="text-sm">💬</span>
                <span>WhatsApp</span>
              </button>

              <button
                onClick={onPrintToken}
                className="flex items-center justify-center gap-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 py-2 rounded-xl transition-colors"
                title="Print official gate pass"
              >
                <Printer className="w-3.5 h-3.5 text-amber-700" />
                <span>{i18n.language === 'hi' ? 'प्रिंट पास' : 'Print Pass'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE (Flip View) ================= */}
        <div className="w-full bg-slate-900 text-white rounded-3xl shadow-gov-lg border-2 border-amber-500/40 p-5 absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase">
                  {i18n.language === 'hi' ? 'प्रोक्योरमेंट एवं भुगतान विवरण' : 'Procurement & Payout Ledger'}
                </span>
                <h4 className="text-lg font-black font-mono text-white">{token.tokenNumber}</h4>
              </div>

              <button
                onClick={() => setIsFlipped(false)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{i18n.language === 'hi' ? 'वापस' : 'Back'}</span>
              </button>
            </div>

            {/* Breakdown Details */}
            <div className="mt-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">{i18n.language === 'hi' ? 'किसान का नाम' : 'Farmer Name'}:</span>
                <span className="font-bold text-white">{token.farmer?.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">{i18n.language === 'hi' ? 'MSP सरकारी दर' : 'MSP Rate 2026'}:</span>
                <span className="font-bold text-amber-400">₹{token.mspRate || 2425} / Qtl</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">{i18n.language === 'hi' ? 'नमी स्तर' : 'Moisture Test'}:</span>
                <span className="font-bold text-emerald-400">
                  {token.moisturePercent ? `${token.moisturePercent}% (Permissible <12%)` : 'Pending at Lab'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">{i18n.language === 'hi' ? 'गुणवत्ता ग्रेड' : 'Quality Grade'}:</span>
                <span className="font-bold text-white">{token.qualityGrade || 'Pending Inspection'}</span>
              </div>
              <div className="flex justify-between py-1.5 bg-slate-800/80 px-2.5 rounded-lg">
                <span className="text-slate-300 font-semibold">{i18n.language === 'hi' ? 'कुल अनुमानित DBT राशि' : 'Total Payout'}:</span>
                <span className="font-extrabold text-emerald-300 text-sm">
                  ₹{token.totalPayout ? Number(token.totalPayout).toLocaleString('en-IN') : 'Calculating'}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code & Barcode Visual */}
          <div className="bg-white p-3 rounded-2xl text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-10 h-10 text-slate-900" />
              <div className="text-[10px]">
                <p className="font-bold">NIC Security Encrypted</p>
                <p className="text-slate-500 font-mono">HASH: {token.id?.slice(0, 12)}</p>
              </div>
            </div>
            <div className="text-right font-mono text-[9px] text-slate-500">
              <span className="bg-slate-100 px-2 py-1 rounded font-bold">GATE SCAN READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
