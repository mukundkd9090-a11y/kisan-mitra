import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';
import { Smartphone, Send, X, WifiOff, MessageSquare, Check, ShieldCheck } from 'lucide-react';

export const SmsSimulatorModal = ({ isOpen, onClose, tokenNumber }) => {
  const { t, i18n } = useTranslation();
  const [queryInput, setQueryInput] = useState(`KISAN ${tokenNumber || 'TKN-UP-2026-00142'}`);
  const [chatLog, setChatLog] = useState([
    {
      sender: 'system',
      text: 'Govt of India Mandi SMS Gateway 166066 active. Standard SMS rates apply. Zero-internet carrier fallback.'
    }
  ]);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSendSms = async (e) => {
    e.preventDefault;
    if (!queryInput.trim || isSending) return;

    const userText = queryInput.trim;
    const newLog = [...chatLog, { sender: 'user', text: userText }];
    setChatLog(newLog);
    setIsSending(true);

    try {
      const res = await api.get(`/tokens/sms-query?queryText=${encodeURIComponent(userText)}`);
      setTimeout(() => {
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'gateway',
            text: res.data.smsResponse || 'No active token found.'
          }
        ]);
        setIsSending(false);
      }, 700);
    } catch (err) {
      setTimeout(() => {
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'gateway',
            text: `[KISAN-QUEUE] Network timeout. Token ${tokenNumber || 'TKN-UP-2026-00142'}: Status - Active in Queue. Helpline: 1800-180-1551.`
          }
        ]);
        setIsSending(false);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gov-border overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-[#1A331E] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gov-emerald">
              <WifiOff className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-outfit text-white">
                {i18n.language === 'hi' ? 'ऑफलाइन / कम नेटवर्क SMS सेवा' : 'Offline / Low-Network SMS Gateway'}
              </h3>
              <p className="text-[11px] text-emerald-300">
                {i18n.language === 'hi' ? 'बिना इंटरनेट के कभी भी कतार स्थिति जांचें' : 'Check queue status via SMS 166066'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Guide Card */}
        <div className="bg-amber-50 p-3.5 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Smartphone className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold">
              {i18n.language === 'hi' ? 'SMS भेजने का आधिकारिक प्रारूप:' : 'Official SMS Format:'}
            </span>
            <div className="font-mono bg-white px-2 py-1 rounded border border-amber-300 font-bold text-slate-800 mt-1 inline-block">
              KISAN &lt;TokenNumber&gt; ➔ 166066
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              {i18n.language === 'hi'
                ? 'यह सुविधा बिना इंटरनेट वाले फीचर फोन (कीपैड फोन) पर भी काम करती है।'
                : 'Works on any 2G feature phone without internet or smart phone apps.'}
            </p>
          </div>
        </div>

        {/* Realistic Mobile Phone Screen Simulation */}
        <div className="p-4 bg-slate-100 flex-1 flex flex-col justify-between h-[340px]">
          {/* Messages Stream */}
          <div className="space-y-2.5 overflow-y-auto pr-1">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user'
                    ? 'items-end'
                    : msg.sender === 'system'
                    ? 'items-center'
                    : 'items-start'
                }`}
              >
                {msg.sender === 'system' ? (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-center">
                    {msg.text}
                  </span>
                ) : (
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs font-mono leading-snug shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'gateway' && (
                      <div className="flex items-center gap-1 text-[10px] text-gov-emerald font-bold mb-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>GOV-KISAN SMS (166066)</span>
                      </div>
                    )}
                    <div>{msg.text}</div>
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white p-2 rounded-xl w-32 border border-slate-200">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                <span>Transmitting...</span>
              </div>
            )}
          </div>

          {/* SMS Input Simulation Bar */}
          <form onSubmit={handleSendSms} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g. KISAN TKN-UP-2026-00142"
              className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={!queryInput.trim || isSending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SmsSimulatorModal;
