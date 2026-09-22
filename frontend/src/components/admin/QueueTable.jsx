import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, CheckCircle, Clock, MapPin, Search, Filter, ArrowUpRight } from 'lucide-react';
import AdvanceStageModal from './AdvanceStageModal';
import PriorityModal from './PriorityModal';

export const QueueTable = ({ tokens, onStageUpdated, onPriorityElevated }) => {
  const { t, i18n } = useTranslation();
  const [selectedTokenForStage, setSelectedTokenForStage] = useState(null);
  const [selectedTokenForPriority, setSelectedTokenForPriority] = useState(null);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');

  const filteredTokens = tokens.filter((tkn) => {
    const matchesSearch =
      tkn.tokenNumber.toLowerCase.includes(search.toLowerCase) ||
      tkn.farmer?.fullName?.toLowerCase.includes(search.toLowerCase) ||
      tkn.farmer?.mobile?.includes(search);

    const matchesCrop = cropFilter === 'All' || tkn.cropType === cropFilter;
    const matchesStage = stageFilter === 'All' || tkn.stage === stageFilter;

    return matchesSearch && matchesCrop && matchesStage;
  });

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'GENERATED':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'DOCS_VERIFIED':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      case 'PRODUCE_RECEIVED':
        return 'bg-indigo-50 text-indigo-900 border-indigo-300';
      case 'QUALITY_CHECKED':
        return 'bg-purple-50 text-purple-900 border-purple-300';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold';
      case 'PAYMENT_PROCESSED':
        return 'bg-green-600 text-white font-extrabold shadow-sm';
      case 'REJECTED':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-gov border border-gov-border space-y-4">
      {/* Table Title & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h3 className="text-lg font-bold font-outfit text-slate-900">
            {t('admin.live_queue_stream')}
          </h3>
          <p className="text-xs text-slate-500">
            {filteredTokens.length} {i18n.language === 'hi' ? 'किसान वर्तमान में सक्रिय' : 'tokens currently in intake pipeline'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.search_placeholder')}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-gov-emerald"
            />
          </div>

          {/* Crop Filter */}
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 outline-none"
          >
            <option value="All">{t('admin.filter_crop')}: All</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice / Paddy</option>
            <option value="Mustard">Mustard</option>
            <option value="Maize">Maize</option>
          </select>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 outline-none"
          >
            <option value="All">{t('admin.filter_stage')}: All</option>
            <option value="GENERATED">Token Issued</option>
            <option value="DOCS_VERIFIED">Docs Verified</option>
            <option value="PRODUCE_RECEIVED">Weighbridge</option>
            <option value="QUALITY_CHECKED">Quality Checked</option>
            <option value="ACCEPTED">Accepted</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 text-left">Queue #</th>
              <th className="py-3.5 px-4 text-left">Token Number</th>
              <th className="py-3.5 px-4 text-left">Farmer Details</th>
              <th className="py-3.5 px-4 text-left">Crop & Quantity</th>
              <th className="py-3.5 px-4 text-left">Arrival Slot</th>
              <th className="py-3.5 px-4 text-left">Current Stage</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTokens.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  No active tokens matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredTokens.map((token, index) => (
                <tr
                  key={token.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    token.isPriority ? 'bg-amber-50/50' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-extrabold text-sm text-gov-emerald">
                      #{token.currentLivePosition || index + 1}
                    </span>
                    {token.isPriority && (
                      <span className="block text-[9px] font-black text-amber-800 uppercase">
                        ⚡ Priority
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">{token.tokenNumber}</div>
                    <div className="text-[10px] text-slate-500">{token.tokenDate}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{token.farmer?.fullName}</div>
                    <div className="text-[10px] text-slate-500">
                      {token.farmer?.mobile} • {token.farmer?.village || token.farmer?.district}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">🌾 {token.cropType}</span>
                    <div className="text-[10px] text-slate-500">
                      {token.netWeightQuintal ? (
                        <b className="text-emerald-700">{token.netWeightQuintal} Qtl (Actual)</b>
                      ) : (
                        `${token.estimatedQuantity} Qtl (Est.)`
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                    <div>{token.arrivalWindowStart} – {token.arrivalWindowEnd}</div>
                    <div className="text-[10px] text-slate-500">~{token.estimatedWaitMinutes}m wait</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStageBadge(
                        token.stage
                      )}`}
                    >
                      {t(`stages.${token.stage}`) || token.stage}
                    </span>
                    {token.moisturePercent && (
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                        Moisture: {token.moisturePercent}% ({token.qualityGrade || 'FAQ'})
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                    {/* Advance Stage Button */}
                    <button
                      onClick={() => setSelectedTokenForStage(token)}
                      className="px-3 py-1.5 bg-gov-emerald hover:bg-gov-green text-white font-bold rounded-lg shadow-sm transition-all text-xs"
                      title="Update stage & record quality"
                    >
                      {t('admin.advance_stage')}
                    </button>

                    {/* Priority Jump Button */}
                    {!token.isPriority && (
                      <button
                        onClick={() => setSelectedTokenForPriority(token)}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg transition-colors text-xs"
                        title="Move to Top of Queue"
                      >
                        ⚡ {t('admin.priority_jump')}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedTokenForStage && (
        <AdvanceStageModal
          isOpen={Boolean(selectedTokenForStage)}
          onClose={() => setSelectedTokenForStage(null)}
          token={selectedTokenForStage}
          onStageUpdated={onStageUpdated}
        />
      )}

      {selectedTokenForPriority && (
        <PriorityModal
          isOpen={Boolean(selectedTokenForPriority)}
          onClose={() => setSelectedTokenForPriority(null)}
          token={selectedTokenForPriority}
          onPriorityElevated={onPriorityElevated}
        />
      )}
    </div>
  );
};

export default QueueTable;
