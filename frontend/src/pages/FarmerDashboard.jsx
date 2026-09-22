import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/client';
import TokenCard from '../components/farmer/TokenCard';
import StatusTimeline from '../components/farmer/StatusTimeline';
import GenerateTokenModal from '../components/farmer/GenerateTokenModal';
import SmsSimulatorModal from '../components/farmer/SmsSimulatorModal';
import WhatsAppSimulatorModal from '../components/farmer/WhatsAppSimulatorModal';
import PrintableTokenPass from '../components/farmer/PrintableTokenPass';
import LiveProcurementQueue from '../components/farmer/LiveProcurementQueue';
import {
  Tractor,
  PlusCircle,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Banknote
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedTokenForDetails, setSelectedTokenForDetails] = useState(null);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tokens/my');
      const tokenList = res.data.tokens || [];
      setTokens(tokenList);
      if (tokenList.length > 0) {
        setSelectedTokenForDetails(tokenList[0]);
      }
    } catch (err) {
      console.error('Error fetching farmer tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [user]);

  // Real-time socket updates for tokens
  useEffect(() => {
    if (!socket) return;

    const handleStatusChanged = (data) => {
      fetchTokens();
    };

    const handleQueueUpdate = (data) => {
      fetchTokens();
    };

    socket.on('token:status_changed', handleStatusChanged);
    socket.on('queue:update', handleQueueUpdate);

    return () => {
      socket.off('token:status_changed', handleStatusChanged);
      socket.off('queue:update', handleQueueUpdate);
    };
  }, [socket]);

  const activeToken = tokens.find((t) => !['ACCEPTED', 'REJECTED', 'PAYMENT_PROCESSED'].includes(t.stage)) || tokens[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] py-8">
      {/* Printable Hidden DOM Section */}
      {activeToken && <PrintableTokenPass token={activeToken} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-gov-darkgreen via-gov-emerald to-[#276E2A] text-white rounded-3xl p-6 sm:p-8 shadow-gov relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-white/20 text-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('farmer.dashboard_title')}
              </span>
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Aadhaar-Linked DBT Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
              {t('farmer.welcome')}, {user?.fullName || 'Farmer'} ji 🌾
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Village: <b className="text-white">{user?.village || 'Malihabad'}</b> • District: <b className="text-white">{user?.district || 'Lucknow'}</b> ({user?.state || 'Uttar Pradesh'})
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={fetchTokens}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors border border-white/20"
              title="Refresh queue status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-gov-saffron to-amber-500 hover:from-amber-500 hover:to-gov-saffron text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('farmer.generate_token')}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && tokens.length === 0 && (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gov-emerald" />
            <p className="text-sm font-semibold">Connecting to National Mandi Ledger...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && tokens.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-gov border border-gov-border max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-gov-emerald flex items-center justify-center mx-auto text-2xl">
              🌾
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-outfit">
              {i18n.language === 'hi' ? 'कोई सक्रिय टोकन नहीं मिला' : 'No Active Digital Tokens Found'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('farmer.no_tokens')}
            </p>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-6 py-3 bg-gov-emerald hover:bg-gov-green text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('farmer.generate_token')}</span>
            </button>
          </div>
        )}

        {/* Active Token & Real-Time Tracking Grid */}
        {activeToken && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: 3D Digital Token Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gov-emerald uppercase tracking-wider">
                  {i18n.language === 'hi' ? 'सक्रिय डिजिटल पास' : 'Primary Digital Token'}
                </span>
                <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                  Live Sync
                </span>
              </div>

              <TokenCard
                token={activeToken}
                onOpenSmsModal={() => setIsSmsModalOpen(true)}
                onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
                onPrintToken={handlePrint}
              />

              {/* Turn Approaching Alert Banner if Queue position <= 3 */}
              {activeToken.queuePosition <= 3 && !['ACCEPTED', 'REJECTED', 'PAYMENT_PROCESSED'].includes(activeToken.stage) && (
                <div className="bg-amber-500 text-amber-950 p-4 rounded-2xl border-2 border-amber-600 shadow-md animate-bounce-short space-y-1">
                  <div className="flex items-center gap-2 font-black text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{t('farmer.turn_soon')}</span>
                  </div>
                  <p className="text-xs font-medium opacity-90">
                    Your queue number is <b>#{activeToken.queuePosition}</b>. Please proceed to Weighbridge Gate Scale #3 with documents.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: 6-Stage Timeline Tracker (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-gov-emerald uppercase tracking-wider block">
                {i18n.language === 'hi' ? 'लाइव स्टेटस व वेरिफिकेशन स्टेज' : 'Live Status & Quality Assurance'}
              </span>

              <StatusTimeline token={activeToken} />
            </div>
          </div>
        )}

        {/* LIVE PROCUREMENT TOKEN & QUEUE STATUS */}
        <LiveProcurementQueue />

        {/* Token History Table */}
        {tokens.length > 1 && (
          <div className="bg-white rounded-3xl p-6 shadow-gov border border-gov-border space-y-4">
            <h3 className="text-base font-bold font-outfit text-slate-900">
              {t('farmer.token_history')} ({tokens.length})
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 text-left">Token Number</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Crop</th>
                    <th className="py-3 px-4 text-left">Centre</th>
                    <th className="py-3 px-4 text-left">Stage</th>
                    <th className="py-3 px-4 text-right">MSP Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tokens.map((tkn) => (
                    <tr key={tkn.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gov-emerald">
                        {tkn.tokenNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{tkn.tokenDate}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {tkn.cropType} ({tkn.estimatedQuantity} Qtl)
                      </td>
                      <td className="py-3 px-4 text-slate-600">{tkn.centre?.name}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                          {t(`stages.${tkn.stage}`) || tkn.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-gov-emerald">
                        ₹{tkn.totalPayout ? Number(tkn.totalPayout).toLocaleString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <GenerateTokenModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onTokenCreated={(newToken) => {
          fetchTokens();
        }}
        defaultState={user?.state || 'Uttar Pradesh'}
      />

      {activeToken && (
        <>
          <SmsSimulatorModal
            isOpen={isSmsModalOpen}
            onClose={() => setIsSmsModalOpen(false)}
            tokenNumber={activeToken.tokenNumber}
          />
          <WhatsAppSimulatorModal
            isOpen={isWhatsAppModalOpen}
            onClose={() => setIsWhatsAppModalOpen(false)}
            token={activeToken}
          />
        </>
      )}
    </div>
  );
};

export default FarmerDashboard;
