import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { MessageSquare, X, Send, Volume2, Sparkles, Bot, Globe, ChevronDown } from 'lucide-react';

export const AgyaChatbot = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLang, setChatLang] = useState(i18n.language || 'en');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agya',
      text: i18n.language === 'hi'
        ? 'नमस्ते किसान भाई! मैं आज्ञा (Agya) हूँ, आपकी AI मंडी सहायक। मैं आपकी टोकन स्थिति, कतार समय, MSP भाव या आवश्यक दस्तावेज़ों में कैसे मदद करूँ?'
        : 'Namaste! I am Agya, your AI Procurement Assistant. How can I help you today with your token status, queue waiting time, MSP rates, or documents?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: i18n.language === 'hi'
        ? ["मेरा टोकन स्टेटस बताओ", "गेहूं का MSP रेट 2026", "कौन से दस्तावेज़ जरूरी हैं?", "निकटतम मंडी"]
        : ["What is my token status?", "Wheat MSP Rate 2026", "Which documents are required?", "Nearest Procurement Centres"]
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom;
    }
  }, [messages, isOpen]);

  // Keep chatLang synced when global language changes unless manually overridden
  useEffect(() => {
    setChatLang(i18n.language);
  }, [i18n.language]);

  const handleSend = async (textToSend = inputMessage) => {
    const query = textToSend.trim;
    if (!query) return;

    const userMsg = {
      id: Date.now,
      sender: 'user',
      text: query,
      timestamp: new Date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chat', {
        message: query,
        language: chatLang,
        userId: user?.id
      });

      const agyaMsg = {
        id: Date.now() + 1,
        sender: 'agya',
        text: res.data.reply || 'Namaste! Let me assist you with that.',
        timestamp: new Date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: res.data.suggestions || []
      };

      setMessages((prev) => [...prev, agyaMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'agya',
        text: chatLang === 'hi'
          ? 'माफ़ कीजिए, सर्वर से संपर्क नहीं हो पा रहा है। कृपया कुछ देर बाद पुनः प्रयास करें।'
          : 'Sorry, I had trouble reaching the Mandi network. Please try again in a moment.',
        timestamp: new Date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Text-to-speech Web Speech API audio output
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel;
    const cleanText = text.replace(/[*_#\-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = chatLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Avatar Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-gov-emerald to-gov-green text-white p-3 pr-4 rounded-full shadow-gov-lg hover:shadow-glow-green transition-all duration-300 hover:scale-105 border-2 border-white"
          aria-label="Open Agya Chatbot"
        >
          {/* Avatar Icon */}
          <div className="relative w-11 h-11 rounded-full bg-amber-100 border-2 border-gov-saffron flex items-center justify-center overflow-hidden shadow-inner">
            <span className="text-2xl" role="img" aria-label="Indian Assistant Agya">
              👩🏽‍💼
            </span>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-white font-outfit">
                {i18n.language === 'hi' ? 'आज्ञा (Agya)' : 'Agya AI'}
              </span>
              <span className="bg-gov-saffron text-amber-950 text-[9px] font-extrabold px-1 rounded uppercase">
                AI
              </span>
            </div>
            <p className="text-[10px] text-emerald-100 line-clamp-1">
              {i18n.language === 'hi' ? 'आपकी मंडी सहायक' : 'Procurement Assistant'}
            </p>
          </div>

          <div className="w-2.5 h-2.5 bg-gov-saffron rounded-full animate-ping absolute top-1 right-1" />
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gov-border flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-gov-darkgreen via-gov-emerald to-emerald-700 text-white p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center overflow-hidden">
                <span className="text-xl">👩🏽‍💼</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-gov-darkgreen rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white font-outfit">
                    {chatLang === 'hi' ? 'आज्ञा (Agya AI)' : 'Agya – AI Assistant'}
                  </h3>
                  <span className="bg-emerald-900/60 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/40">
                    24x7 Voice
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200">
                  {chatLang === 'hi' ? 'द्विभाषी किसान सलाहकार' : 'Bilingual Mandi Advisor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* In-chat language toggle */}
              <button
                onClick={() => setChatLang(chatLang === 'en' ? 'hi' : 'en')}
                className="text-[11px] font-bold px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
                title="Switch Chat Language"
              >
                {chatLang === 'en' ? 'हिंदी' : 'EN'}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gov-emerald text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{msg.text}</div>

                  <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-black/5 text-[9px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'agya' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="flex items-center gap-1 hover:text-gov-emerald font-semibold"
                        title="Listen to this message"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{chatLang === 'hi' ? 'सुनें' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggestion Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[10px] font-medium bg-emerald-50 text-gov-emerald border border-emerald-200/80 hover:bg-gov-emerald hover:text-white px-2.5 py-1 rounded-full transition-all duration-200"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-2.5 rounded-2xl rounded-bl-none w-20 shadow-sm">
                <span className="w-1.5 h-1.5 bg-gov-emerald rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gov-emerald rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gov-emerald rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Field */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault;
                handleSend;
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  chatLang === 'hi'
                    ? 'आज्ञा से कुछ भी पूछें...'
                    : 'Ask Agya (e.g. token status, MSP, wait time)...'
                }
                className="flex-1 text-xs border border-slate-300 focus:border-gov-emerald focus:ring-1 focus:ring-gov-emerald rounded-xl px-3 py-2.5 outline-none"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim || isTyping}
                className="bg-gov-emerald hover:bg-gov-green disabled:opacity-40 text-white p-2.5 rounded-xl shadow-sm transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgyaChatbot;
