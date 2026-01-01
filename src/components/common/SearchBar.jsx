import { useState } from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

const SearchBar = ({ onSearch, placeholder = '검색어를 입력하세요' }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      <Button type="submit">검색</Button>

      {keyword && (
        <Button type="button" variant="secondary" onClick={handleClear}>
          초기화
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
