import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';
import type { InputProps } from './Input';

export interface PhoneNumberProps extends Omit<InputProps, 'type'> {
  mode?: 'input' | 'display';
  value?: string | number; // for display mode
}

export const PhoneNumber = forwardRef<HTMLInputElement, PhoneNumberProps>(
  ({ mode = 'input', value, className = '', ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsVisible(!isVisible);
    };

    if (mode === 'display') {
      const displayValue = String(value || '');
      const maskedValue = '*'.repeat(Math.max(0, displayValue.length - 4)) + displayValue.slice(-4);
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <span>{isVisible ? displayValue : maskedValue}</span>
          <button 
            type="button"
            onClick={toggleVisibility} 
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            title={isVisible ? "Hide phone number" : "Show phone number"}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      );
    }

    return (
      <Input
        ref={ref}
        type={isVisible ? "tel" : "password"}
        {...props}
        suffix={
          <button
            type="button"
            onClick={toggleVisibility}
            className="px-4 py-3 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center h-full transition-colors"
            title={isVisible ? "Hide phone number" : "Show phone number"}
          >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
      />
    );
  }
);

PhoneNumber.displayName = 'PhoneNumber';
