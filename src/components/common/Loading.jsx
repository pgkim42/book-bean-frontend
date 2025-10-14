import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary-600" />
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
};

export default Loading;
