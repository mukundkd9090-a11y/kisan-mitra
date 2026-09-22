import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../context/NotificationContext';
import { Bell, CheckCheck, Filter, AlertCircle, Banknote, Radio, Sparkles } from 'lucide-react';

export const Notifications = () => {
  const { t, i18n } = useTranslation();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const [filterType, setFilterType] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  return (
    <div className="min-h-screen bg-[#F8FAF6] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-gov border border-gov-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gov-emerald" />
              <h1 className="text-xl font-bold font-outfit text-slate-900">
                {t('nav.notifications')}
              </h1>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {i18n.language === 'hi'
                ? 'टोकन प्रगति, कतार अपडेट और आधिकारिक घोषणाओं का लॉग'
                : 'Real-time timeline of token milestones, queue shifts, and official Mandi advisories'}
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-gov-emerald" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'All Notifications' },
            { id: 'TOKEN', label: 'Token Updates' },
            { id: 'STATUS', label: 'Inspection Milestones' },
            { id: 'PAYMENT', label: 'DBT Payments' },
            { id: 'BROADCAST', label: 'Mandi Broadcasts' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                filterType === f.id
                  ? 'bg-gov-emerald text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification Stream */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              No notifications in this category.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`bg-white p-5 rounded-3xl border shadow-sm transition-all flex items-start gap-4 ${
                  !n.isRead ? 'border-gov-emerald/60 bg-emerald-50/30' : 'border-slate-200/80'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                  {n.type === 'PAYMENT' ? '💰' : n.type === 'BROADCAST' ? '📢' : '🌾'}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-slate-900">
                      {i18n.language === 'hi' ? n.titleHi || n.title : n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {i18n.language === 'hi' ? n.messageHi || n.message : n.message}
                  </p>

                  {n.tokenNumber && (
                    <span className="inline-block font-mono text-[10px] font-bold text-gov-emerald bg-emerald-100/70 px-2 py-0.5 rounded mt-1">
                      Ref: {n.tokenNumber}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
