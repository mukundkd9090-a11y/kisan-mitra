import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, AlertTriangle, Scale, ShieldCheck } from 'lucide-react';

export const AdvanceStageModal = ({ isOpen, onClose, token, onStageUpdated }) => {
  const { t, i18n } = useTranslation();
  const [targetStage, setTargetStage] = useState('QUALITY_CHECKED');
  const [qualityGrade, setQualityGrade] = useState('Grade A (FAQ)');
  const [moisturePercent, setMoisturePercent] = useState('11.5');
  const [netWeight, setNetWeight] = useState(token?.estimatedQuantity || '30.0');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !token) return null;

  const handleSubmit = async (e) => {
    e.preventDefault;
    setIsSubmitting(true);
    try {
      await onStageUpdated(token.id, {
        stage: targetStage,
        qualityGrade,
        moisturePercent: Number(moisturePercent),
        netWeightQuintal: Number(netWeight),
        remarks: remarks || `Advanced to ${targetStage}`
      });
      onClose;
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gov-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gov-darkgreen to-gov-emerald text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-300 uppercase">Mandi Inflow Control</span>
            <h3 className="text-base font-bold font-outfit text-white">
              Advance Status: {token.tokenNumber}
            </h3>
            <p className="text-xs text-emerald-100">
              Farmer: {token.farmer?.fullName} ({token.cropType})
            </p>
          </div>

          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Next Stage</label>
            <select
              value={targetStage}
              onChange={(e) => setTargetStage(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-semibold text-slate-800"
            >
              <option value="DOCS_VERIFIED">1. Documents Verified</option>
              <option value="PRODUCE_RECEIVED">2. Produce Received at Weighbridge</option>
              <option value="QUALITY_CHECKED">3. Quality & Moisture Checked</option>
              <option value="ACCEPTED">4. Accept Produce & Approve Payout</option>
              <option value="PAYMENT_PROCESSED">5. Direct Benefit Transfer (DBT) Settled</option>
              <option value="REJECTED">6. Reject Produce (Quality Non-Compliant)</option>
            </select>
          </div>

          {/* Quality & Moisture Fields if applicable */}
          {['QUALITY_CHECKED', 'ACCEPTED', 'PAYMENT_PROCESSED'].includes(targetStage) && (
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-3">
              <div className="font-bold text-gov-emerald flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Assay & Quality Inspection Record</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quality Grade</label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Grade A (FAQ)">Grade A (FAQ - Fair Average)</option>
                    <option value="Superior Grade">Superior Grade (Export Quality)</option>
                    <option value="Grade B">Grade B (Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Moisture % (Max 12%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Actual Net Weighbridge Weight (Quintals)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={netWeight}
                  onChange={(e) => setNetWeight(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                />
              </div>
            </div>
          )}

          {targetStage === 'REJECTED' && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-200">
              <label className="block font-bold text-red-800 mb-1">Reason for Rejection (Mandatory)</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
                placeholder="e.g. Moisture level 16.5% exceeds 12% ceiling; foreign matter > 3%."
                className="w-full border border-red-300 rounded-lg p-2 bg-white"
                rows="2"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Officer Inspection Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Sample verified at counter #3. Weight slip #WS-8842."
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
              disabled={isSubmitting}
              className="flex-2 py-2.5 px-4 font-bold text-white bg-gov-emerald hover:bg-gov-green rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Update & Broadcast to Socket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvanceStageModal;
