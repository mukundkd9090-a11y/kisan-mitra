import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const { t, i18n } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', queryType: 'Grievance', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-gov-emerald uppercase tracking-wider bg-gov-lightgreen px-3 py-1 rounded-full border border-gov-emerald/30">
            {i18n.language === 'hi' ? '24x7 किसान सहायता एवं संपर्क' : '24x7 Farmer Helpline & Support'}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
            {i18n.language === 'hi' ? 'संपर्क एवं शिकायत निवारण पोर्टल' : 'Contact & Grievance Directorate'}
          </h1>
          <p className="text-xs text-slate-500">
            Ministry of Consumer Affairs, Food & Public Distribution • Digital Agriculture Initiative
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Toll Free Card */}
          <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
              📞
            </div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">Toll-Free Helpline</h3>
            <div className="text-xl font-black text-gov-emerald font-mono">1800-180-1551</div>
            <p className="text-[11px] text-slate-500">Kisan Call Center (Operational in 22 languages)</p>
          </div>

          {/* Email Support */}
          <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto text-xl font-bold">
              ✉️
            </div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">Official Email</h3>
            <div className="text-sm font-bold text-blue-700">support@kisanmitra.gov.in</div>
            <p className="text-[11px] text-slate-500">Direct escalation to Directorate Desk</p>
          </div>

          {/* SMS Gateway */}
          <div className="bg-white p-6 rounded-3xl border border-gov-border shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-gov-emerald flex items-center justify-center mx-auto text-xl font-bold">
              💬
            </div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">SMS Pull Gateway</h3>
            <div className="text-xl font-black text-gov-darkgreen font-mono">166066</div>
            <p className="text-[11px] text-slate-500">Send KISAN &lt;TokenNumber&gt;</p>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-gov border border-gov-border max-w-2xl mx-auto">
          <h3 className="font-bold text-lg text-slate-900 font-outfit mb-4">
            {i18n.language === 'hi' ? 'शिकायत या पूछताछ दर्ज करें' : 'Submit Grievance or Inquiry'}
          </h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-gov-emerald mx-auto" />
              <h4 className="font-bold text-base text-gov-emerald">Grievance Registered Successfully</h4>
              <p className="text-xs text-slate-600">
                Ticket Reference: <b>GRV-2026-{Math.floor(100000 + Math.random * 900000)}</b>. Our Mandi Liaison Officer will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9811223344"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inquiry Category</label>
                <select
                  value={form.queryType}
                  onChange={(e) => setForm({ ...form, queryType: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 outline-none"
                >
                  <option value="Grievance">Mandi Delay / Queue Disruption</option>
                  <option value="Quality">Moisture / Grade Re-testing Request</option>
                  <option value="Payment">DBT Payment Status Delay</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Message</label>
                <textarea
                  required
                  rows="3"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Provide details about your token number or Mandi center..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gov-emerald hover:bg-gov-green text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
