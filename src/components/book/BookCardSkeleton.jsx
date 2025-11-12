import Skeleton from '../common/Skeleton';

const BookCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 이미지 */}
      <Skeleton className="w-full h-64" />

      {/* 내용 */}
      <div className="p-4 space-y-3">
        {/* 카테고리 */}
        <Skeleton className="w-20 h-6" />

        {/* 제목 */}
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-3/4 h-6" />

        {/* 저자 */}
        <Skeleton className="w-1/2 h-4" />

        {/* 가격 */}
        <Skeleton className="w-24 h-7 mt-2" />

        {/* 버튼들 */}
        <div className="flex gap-2 mt-4">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
