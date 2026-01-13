'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ 
  message = '로딩 중...', 
  fullPage = false 
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary-600" />
          <p className="mt-4 text-warm-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
      <p className="text-warm-500">{message}</p>
    </div>
  );
}

