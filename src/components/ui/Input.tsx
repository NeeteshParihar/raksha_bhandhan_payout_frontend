import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, prefix, suffix, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-bold text-gray-700">
            {label}
          </label>
        )}
        <div className="flex relative">
          {prefix && (
            <div className="inline-flex items-center px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 font-medium">
              {prefix}
            </div>
          )}
          
          <div className="relative flex-1">
            {icon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                {icon}
              </div>
            )}
            <input
              ref={ref}
              className={`
                w-full bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 
                focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all
                disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed
                ${icon ? 'pl-11' : ''} 
                ${error ? 'border-rose-400 focus:ring-rose-400' : ''}
                ${prefix ? 'rounded-r-xl' : suffix ? 'rounded-l-xl' : 'rounded-xl'}
                ${prefix && suffix ? 'rounded-none' : ''}
                ${className}
              `}
              {...props}
            />
          </div>

          {suffix && (
            <div className="inline-flex items-center">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-rose-500 mt-1">
            <AlertCircle size={14} />
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
