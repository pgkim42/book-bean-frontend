import Skeleton from './Skeleton';

const BookDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 뒤로가기 버튼 */}
      <Skeleton className="w-24 h-6" />

      {/* 도서 상세 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 이미지 */}
        <Skeleton className="w-full h-96 rounded-lg" />

        {/* 정보 */}
        <div className="space-y-6">
          {/* 카테고리 & 상태 */}
          <div className="flex items-center space-x-2">
            <Skeleton className="w-20 h-7" />
            <Skeleton className="w-16 h-7" />
          </div>

          {/* 제목 */}
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-2/3 h-10" />

          {/* 저자/출판사 */}
          <div className="space-y-2">
            <Skeleton className="w-1/2 h-5" />
            <Skeleton className="w-1/3 h-5" />
            <Skeleton className="w-1/4 h-5" />
          </div>

          {/* 평점 */}
          <div className="flex items-center space-x-2">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-20 h-6" />
          </div>

          {/* 가격 */}
          <Skeleton className="w-32 h-12" />

          {/* 재고 */}
          <Skeleton className="w-28 h-5" />

          {/* 수량 선택 */}
          <div className="space-y-2">
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-32 h-10" />
          </div>

          {/* 버튼들 */}
          <div className="flex space-x-3">
            <Skeleton className="flex-1 h-12" />
            <Skeleton className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* 설명 섹션 */}
      <div className="space-y-4">
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>

      {/* 리뷰 섹션 */}
      <div className="space-y-4">
        <Skeleton className="w-32 h-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="w-24 h-5" />
                <Skeleton className="w-32 h-5" />
              </div>
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetailSkeleton;
