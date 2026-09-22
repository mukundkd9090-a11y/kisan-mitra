import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../context/SocketContext';
import api from '../../api/client';
import { Clock, Users, Ticket, Radio, MapPin, Wheat, Calendar, AlertCircle, CheckCircle2, XCircle, BellRing } from 'lucide-react';

export const LiveProcurementQueue = () => {
  const { t, i18n } = useTranslation();
  const { socket, isConnected } = useSocket();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showTurnAlert, setShowTurnAlert] = useState(false);
  const prevAheadRef = useRef(null);

  const fetchLiveQueue = useCallback(async () => {
    try {
      setError('');
      const res = await api.get('/tokens/live-queue');
      const payload = res.data;
      setData(payload);
      setLastUpdated(new Date());

      // Trigger "your turn" notification once when it becomes 0
      if (payload?.hasActiveToken && payload.farmersAhead === 0 && payload.state === 'your_turn') {
        if (prevAheadRef.current !== 0) {
          setShowTurnAlert(true);
          // auto-hide after 10s but keep banner
          setTimeout(() => setShowTurnAlert(false), 12000);
        }
      }
      prevAheadRef.current = payload?.farmersAhead ?? null;
    } catch (err) {
      console.error('Live queue fetch error', err);
      setError(err.response?.data?.message || 'Failed to fetch live queue. Retrying...');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveQueue();
    const interval = setInterval(fetchLiveQueue, 30000); // fallback polling 30s
    return () => clearInterval(interval);
  }, [fetchLiveQueue]);

  // Socket real-time updates
  useEffect(() => {
    if (!socket) return;
    const handler = () => fetchLiveQueue();
    socket.on('token:status_changed', handler);
    socket.on('queue:update', handler);
    socket.on('broadcast:alert', handler);
    return () => {
      socket.off('token:status_changed', handler);
      socket.off('queue:update', handler);
      socket.off('broadcast:alert', handler);
    };
  }, [socket, fetchLiveQueue]);

  // Reconnect handling
  useEffect(() => {
    if (isConnected) fetchLiveQueue();
  }, [isConnected, fetchLiveQueue]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-gov border border-gov-border animate-pulse">
        <div className="h-4 w-40 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-gov border border-red-200 text-center space-y-2">
        <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
        <p className="text-xs font-bold text-red-700">{error}</p>
        <button onClick={fetchLiveQueue} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold">Retry</button>
        <p className="text-[11px] text-slate-500">{isConnected ? 'Socket: Connected' : 'Socket: Reconnecting...'}</p>
      </div>
    );
  }

  if (!data?.hasActiveToken) {
    if (data?.state === 'completed' || data?.state === 'cancelled') {
      const isCancelled = data.state === 'cancelled';
      return (
        <div className={`rounded-3xl p-6 border shadow-sm text-center space-y-2 ${isCancelled ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          {isCancelled ? <XCircle className="w-8 h-8 text-red-600 mx-auto" /> : <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />}
          <h3 className={`font-bold ${isCancelled ? 'text-red-800' : 'text-emerald-800'}`}>
            {isCancelled ? (i18n.language === 'hi' ? 'टोकन रद्द/अस्वीकृत' : 'Token Cancelled / Rejected') : (i18n.language === 'hi' ? 'प्रोक्योरमेंट पूर्ण' : 'Procurement Completed')}
          </h3>
          <p className="text-xs text-slate-600">{data.lastToken ? `${data.lastToken.tokenNumber} • ${data.lastToken.centre?.name}` : data.message}</p>
          <p className="text-[11px] text-slate-500">{data.message}</p>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-3xl p-8 shadow-gov border border-gov-border text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto"><Ticket className="w-6 h-6 text-slate-400" /></div>
        <h3 className="font-bold text-slate-900">{i18n.language === 'hi' ? 'कोई सक्रिय टोकन नहीं' : 'No Active Token'}</h3>
        <p className="text-xs text-slate-500">{data?.message || 'Book a slot to see live queue.'}</p>
      </div>
    );
  }

  const isYourTurn = data.farmersAhead === 0;

  return (
    <div className="space-y-3">
      {isYourTurn && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-4 flex items-center gap-3 shadow-gov animate-pulse border border-emerald-700">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><BellRing className="w-5 h-5 text-white" /></div>
          <div className="flex-1">
            <div className="font-black text-sm flex items-center gap-2">🟢 {i18n.language === 'hi' ? 'आपकी बारी है!' : "It's your turn!"}</div>
            <div className="text-xs text-emerald-100">{i18n.language === 'hi' ? 'कृपया तुरंत काउंटर पर संपर्क करें' : 'Please proceed to the counter immediately.'}</div>
          </div>
          <span className="text-[11px] font-bold bg-white text-emerald-700 px-2.5 py-1 rounded-full">NOW</span>
        </div>
      )}

      {showTurnAlert && isYourTurn && (
        <div className="bg-amber-400 text-amber-950 px-4 py-2 rounded-xl text-xs font-bold text-center border border-amber-600">
          {i18n.language === 'hi' ? '🔔 आपकी बारी आ गई है — कतार में सबसे आगे!' : '🔔 Your turn is here — you are now at front of queue!'}
        </div>
      )}

      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-gov border border-gov-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isConnected ? 'text-emerald-600' : 'text-amber-500'}`} />
            {i18n.language === 'hi' ? 'लाइव प्रोक्योरमेंट कतार' : 'Live Procurement Queue'}
          </h3>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${isConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
            {isConnected ? (i18n.language === 'hi' ? 'लाइव' : 'Live') : 'Reconnecting'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F8FAF6] rounded-2xl p-3.5 border border-[#E3EDE2]">
            <div className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1"><Ticket className="w-3.5 h-3.5" /> Your Token</div>
            <div className="font-mono font-black text-[#1B5E20] text-sm mt-1 truncate">{data.yourToken}</div>
            <div className="text-[11px] text-slate-500">{data.stage} • #{data.livePosition}</div>
          </div>
          <div className="bg-[#FFF8E1] rounded-2xl p-3.5 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> Now Serving</div>
            <div className="font-mono font-black text-slate-900 text-sm mt-1 truncate">{data.nowServing}</div>
            <div className="text-[11px] text-slate-500">{data.queueLength} in queue</div>
          </div>
          <div className={`rounded-2xl p-3.5 border ${isYourTurn ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Farmers Ahead</div>
            <div className={`font-black text-2xl mt-1 ${isYourTurn ? 'text-emerald-700' : 'text-slate-900'}`}>{data.farmersAhead}</div>
            <div className="text-[11px] text-slate-500">{isYourTurn ? (i18n.language === 'hi' ? 'आप सबसे आगे!' : 'You are next!') : 'ahead of you'}</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-3.5 border border-blue-200">
            <div className="text-[11px] font-bold text-blue-800 uppercase flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Estimated Wait</div>
            <div className="font-black text-blue-900 text-sm mt-1">{data.estimatedWaitText}</div>
            <div className="text-[11px] text-slate-500">{data.estimatedWaitMinutes === 0 ? 'Go now' : `${data.farmersAhead} × ~5 min`}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-2 rounded-xl border">
            <MapPin className="w-3.5 h-3.5 text-gov-emerald flex-shrink-0" />
            <span className="font-bold text-slate-800 truncate" title={data.centre.name}>{data.centre.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-2 rounded-xl border">
            <Wheat className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="truncate">{data.crop} • {data.quantity} Qtl</span>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-2 rounded-xl border">
            <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>{data.tokenDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Updated just now • {lastUpdated ? lastUpdated.toLocaleTimeString() : ''}</span>
          <button onClick={fetchLiveQueue} className="font-bold text-gov-emerald hover:underline">Refresh</button>
        </div>

        {error && <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{error}</p>}
      </div>
    </div>
  );
};

export default LiveProcurementQueue;
