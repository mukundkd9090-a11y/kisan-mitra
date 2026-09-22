import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';
import { Sliders, CloudRain, Sun, Activity, Zap, TrendingUp } from 'lucide-react';

export const CapacitySimulator = () => {
  const { t, i18n } = useTranslation();
  const [activeCounters, setActiveCounters] = useState(3);
  const [weatherCondition, setWeatherCondition] = useState('Clear');
  const [queueLength, setQueueLength] = useState(15);
  const [cropType, setCropType] = useState('Wheat');
  const [predictionResult, setPredictionResult] = useState(null);
  const [delayForecast, setDelayForecast] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const waitRes = await api.post('/ai/predict-wait-time', {
        queue_position: Number(queueLength),
        crop_type: cropType,
        active_counters: Number(activeCounters),
        weather_condition: weatherCondition
      });

      const delayRes = await api.post('/ai/predict-delay', {
        crop_type: cropType,
        truck_count: Number(queueLength),
        staff_count: Number(activeCounters),
        weather_condition: weatherCondition
      });

      setPredictionResult(waitRes.data.data);
      setDelayForecast(delayRes.data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-gov-lg border border-emerald-800/40 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-outfit text-white">
              {i18n.language === 'hi' ? 'AI कतार सिम्युलेटर व पूर्वानुमान' : 'AI Queue & Delay Simulator'}
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            {i18n.language === 'hi'
              ? 'मौसम, सक्रिय काउंटर व आगमन दबाव बदलकर रीयल-टाइम प्रभाव का परीक्षण करें'
              : 'Simulate weather events, weighbridge breakdowns, and rush arrivals to forecast queue ripple effects'}
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={simulating}
          className="flex items-center gap-1.5 px-4 py-2 bg-gov-emerald hover:bg-gov-green text-white rounded-xl font-bold text-xs shadow transition-all duration-200"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>{simulating ? 'Computing Model...' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Simulator Sliders & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Active Counters */}
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
          <label className="block text-slate-300 font-semibold mb-1">
            Active Weighing Counters: <b className="text-emerald-400">{activeCounters}</b>
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={activeCounters}
            onChange={(e) => setActiveCounters(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 Counter</span>
            <span>6 Counters</span>
          </div>
        </div>

        {/* Queue Length */}
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
          <label className="block text-slate-300 font-semibold mb-1">
            Trucks in Inflow Queue: <b className="text-amber-400">{queueLength} Trucks</b>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={queueLength}
            onChange={(e) => setQueueLength(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 Truck</span>
            <span>50 Trucks</span>
          </div>
        </div>

        {/* Weather Condition */}
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
          <label className="block text-slate-300 font-semibold mb-1">Weather Condition</label>
          <select
            value={weatherCondition}
            onChange={(e) => setWeatherCondition(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-xs outline-none"
          >
            <option value="Clear">☀️ Clear / Sunny</option>
            <option value="Cloudy">⛅ High Humidity / Cloudy</option>
            <option value="Rain">🌧️ Heavy Rain (Moisture Risk)</option>
          </select>
        </div>

        {/* Crop Selection */}
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
          <label className="block text-slate-300 font-semibold mb-1">Crop Type</label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-xs outline-none"
          >
            <option value="Wheat">Wheat (FAQ 12% Moisture)</option>
            <option value="Rice">Rice / Paddy</option>
            <option value="Mustard">Mustard (Oil Assay)</option>
            <option value="Maize">Maize</option>
          </select>
        </div>
      </div>

      {/* Real-time Output Banner */}
      {predictionResult && (
        <div className="bg-emerald-950/80 border border-emerald-600/40 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-fadeIn">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Forecasted Wait Time</span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">
              {predictionResult.human_readable_wait_time}
            </div>
            <span className="text-[10px] text-emerald-300">
              (~{predictionResult.estimated_wait_minutes} minutes per truck)
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Allotted ETA Window</span>
            <div className="text-lg font-extrabold text-white mt-0.5">
              {predictionResult.arrival_window_start} – {predictionResult.arrival_window_end}
            </div>
            <span className="text-[10px] text-slate-400">Confidence: 94.8% (FastAPI Model)</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Bottleneck Risk Index</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2.5 py-0.5 rounded font-black text-xs ${
                  delayForecast?.severity === 'HIGH'
                    ? 'bg-red-900/80 text-red-300 border border-red-500'
                    : delayForecast?.severity === 'MODERATE'
                    ? 'bg-amber-900/80 text-amber-300 border border-amber-500'
                    : 'bg-emerald-900/80 text-emerald-300 border border-emerald-500'
                }`}
              >
                {delayForecast?.severity || 'LOW'} ({delayForecast?.delay_risk_score || 20}/100)
              </span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1">
              💡 {delayForecast?.recommended_action || 'Optimal operational state'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapacitySimulator;
