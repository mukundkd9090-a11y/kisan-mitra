import React from 'react';
import { useTranslation } from 'react-i18next';
import AshokaEmblem from '../components/common/AshokaEmblem';
import { ShieldCheck, Award, Target, CheckCircle2, Cpu, Globe, Users } from 'lucide-react';

export const About = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAF6] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-gov-darkgreen via-gov-emerald to-[#276E2A] text-white rounded-3xl p-8 shadow-gov relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white/10 p-3 rounded-2xl">
            <AshokaEmblem className="h-16 w-auto" />
          </div>
          <div>
            <span className="text-xs font-bold bg-white/20 text-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Digital Agriculture Initiative
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-white mt-1">
              About KisanMitra 
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl">
              Eliminating farmer waiting times and lack of procurement transparency through AI queue forecasting, digital token scheduling, and immutable audit logs.
            </p>
          </div>
        </div>

        {/* Problem Statement Card */}
        <div className="bg-white rounded-3xl p-8 shadow-gov border border-gov-border space-y-4">
          <div className="flex items-center gap-2 text-gov-emerald font-bold text-sm">
            <Target className="w-5 h-5" />
            <span> Problem Statement</span>
          </div>
          <blockquote className="border-l-4 border-gov-emerald pl-4 py-1 italic text-slate-800 font-medium text-sm sm:text-base bg-emerald-50/50 rounded-r-xl">
            “Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status.”
          </blockquote>
          <p className="text-xs text-slate-600 leading-relaxed">
            During seasonal grain harvests, thousands of tractors arrive at Mandis without advance coordination, causing multi-kilometer traffic jams, spoilage of open produce, exploitation by intermediaries, and days of anxious waiting. KisanMitra solves this with an end-to-end digital slot allotment and AI-backed prediction ecosystem.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm space-y-2">
            <div className="text-2xl">🧠</div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">AI Wait-Time & Delay Regression Model</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              FastAPI microservice incorporates moisture test overheads, crop weight profiles, active scale counts, and weather disruptions to give farmers high-precision arrival windows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm space-y-2">
            <div className="text-2xl">⚡</div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">Real-Time WebSocket Synchronization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Socket.IO feeds provide instantaneous status transitions across weighing, lab assaying, lot acceptance, and DBT disbursement without manual browser reloads.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm space-y-2">
            <div className="text-2xl">📶</div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">Zero-Internet SMS 166066 Service</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides complete inclusion for marginal farmers on 2G feature phones via carrier SMS gateway integration.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm space-y-2">
            <div className="text-2xl">👩🏽‍💼</div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">Agya (आज्ञा) Bilingual Voice AI</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive conversational assistant capable of voice read-aloud in Hindi & English for illiterate or visually challenged farmers.
            </p>
          </div>
        </div>

        {/* Technical Architecture Overview */}
        <div className="bg-white rounded-3xl p-8 shadow-gov border border-gov-border space-y-4">
          <h3 className="font-bold text-lg text-slate-900 font-outfit">Technical Architecture Stack</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-extrabold text-gov-emerald block text-sm">React + Vite</span>
              <span className="text-slate-500 text-[11px]">Frontend & Tailwind</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-extrabold text-gov-emerald block text-sm">Node + Express</span>
              <span className="text-slate-500 text-[11px]">Socket.IO & JWT</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-extrabold text-gov-emerald block text-sm">Prisma ORM</span>
              <span className="text-slate-500 text-[11px]">PostgreSQL / SQLite</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-extrabold text-gov-emerald block text-sm">FastAPI (Python)</span>
              <span className="text-slate-500 text-[11px]">Queue ML Model</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
