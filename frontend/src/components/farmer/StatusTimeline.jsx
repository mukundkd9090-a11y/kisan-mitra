import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, AlertCircle, Scale, ShieldCheck, Banknote, FileCheck, XCircle } from 'lucide-react';

const STAGE_ORDER = [
  'GENERATED',
  'DOCS_VERIFIED',
  'PRODUCE_RECEIVED',
  'QUALITY_CHECKED',
  'ACCEPTED',
  'PAYMENT_PROCESSED'
];

export const StatusTimeline = ({ token }) => {
  const { t, i18n } = useTranslation();

  if (!token) return null;

  const currentStageIndex = STAGE_ORDER.indexOf(token.stage);
  const isRejected = token.stage === 'REJECTED';

  const stagesMeta = [
    {
      key: 'GENERATED',
      icon: FileCheck,
      title: i18n.language === 'hi' ? 'टोकन जारी हुआ' : 'Token Generated',
      desc: i18n.language === 'hi' ? 'डिजिटल स्लॉट आवंटित' : 'Digital slot assigned'
    },
    {
      key: 'DOCS_VERIFIED',
      icon: ShieldCheck,
      title: i18n.language === 'hi' ? 'दस्तावेज़ सत्यापन' : 'Documents Verified',
      desc: i18n.language === 'hi' ? 'आधार व खसरा प्रमाणित' : 'Aadhaar & Land records verified'
    },
    {
      key: 'PRODUCE_RECEIVED',
      icon: Scale,
      title: i18n.language === 'hi' ? 'वे-ब्रिज पर वजन' : 'Produce at Weighbridge',
      desc: token.netWeightQuintal
        ? `${token.netWeightQuintal} Qtl Recorded`
        : (i18n.language === 'hi' ? 'सकल वजन प्रविष्टि' : 'Gross/Tare weight logged')
    },
    {
      key: 'QUALITY_CHECKED',
      icon: CheckCircle2,
      title: i18n.language === 'hi' ? 'गुणवत्ता व नमी जांच' : 'Quality & Moisture Lab',
      desc: token.moisturePercent
        ? `Moisture: ${token.moisturePercent}%, Grade: ${token.qualityGrade || 'FAQ'}`
        : (i18n.language === 'hi' ? 'प्रयोगशाला परीक्षण' : 'Assay lab test')
    },
    {
      key: 'ACCEPTED',
      icon: isRejected ? XCircle : CheckCircle2,
      title: isRejected
        ? (i18n.language === 'hi' ? 'फसल अस्वीकृत' : 'Produce Rejected')
        : (i18n.language === 'hi' ? 'फसल स्वीकृति' : 'Produce Accepted'),
      desc: isRejected
        ? (token.remarks || 'Moisture / foreign matter over limit')
        : (i18n.language === 'hi' ? 'मंडी द्वारा लॉट स्वीकृत' : 'Lot officially accepted into warehouse')
    },
    {
      key: 'PAYMENT_PROCESSED',
      icon: Banknote,
      title: i18n.language === 'hi' ? 'DBT भुगतान' : 'DBT Payment Dispatched',
      desc: token.totalPayout
        ? `₹${Number(token.totalPayout).toLocaleString('en-IN')} credited to bank`
        : (i18n.language === 'hi' ? '24 घंटे में बैंक खाते में' : 'PFMS Direct Benefit Transfer')
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-gov border border-gov-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-outfit">
            {i18n.language === 'hi' ? 'प्रोक्योरमेंट प्रगति टाइमलाइन' : 'Procurement Lifecycle Tracker'}
          </h3>
          <p className="text-xs text-slate-500">
            {i18n.language === 'hi' ? 'लाइव सॉकेट आधारित वास्तविक समय स्थिति' : 'Real-time WebSocket synchronized state ledger'}
          </p>
        </div>

        <span className="text-xs font-bold text-gov-emerald bg-gov-lightgreen px-3 py-1 rounded-full border border-gov-emerald/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gov-emerald animate-ping" />
          {i18n.language === 'hi' ? 'लाइव मॉनिटरिंग' : 'Live Sync'}
        </span>
      </div>

      {/* Vertical / Responsive Stepper Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {stagesMeta.map((st, index) => {
          const Icon = st.icon;
          const isCompleted = index < currentStageIndex || (token.stage === 'PAYMENT_PROCESSED' && index === 5);
          const isCurrent = index === currentStageIndex && !isRejected;
          const isFailed = isRejected && st.key === 'ACCEPTED';

          let bubbleStyle = 'bg-slate-100 text-slate-400 border-slate-300';
          if (isCompleted) {
            bubbleStyle = 'bg-gov-emerald text-white border-gov-emerald shadow-sm';
          } else if (isCurrent) {
            bubbleStyle = 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-100 animate-pulse';
          } else if (isFailed) {
            bubbleStyle = 'bg-red-600 text-white border-red-700 ring-4 ring-red-100';
          }

          return (
            <div key={st.key} className="relative flex items-start gap-4 group">
              {/* Timeline Node Bubble */}
              <div
                className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${bubbleStyle}`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              {/* Step Content */}
              <div
                className={`flex-1 p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : isCompleted
                    ? 'bg-[#F7FAF6] border-emerald-200'
                    : isFailed
                    ? 'bg-red-50 border-red-300'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-bold text-sm ${
                      isCurrent
                        ? 'text-amber-950'
                        : isCompleted
                        ? 'text-gov-emerald'
                        : isFailed
                        ? 'text-red-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {st.title}
                  </h4>

                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ {i18n.language === 'hi' ? 'पूर्ण' : 'Passed'}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      {i18n.language === 'hi' ? 'प्रक्रियाधीन' : 'In Progress'}
                    </span>
                  )}
                  {isFailed && (
                    <span className="text-[10px] font-bold text-red-800 bg-red-200 px-2 py-0.5 rounded-full">
                      ✕ {i18n.language === 'hi' ? 'अस्वीकृत' : 'Rejected'}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-snug">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
