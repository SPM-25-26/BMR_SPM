import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onAction: () => void;
  actionLabel?: string;
}

export default function SuccessModal({ 
  isOpen, 
  title, 
  message, 
  onAction, 
  actionLabel = 'Accedi'
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-green-500" />
          </div>
        </div>

        {/* Success Title */}
        <h3 className="text-[#004d99] text-[20px] sm:text-[24px] font-['Titillium_Web:Bold',sans-serif] text-center mb-3">
          {title}
        </h3>

        {/* Success Message */}
        <p className="text-gray-600 text-[14px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif] text-center mb-6">
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={onAction}
          className="w-full bg-[#0066cc] hover:bg-[#004d99] text-white py-3 px-6 rounded-lg text-[16px] sm:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}