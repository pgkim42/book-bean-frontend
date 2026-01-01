import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import storage from '../../utils/localStorage';
import { formatPrice } from '../../utils/formatters';

const RecentlyViewedSection = ({ currentBookId }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const items = storage.getRecentlyViewed();
    // 현재 보고 있는 도서는 제외하고 최대 10개만
    const filtered = items.filter((item) => item.id !== currentBookId).slice(0, 10);
    setRecentlyViewed(filtered);
  }, [currentBookId]);

  if (recentlyViewed.length === 0) {
    return null;
  }

  const handleScroll = (direction) => {
    const container = document.getElementById('recently-viewed-container');
    if (!container) return;

    const scrollAmount = 300;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            scrollPosition + scrollAmount
          );

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  return (
    <div className="mt-16 border-t pt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-6 h-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">최근 본 상품</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        id="recently-viewed-container"
        className="flex space-x-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recentlyViewed.map((item) => (
          <Link
            key={item.id}
            to={`/books/${item.id}`}
            className="flex-shrink-0 w-48 group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* 이미지 */}
              <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">이미지 없음</span>
                )}
              </div>

              {/* 정보 */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{item.author}</p>
                <p className="text-lg font-bold text-primary-600">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedSection;
