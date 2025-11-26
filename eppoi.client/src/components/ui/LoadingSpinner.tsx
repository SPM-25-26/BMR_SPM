import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Caricamento...' }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center">
        <Loader2 className="w-16 h-16 text-[#0066cc] animate-spin mb-4" />
        <p className="text-[#004d99] text-[18px] sm:text-[20px] font-['Titillium_Web:SemiBold',sans-serif]">
          {message}
        </p>
      </div>
    </div>
  );
}