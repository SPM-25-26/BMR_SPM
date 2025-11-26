import { AlertCircle } from 'lucide-react';

interface ValidationErrorsListProps {
  errors: string[];
}

export default function ValidationErrorsList({ errors }: ValidationErrorsListProps) {
  if (errors.length === 0) return null;

  return (
    <div className="mt-1 space-y-1">
      {errors.map((error, index) => (
        <p key={index} className="text-red-500 text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif] flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </p>
      ))}
    </div>
  );
}