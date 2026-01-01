import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewHelpfulButton = ({ reviewId, initialCount = 0, initialVoted = false, onVote }) => {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const success = await onVote(reviewId, !voted);
      if (success) {
        if (voted) {
          setCount(count - 1);
          setVoted(false);
          toast.success('투표가 취소되었습니다');
        } else {
          setCount(count + 1);
          setVoted(true);
          toast.success('도움이 되었다고 표시했습니다');
        }
      }
    } catch (error) {
      toast.error('투표에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
        voted
          ? 'bg-primary-50 border-primary-600 text-primary-600'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <ThumbsUp
        className={`w-4 h-4 ${voted ? 'fill-primary-600' : ''}`}
      />
      <span className="text-sm font-medium">도움돼요</span>
      {count > 0 && (
        <span className="text-sm font-bold">{count}</span>
      )}
    </button>
  );
};

export default ReviewHelpfulButton;
