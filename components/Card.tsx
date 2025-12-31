
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  // Added style property to support inline styles requested by consumers
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, title, className = "", style }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
      style={style}
    >
      {title && (
        <div className="px-6 py-4 border-bottom border-slate-100 font-semibold text-slate-700">
          {title}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};