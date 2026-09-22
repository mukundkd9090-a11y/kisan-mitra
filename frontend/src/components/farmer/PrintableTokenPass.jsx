import React from 'react';
import AshokaEmblem from '../common/AshokaEmblem';
import { QrCode, ShieldCheck } from 'lucide-react';

export const PrintableTokenPass = ({ token }) => {
  if (!token) return null;

  return (
    <div id="printable-token-pass" className="hidden print:block bg-white p-8 max-w-2xl mx-auto border-2 border-black text-black font-sans">
      {/* Official Government Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <AshokaEmblem className="h-16 w-auto" />
        <div className="text-center flex-1 px-4">
          <h2 className="text-xl font-extrabold uppercase tracking-wide">Government of India</h2>
          <h3 className="text-sm font-bold">Ministry of Consumer Affairs, Food & Public Distribution</h3>
          <h4 className="text-base font-black text-emerald-800 mt-1">KISANMITRA – DIGITAL PROCUREMENT GATE PASS</h4>
        </div>
        <div className="text-right text-xs">
          <span className="border border-black px-2 py-1 font-bold">GATE ENTRY</span>
          <p className="mt-1 text-[10px]">{token.tokenDate}</p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="my-6 grid grid-cols-2 gap-4 text-sm">
        <div className="border border-black p-3 rounded">
          <span className="text-xs text-gray-600 block">Token Number:</span>
          <span className="text-xl font-black font-mono">{token.tokenNumber}</span>
        </div>

        <div className="border border-black p-3 rounded">
          <span className="text-xs text-gray-600 block">Allocated Arrival Window:</span>
          <span className="text-lg font-bold">{token.arrivalWindowStart} – {token.arrivalWindowEnd}</span>
        </div>

        <div className="border border-black p-3 rounded">
          <span className="text-xs text-gray-600 block">Farmer Name:</span>
          <span className="text-base font-bold">{token.farmer?.fullName || 'Registered Farmer'}</span>
        </div>

        <div className="border border-black p-3 rounded">
          <span className="text-xs text-gray-600 block">Mobile Number:</span>
          <span className="text-base font-bold">{token.farmer?.mobile || 'Verified'}</span>
        </div>

        <div className="border border-black p-3 rounded col-span-2">
          <span className="text-xs text-gray-600 block">Procurement Mandi Centre:</span>
          <span className="text-base font-bold">{token.centre?.name} ({token.centre?.district}, {token.centre?.state})</span>
        </div>

        <div className="border border-black p-3 rounded">
          <span className="text-xs text-gray-600 block">Crop Type & Est. Quantity:</span>
          <span className="text-base font-bold">{token.cropType} — {token.estimatedQuantity} Quintals</span>
        </div>

        <div className="border border-black p-3 rounded">
          <span className="text-xs text-gray-600 block">MSP 2026 Rate:</span>
          <span className="text-base font-bold">₹{token.mspRate || 2425} / Quintal</span>
        </div>
      </div>

      {/* Verification & Barcode */}
      <div className="border-t-2 border-black pt-4 flex justify-between items-center text-xs">
        <div className="flex items-center gap-3">
          <QrCode className="w-16 h-16 text-black" />
          <div>
            <p className="font-bold">NIC Digital Signature Verified</p>
            <p className="font-mono text-[10px]">TKN-HASH: {token.id}</p>
            <p className="text-[10px] text-gray-600">Bring original Aadhaar and Bank Passbook.</p>
          </div>
        </div>

        <div className="text-right border-t border-black pt-4 w-40">
          <p className="font-bold">Mandi Incharge Seal / Sign</p>
        </div>
      </div>
    </div>
  );
};

export default PrintableTokenPass;
