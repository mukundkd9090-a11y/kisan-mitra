import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';
import { ShieldCheck, Search, Filter, RefreshCw, FileText, Download } from 'lucide-react';

export const AuditLogTable = () => {
  const { t, i18n } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = '/admin/audit-logs?limit=50';
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (selectedAction) url += `&action=${encodeURIComponent(selectedAction)}`;
      const res = await api.get(url);
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs;
  }, [search, selectedAction]);

  const exportToCSV = () => {
    if (logs.length === 0) return;
    const headers = 'Timestamp,Operator,Action,Affected Token,Farmer,Reason,Details\n';
    const rows = logs
      .map(
        (l) =>
          `"${new Date(l.timestamp).toLocaleString}","${l.operatorName || ''}","${l.action}","${
            l.affectedTokenNumber || ''
          }","${l.farmerName || ''}","${(l.reason || '').replace(/"/g, '""')}","${(
            l.details || ''
          ).replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KisanMitra_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click;
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-gov border border-gov-border space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gov-emerald" />
            <h3 className="text-lg font-bold font-outfit text-slate-900">
              {i18n.language === 'hi' ? 'पारदर्शिता एवं ऑडिट लेजर' : 'Mandi Transparency & Audit Ledger'}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {i18n.language === 'hi'
              ? 'अधिकारियों द्वारा की गई प्रत्येक स्थिति वृद्धि और कतार परिवर्तन का पूर्ण लॉग'
              : 'Immutable record of every stage advancement, priority override, and broadcast'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Token Number, Farmer Name, Officer, or Reason..."
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-gov-emerald"
          />
        </div>

        <div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 outline-none"
          >
            <option value="">All Action Types</option>
            <option value="PRIORITY_OVERRIDE">Priority Overrides</option>
            <option value="STAGE_TRANSITION_QUALITY_CHECKED">Quality Check Events</option>
            <option value="STAGE_TRANSITION_ACCEPTED">Acceptance Approvals</option>
            <option value="BULK_MANDI_BROADCAST">Bulk Broadcasts</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-left">Timestamp</th>
              <th className="py-3 px-4 text-left">Officer Name</th>
              <th className="py-3 px-4 text-left">Action</th>
              <th className="py-3 px-4 text-left">Token / Farmer</th>
              <th className="py-3 px-4 text-left">Justification / Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  No audit log entries found matching criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-800">
                    {log.operatorName || 'System'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.action.includes('PRIORITY')
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : log.action.includes('ACCEPTED')
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">{log.affectedTokenNumber || 'N/A'}</div>
                    <div className="text-[10px] text-slate-500">{log.farmerName || 'All Farmers'}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    <div className="font-medium">{log.reason || 'SOP execution'}</div>
                    {log.details && <div className="text-[10px] text-slate-400">{log.details}</div>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
