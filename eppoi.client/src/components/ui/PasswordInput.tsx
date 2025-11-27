import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errors?: string[];
  disabled?: boolean;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = 'inserisci la tua password',
  errors = [],
  disabled = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label 
        htmlFor={id} 
        className="block text-[#004080] text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] mb-2"
      >
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-[#0066cc] focus:outline-none text-[15px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif] disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#0066cc] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {errors.length > 0 && (
        <div className="mt-1 space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500 text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif] flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}