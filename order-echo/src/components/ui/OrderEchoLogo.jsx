import React from 'react';

const OrderEchoLogo = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  const iconSize = {
    small: 'w-3 h-3',
    default: 'w-5 h-5',
    large: 'w-8 h-8',
    xlarge: 'w-10 h-10'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chef's Hat */}
        <path
          d="M30 25 C30 20, 35 15, 50 15 C65 15, 70 20, 70 25 L70 35 C70 40, 65 45, 50 45 C35 45, 30 40, 30 35 Z"
          fill="currentColor"
          className="text-gray-800"
        />
        
        {/* Chef's Hat Band */}
        <rect
          x="25"
          y="35"
          width="50"
          height="8"
          fill="currentColor"
          className="text-gray-800"
        />
        
        {/* Audio Waveform */}
        <g transform="translate(0, 60)">
          {/* Waveform bars */}
          <rect x="10" y="20" width="4" height="8" fill="currentColor" className="text-gray-800" />
          <rect x="16" y="15" width="4" height="18" fill="currentColor" className="text-gray-800" />
          <rect x="22" y="10" width="4" height="28" fill="currentColor" className="text-gray-800" />
          <rect x="28" y="5" width="4" height="38" fill="currentColor" className="text-gray-800" />
          <rect x="34" y="8" width="4" height="32" fill="currentColor" className="text-gray-800" />
          <rect x="40" y="12" width="4" height="24" fill="currentColor" className="text-gray-800" />
          <rect x="46" y="15" width="4" height="18" fill="currentColor" className="text-gray-800" />
          <rect x="52" y="18" width="4" height="12" fill="currentColor" className="text-gray-800" />
          <rect x="58" y="20" width="4" height="8" fill="currentColor" className="text-gray-800" />
          <rect x="64" y="22" width="4" height="4" fill="currentColor" className="text-gray-800" />
        </g>
      </svg>
    </div>
  );
};

export default OrderEchoLogo;
