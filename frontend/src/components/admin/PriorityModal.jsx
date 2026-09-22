import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';

export const PriorityModal = ({ isOpen, onClose, token, onPriorityElevated }) => {
  const { t, i18n } = useTranslation();
  const [reason, setReason] = useState('Perishable produce with vehicle mechanical breakdown');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !token) return null;

  const handleSubmit = async (e) => {
    e.preventDefault;
    const finalReason = reason === 'Other' ? customReason : reason;
    if (!finalReason || finalReason.trim.length < 4) {
      alert('Please provide a valid justification reason for audit compliance.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onPriorityElevated(token.id, finalReason);
      onClose;
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gov-border overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="text-base font-bold font-outfit text-white">Priority Queue Override</h3>
              <p className="text-[11px] text-amber-100">Elevate Token #{token.tokenNumber} to Top #1</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Compliance Notice */}
        <div className="p-3.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold">Government SOP Transparency Requirement:</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              All queue reorder actions are immutably logged with your Officer ID in the national audit ledger to prevent favoritism.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Select Authorized Justification Category:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-medium text-slate-800"
            >
              <option value="Perishable produce with vehicle mechanical breakdown">
                1. Perishable produce / Vehicle mechanical breakdown
              </option>
              <option value="Senior Citizen / Divyangjan (Specially Abled) Farmer">
                2. Senior Citizen (&gt;70 yrs) / Specially Abled Farmer
              </option>
              <option value="Severe Weather / Rain ingress alert for open-trolley produce">
                3. Severe Weather / Rain ingress alert for open trolley
              </option>
              <option value="Re-test after initial moisture calibration adjustment">
                4. Re-test after moisture calibration
              </option>
              <option value="Other">5. Other (Provide detailed manual justification)</option>
            </select>
          </div>

          {reason === 'Other' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Detailed Justification Note (Min 10 characters):
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                required
                rows="3"
                placeholder="Enter formal justification for audit review..."
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 outline-none"
              />
            </div>
          )}

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
              disabled={isSubmitting}
              className="flex-2 py-2.5 px-4 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Elevate to Top & Log in Audit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriorityModal;
