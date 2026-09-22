import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

export const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAF6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl shadow-gov border border-gov-border space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
        <div className="flex items-center gap-2 text-gov-emerald font-bold">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="text-2xl font-black font-outfit text-slate-900">Privacy Policy</h1>
        </div>
        <p className="text-xs text-slate-500">Last updated: 2026 Edition</p>

        <h2 className="text-base font-bold text-slate-900 mt-4">1. Information Collection & Usage</h2>
        <p>
          KisanMitra collects farmer details including Name, Mobile Number, State, District, Village, and Land Record metadata solely for the purpose of managing procurement queues, assigning arrival slots, and executing Direct Benefit Transfers (DBT) via Aadhaar-linked payment bridges (PFMS).
        </p>

        <h2 className="text-base font-bold text-slate-900 mt-4">2. Data Security & Encryption</h2>
        <p>
          All communications between farmer mobile clients, Mandi gate inspection nodes, and our FastAPI microservices are encrypted via TLS 1.3. Direct Benefit Transfer requests comply with national guidelines from the Reserve Bank of India (RBI) and National Payments Corporation of India (NPCI).
        </p>

        <h2 className="text-base font-bold text-slate-900 mt-4">3. Public Audit Transparency</h2>
        <p>
          To maintain anti-corruption integrity and ensure fair queue management, queue priority shifts and officer override decisions are stored in immutable audit logs accessible by the Central Vigilance Commission (CVC) and Mandi Directors.
        </p>
      </div>
    </div>
  );
};

export const Terms = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl shadow-gov border border-gov-border space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
        <div className="flex items-center gap-2 text-gov-emerald font-bold">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="text-2xl font-black font-outfit text-slate-900">Terms of Service</h1>
        </div>
        <p className="text-xs text-slate-500">Official Mandi Rules</p>

        <h2 className="text-base font-bold text-slate-900 mt-4">1. Digital Token Validity</h2>
        <p>
          Digital tokens generated through the KisanMitra portal are valid only for the designated procurement centre and allotted arrival window. Farmers are advised to report 15 minutes before the arrival window start time.
        </p>

        <h2 className="text-base font-bold text-slate-900 mt-4">2. Quality & Moisture Adherence</h2>
        <p>
          Produce brought to procurement centres must adhere to Fair Average Quality (FAQ) standards and permissible moisture limits (Wheat: ≤12%, Rice: ≤14%, Mustard: ≤8%). Produce exceeding moisture thresholds will be flagged by the assay lab.
        </p>

        <h2 className="text-base font-bold text-slate-900 mt-4">3. Fair Queueing SOP</h2>
        <p>
          Queue numbers are assigned chronologically. Any elevation of tokens requires mandatory officer justification for audit compliance.
        </p>
      </div>
    </div>
  );
};
