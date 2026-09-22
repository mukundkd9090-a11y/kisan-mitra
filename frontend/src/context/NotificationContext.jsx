import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { useTranslation } from 'react-i18next';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const { user } = useAuth();
  const { socket } = useSocket();
  const { i18n } = useTranslation();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Real-time socket listener for incoming notifications
  useEffect(() => {
    if (!socket) return;

    const handleStatusChanged = (data) => {
      if (user && data.farmerId === user.id) {
        addToast({
          title: i18n.language === 'hi' ? `प्रोक्योरमेंट स्थिति: ${data.stage}` : `Status Updated: ${data.stage}`,
          message: i18n.language === 'hi' ? `आपके टोकन की स्थिति बदल गई है।` : `Your token has moved to ${data.stage}.`,
          type: 'STATUS'
        });
        fetchNotifications();
      }
    };

    const handleBroadcast = (data) => {
      addToast({
        title: i18n.language === 'hi' ? data.titleHi || data.title : data.title,
        message: i18n.language === 'hi' ? data.messageHi || data.message : data.message,
        type: 'BROADCAST'
      });
      fetchNotifications();
    };

    socket.on('token:status_changed', handleStatusChanged);
    socket.on('broadcast:alert', handleBroadcast);

    return () => {
      socket.off('token:status_changed', handleStatusChanged);
      socket.off('broadcast:alert', handleBroadcast);
    };
  }, [socket, user, i18n.language]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Auto remove after 6 seconds
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/all/read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error('Error marking all as read:', e);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        addToast,
        removeToast,
        markAllAsRead,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
      {/* Toast Notification Container in Top-Right */}
      <div className="fixed top-20 right-5 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-white border-l-4 border-gov-emerald p-4 rounded-r-lg shadow-gov-lg animate-bounce-short flex items-start gap-3 transition-all duration-300 transform hover:scale-102"
          >
            <div className="text-xl">
              {t.type === 'PAYMENT' ? '💰' : t.type === 'BROADCAST' ? '📢' : '🌾'}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-800">{t.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-700 text-sm font-bold ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
