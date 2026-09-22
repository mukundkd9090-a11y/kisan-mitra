import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, Radio, MessageSquare, ShieldCheck, Users } from 'lucide-react';

export const BroadcastModal = ({ isOpen, onClose, onBroadcastSent }) => {
  const { t, i18n } = useTranslation();
  const [title, setTitle] = useState('Procurement Center Weather Advisory');
  const [titleHi, setTitleHi] = useState('प्रोक्योरमेंट केंद्र मौसम सूचना');
  const [message, setMessage] = useState('Due to rain forecast tomorrow morning, indoor dry shed unloading lanes will operate starting 7:30 AM.');
  const [messageHi, setMessageHi] = useState('कल सुबह बारिश के पूर्वानुमान के कारण शेड वाली अनलोडिंग लेन सुबह 7:30 बजे से चालू रहेंगी।');
  const [targetCrop, setTargetCrop] = useState('All');
  const [targetState, setTargetState] = useState('All');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault;
    setIsSending(true);
    try {
      await onBroadcastSent({
        title,
        titleHi,
        message,
        messageHi,
        targetCrop: targetCrop === 'All' ? null : targetCrop,
        targetState: targetState === 'All' ? null : targetState
      });
      onClose;
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gov-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-200 animate-pulse" />
            <div>
              <h3 className="text-base font-bold font-outfit text-white">Mandi Officer Bulk Broadcast</h3>
              <p className="text-[11px] text-blue-200">Push SMS, WhatsApp & In-App Announcements</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target State</label>
              <select
                value={targetState}
                onChange={(e) => setTargetState(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              >
                <option value="All">All States (National)</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Jharkhand">Jharkhand</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Crop Group</label>
              <select
                value={targetCrop}
                onChange={(e) => setTargetCrop(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              >
                <option value="All">All Crops</option>
                <option value="Wheat">Wheat Farmers</option>
                <option value="Rice">Rice / Paddy Farmers</option>
                <option value="Mustard">Mustard Farmers</option>
                <option value="Maize">Maize Farmers</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">English Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Hindi Title (हिंदी शीर्षक)</label>
            <input
              type="text"
              value={titleHi}
              onChange={(e) => setTitleHi(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">English Message Body</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="2"
              className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Hindi Message (हिंदी संदेश)</label>
            <textarea
              value={messageHi}
              onChange={(e) => setMessageHi(e.target.value)}
              required
              rows="2"
              className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex-2 py-2.5 px-4 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BroadcastModal;
