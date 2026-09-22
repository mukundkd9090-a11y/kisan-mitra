import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';
import confetti from 'canvas-confetti';
import { X, Sparkles, MapPin, Calendar, Scale, Clock, CheckCircle } from 'lucide-react';

const CROPS = [
  { name: 'Wheat', hi: 'गेहूं', msp: 2425, moistureLimit: '12%' },
  { name: 'Rice', hi: 'चावल', msp: 2300, moistureLimit: '14%' },
  { name: 'Paddy', hi: 'धान', msp: 2320, moistureLimit: '14%' },
  { name: 'Mustard', hi: 'सरसों', msp: 5950, moistureLimit: '8%' },
  { name: 'Maize', hi: 'मक्का', msp: 2225, moistureLimit: '12%' },
  { name: 'Pulses (Gram/Arhar)', hi: 'चना / दालें', msp: 7000, moistureLimit: '10%' },
  { name: 'Sugarcane', hi: 'गन्ना', msp: 340, moistureLimit: 'Standard' }
];

export const GenerateTokenModal = ({ isOpen, onClose, onTokenCreated, defaultState }) => {
  const { t, i18n } = useTranslation();
  const [statesData, setStatesData] = useState({});
  const [selectedState, setSelectedState] = useState(defaultState || 'Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [cropType, setCropType] = useState('Wheat');
  const [quantity, setQuantity] = useState(30);
  const [tokenDate, setTokenDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [error, setError] = useState('');

  // Fetch states and centres
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get('/centres/states');
        setStatesData(res.data.states || {});
        if (!selectedDistrict && res.data.states[selectedState]) {
          setSelectedDistrict(res.data.states[selectedState][0]);
        }
      } catch (err) {
        console.error('Error loading states:', err);
      }
    };
    fetchStates();
  }, [selectedState]);

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await api.get(`/centres?state=${encodeURIComponent(selectedState)}`);
        setCentres(res.data.centres || []);
        if (res.data.centres && res.data.centres.length > 0) {
          setSelectedCentreId(res.data.centres[0].id);
        }
      } catch (err) {
        console.error('Error fetching centres:', err);
      }
    };
    if (selectedState) {
      fetchCentres();
    }
  }, [selectedState]);

  // Real-time AI slot estimate preview
  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await api.post('/ai/predict-wait-time', {
          queue_position: 4,
          crop_type: cropType,
          quantity_quintals: Number(quantity) || 25,
          active_counters: 3
        });
        setAiPreview(res.data.data);
      } catch (e) {
        console.log('AI preview fetch fallback');
      }
    };
    fetchEstimate();
  }, [cropType, quantity]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/tokens/generate', {
        centreId: selectedCentreId,
        cropType,
        estimatedQuantity: Number(quantity),
        tokenDate
      });

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onTokenCreated(res.data.token);
      onClose();
    } catch (err) {
      console.error('Token generation error:', err);
      setError(err.response?.data?.message || 'Error generating token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentCropMeta = CROPS.find((c) => c.name === cropType) || CROPS[0];
  const estimatedPayout = (Number(quantity) || 0) * currentCropMeta.msp;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gov-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-gov-darkgreen via-gov-emerald to-emerald-700 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="text-lg font-bold font-outfit text-white">
                {i18n.language === 'hi' ? 'नया डिजिटल टोकन स्लॉट बुक करें' : 'Book Digital Procurement Slot'}
              </h3>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              {i18n.language === 'hi' ? 'AI आधारित अनुमानित आगमन समय और कतार आवंटन' : 'AI-Optimized Arrival Window Allocation'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* State & District Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {i18n.language === 'hi' ? 'राज्य (State)' : 'State'}
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-gov-emerald focus:border-transparent outline-none"
              >
                {Object.keys(statesData).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {i18n.language === 'hi' ? 'जिला (District)' : 'District'}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-gov-emerald outline-none"
              >
                {(statesData[selectedState] || []).map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Procurement Centre Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{i18n.language === 'hi' ? 'प्रोक्योरमेंट मंडी केंद्र' : 'Procurement Mandi Centre'}</span>
              <span className="text-[10px] text-gov-emerald font-semibold">
                {centres.length} {i18n.language === 'hi' ? 'केंद्र उपलब्ध' : 'Centres Live'}
              </span>
            </label>
            <select
              value={selectedCentreId}
              onChange={(e) => setSelectedCentreId(e.target.value)}
              required
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-gov-emerald outline-none"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district}) - {c.activeQueueCount} {i18n.language === 'hi' ? 'कतार में' : 'in queue'}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Type & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('farmer.crop')}
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-gov-emerald outline-none"
              >
                {CROPS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {i18n.language === 'hi' ? c.hi : c.name} (MSP: ₹{c.msp}/Qtl)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {i18n.language === 'hi' ? 'अनुमानित मात्रा (क्विंटल)' : 'Est. Quantity (Quintals)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-gov-emerald outline-none pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">Qtl</span>
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {i18n.language === 'hi' ? 'आगमन की तारीख (Preferred Date)' : 'Preferred Arrival Date'}
            </label>
            <input
              type="date"
              value={tokenDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setTokenDate(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-gov-emerald outline-none"
            />
          </div>

          {/* Real-time AI Forecast Preview Banner */}
          {aiPreview && (
            <div className="bg-gradient-to-r from-emerald-50 to-[#EDF7EA] border border-emerald-300 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-gov-emerald">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{i18n.language === 'hi' ? 'AI अनुमानित आगमन स्लॉट' : 'AI Projected Arrival Slot'}</span>
                </div>
                <span className="text-[10px] bg-emerald-200/80 text-gov-darkgreen font-bold px-2 py-0.5 rounded">
                  94% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">{i18n.language === 'hi' ? 'आवंटित स्लॉट' : 'Arrival Window'}</span>
                  <span className="font-extrabold text-slate-800">
                    {aiPreview.arrival_window_start} – {aiPreview.arrival_window_end}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">{i18n.language === 'hi' ? 'अनुमानित कुल MSP' : 'Estimated DBT MSP'}</span>
                  <span className="font-extrabold text-gov-emerald">
                    ₹{estimatedPayout.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {i18n.language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCentreId}
              className="flex-2 py-3 px-6 text-xs font-bold text-white bg-gov-emerald hover:bg-gov-green disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Generating Token...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>{i18n.language === 'hi' ? 'टोकन जारी करें' : 'Generate Digital Token'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateTokenModal;
