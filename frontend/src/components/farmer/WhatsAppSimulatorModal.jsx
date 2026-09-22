import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCheck, ShieldCheck } from 'lucide-react';

export const WhatsAppSimulatorModal = ({ isOpen, onClose, token }) => {
  const { t, i18n } = useTranslation();

  if (!isOpen || !token) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b141a] rounded-3xl max-w-sm w-full shadow-2xl border border-emerald-900/50 overflow-hidden flex flex-col">
        {/* WhatsApp Top Header */}
        <div className="bg-[#1f2c34] text-white p-3.5 flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold text-lg">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-bold text-xs text-white">KisanMitra Official</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
              </div>
              <p className="text-[10px] text-[#8696a0]">Verified Govt Business Account</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8696a0] hover:text-white hover:bg-[#2a3942]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-4 bg-[#0c1317] bg-opacity-95 space-y-3 min-h-[320px]">
          {/* Security Banner */}
          <div className="bg-[#182229] border border-[#222e35] p-2 rounded-xl text-center">
            <span className="text-[10px] text-[#ffd279]">
              🔒 Messages and calls are end-to-end encrypted.
            </span>
          </div>

          {/* Token Message Bubble */}
          <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tl-none shadow-md text-xs leading-relaxed max-w-[92%] space-y-2">
            <div className="font-bold text-emerald-200 border-b border-emerald-600/50 pb-1 flex justify-between">
              <span>🌾 KISANMITRA TOKEN PASS</span>
              <span>{token.tokenDate}</span>
            </div>

            <p>
              Namaste <b>{token.farmer?.fullName || 'Farmer'}</b> ji, your digital token has been registered.
            </p>

            <div className="bg-[#025141] p-2 rounded-lg text-[11px] space-y-1">
              <div>🎫 <b>Token:</b> {token.tokenNumber}</div>
              <div>📍 <b>Centre:</b> {token.centre?.name}</div>
              <div>🌾 <b>Crop:</b> {token.cropType} ({token.estimatedQuantity} Qtl)</div>
              <div>⏰ <b>Arrival Slot:</b> {token.arrivalWindowStart} - {token.arrivalWindowEnd}</div>
              <div>🔢 <b>Live Queue:</b> #{token.queuePosition}</div>
              <div>⏳ <b>Est. Wait:</b> ~{token.estimatedWaitMinutes} mins</div>
            </div>

            <p className="text-[10px] text-emerald-100">
              💡 Please arrive 15 mins before your slot with Aadhaar and Bank Passbook. Live tracking: <span className="underline text-emerald-300">kisanmitra.gov.in/t/{token.tokenNumber}</span>
            </p>

            <div className="flex justify-end items-center gap-1 text-[9px] text-emerald-200/80 pt-1">
              <span>{new Date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSimulatorModal;
