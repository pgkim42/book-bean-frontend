'use client';

import { ArrowLeft } from 'lucide-react';

/**
 * 뒤로가기 버튼 (클라이언트 컴포넌트)
 */
export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>뒤로가기</span>
    </button>
  );
}
