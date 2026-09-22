import React from 'react';

export const AshokaEmblem = ({ className = "h-12 w-auto" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 4 Lions Silhouette Representation */}
      <path
        d="M50 8C43 8 38 13 36 20C32 20 28 24 28 29C28 35 32 40 36 42C36 47 40 52 46 54V58C40 60 35 65 34 72H66C65 65 60 60 54 58V54C60 52 64 47 64 42C68 40 72 35 72 29C72 24 68 20 64 20C62 13 57 8 50 8Z"
        fill="#B8860B"
      />
      <circle cx="50" cy="28" r="4" fill="#8B6508" />
      <circle cx="38" cy="30" r="3" fill="#8B6508" />
      <circle cx="62" cy="30" r="3" fill="#8B6508" />
      {/* Ashoka Chakra in Abacus */}
      <rect x="25" y="74" width="50" height="14" rx="2" fill="#B8860B" />
      <circle cx="50" cy="81" r="5" fill="#0D47A1" />
      <circle cx="50" cy="81" r="1.5" fill="#FFFFFF" />
      {/* Base Pedestal / Lotus motif */}
      <path
        d="M20 90C20 90 32 94 50 94C68 94 80 90 80 90L84 100H16L20 90Z"
        fill="#8B6508"
      />
      <rect x="12" y="102" width="76" height="5" rx="1.5" fill="#5C4308" />
      <text
        x="50"
        y="116"
        fontSize="7.5"
        fontWeight="bold"
        textAnchor="middle"
        fill="#144517"
        fontFamily="'Noto Sans Devanagari', sans-serif"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
};

export default AshokaEmblem;
