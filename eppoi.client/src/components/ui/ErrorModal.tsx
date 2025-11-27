import { XCircle, X } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onRetry: () => void;
  retryLabel?: string;
  cancelLabel?: string;
  isWarning?: boolean;
}

export default function ErrorModal({ 
  isOpen, 
  title, 
  message, 
  onClose, 
  onRetry, 
  retryLabel = 'Riprova', 
  cancelLabel = 'Annulla',
  isWarning = false 
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Error Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className={`${isWarning ? 'bg-yellow-100' : 'bg-red-100'} p-4 rounded-full`}>
            <XCircle className={`w-12 h-12 sm:w-14 sm:h-14 ${isWarning ? 'text-yellow-500' : 'text-red-500'}`} />
          </div>
        </div>

        {/* Error Title */}
        <h3 className="text-[#004d99] text-[20px] sm:text-[24px] font-['Titillium_Web:Bold',sans-serif] text-center mb-3">
          {title}
        </h3>

        {/* Error Message */}
        <p className="text-gray-600 text-[14px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif] text-center mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full bg-[#0066cc] hover:bg-[#004d99] text-white py-3 px-6 rounded-lg text-[16px] sm:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors"
          >
            {retryLabel}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50 py-3 px-6 rounded-lg text-[16px] sm:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}