import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNotification } from '../context/NotificationContext';
import api from '../api/client';
import QueueTable from '../components/admin/QueueTable';
import AuditLogTable from '../components/admin/AuditLogTable';
import CapacitySimulator from '../components/admin/CapacitySimulator';
import BroadcastModal from '../components/admin/BroadcastModal';
import {
  Shield,
  Users,
  Clock,
  CheckCircle2,
  Radio,
  Sliders,
  FileText,
  TrendingUp,
  RefreshCw,
  Scale,
  Sparkles,
  MapPin
} from 'lucide-react';

export const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { addToast } = useNotification();

  const [tokens, setTokens] = useState([]);
  const [metrics, setMetrics] = useState({
    totalTokensToday: 24,
    inQueue: 6,
    completed: 18,
    avgWaitMinutes: 28,
    activeWeighbridges: 4,
    operationalEfficiency: '95.4%'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'audit', 'simulator'
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [queueRes, metricsRes] = await Promise.all([
        api.get('/admin/queue'),
        api.get('/admin/metrics')
      ]);

      setTokens(queueRes.data.tokens || []);
      if (metricsRes.data && metricsRes.data.metrics) {
        setMetrics(metricsRes.data.metrics);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData;
  }, [user]);

  // Real-time socket sync
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = () => {
      fetchAdminData;
    };

    socket.on('queue:update', handleQueueUpdate);
    socket.on('token:status_changed', handleQueueUpdate);

    return () => {
      socket.off('queue:update', handleQueueUpdate);
      socket.off('token:status_changed', handleQueueUpdate);
    };
  }, [socket]);

  // Advance stage handler
  const handleStageUpdated = async (tokenId, payload) => {
    try {
      await api.patch(`/admin/tokens/${tokenId}/status`, payload);
      addToast({
        title: 'Stage Updated',
        message: `Token updated to ${payload.stage} and broadcasted to live queue.`,
        type: 'STATUS'
      });
      fetchAdminData;
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating stage.');
    }
  };

  // Priority elevation handler
  const handlePriorityElevated = async (tokenId, reason) => {
    try {
      await api.post(`/admin/tokens/${tokenId}/priority`, { reason });
      addToast({
        title: 'Priority Granted',
        message: `Farmer moved to top of queue. Justification logged in audit ledger.`,
        type: 'STATUS'
      });
      fetchAdminData;
    } catch (err) {
      alert(err.response?.data?.message || 'Error elevating priority.');
    }
  };

  // Bulk broadcast handler
  const handleBroadcastSent = async (payload) => {
    try {
      const res = await api.post('/admin/broadcast', payload);
      addToast({
        title: 'Broadcast Dispatched',
        message: res.data.message || 'SMS & In-App broadcast sent.',
        type: 'BROADCAST'
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error broadcasting message.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8F3] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Mandi Officer Header Bar */}
        <div className="bg-gradient-to-r from-[#123015] via-[#1b5e20] to-[#25662a] text-white rounded-3xl p-6 sm:p-8 shadow-gov flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-white/20 text-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t('admin.dashboard_title')}
              </span>
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Mandi Inflow Officer Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
              {user?.fullName || 'Vijay Sharma (Mandi Officer)'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200">
              Assigned Node: <b className="text-white">Mohan Road Krishi Mandi (UP-LKO-01)</b> • Gate Scales: 4 Active
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchAdminData}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors border border-white/20"
              title="Refresh queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow transition-all flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-blue-200 animate-pulse" />
              <span>{t('admin.broadcast_alert')}</span>
            </button>
          </div>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Today */}
          <div className="bg-white p-5 rounded-3xl border border-gov-border shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">{t('admin.total_today')}</span>
              <Users className="w-4 h-4 text-gov-emerald" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-outfit">
              {metrics.totalTokensToday}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              Daily quota: 200 trucks
            </span>
          </div>

          {/* In Queue */}
          <div className="bg-white p-5 rounded-3xl border border-gov-border shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">{t('admin.in_queue')}</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600 font-outfit">
              {tokens.length}
            </div>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
              Active at weighbridge
            </span>
          </div>

          {/* Average Wait Time */}
          <div className="bg-white p-5 rounded-3xl border border-gov-border shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">{t('admin.avg_wait_time')}</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-blue-700 font-outfit">
              {metrics.avgWaitMinutes}m
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              3.8 hrs saved vs legacy
            </span>
          </div>

          {/* Cleared Procurements */}
          <div className="bg-white p-5 rounded-3xl border border-gov-border shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">{t('admin.cleared')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-gov-emerald font-outfit">
              {metrics.completed || 18}
            </div>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
              100% DBT credited
            </span>
          </div>
        </div>

        {/* Tab Navigation (Live Queue, Audit Logs, AI Simulator) */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'queue'
                ? 'bg-gov-emerald text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🌾 {t('admin.live_queue_stream')}</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {tokens.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-gov-emerald text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{t('admin.audit_ledger')}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-gov-emerald text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t('admin.capacity_controls')}</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'queue' && (
          <QueueTable
            tokens={tokens}
            onStageUpdated={handleStageUpdated}
            onPriorityElevated={handlePriorityElevated}
          />
        )}

        {activeTab === 'audit' && <AuditLogTable />}

        {activeTab === 'simulator' && <CapacitySimulator />}
      </div>

      {/* Broadcast Modal */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onBroadcastSent={handleBroadcastSent}
      />
    </div>
  );
};

export default AdminDashboard;
