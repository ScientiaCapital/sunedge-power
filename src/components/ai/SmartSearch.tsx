import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { searchContent } from '@/lib/ai-services';
import { AI_CONFIG } from '@/lib/ai-config';

// Searchable content for the site
const SITE_CONTENT = [
  {
    title: 'Commercial Solar Solutions',
    description:
      'Large-scale installations for businesses, warehouses, and manufacturing facilities',
    url: '#services',
    keywords: ['commercial', 'business', 'warehouse', 'manufacturing', 'industrial'],
  },
  {
    title: 'Solar Farms & Ground Mounts',
    description: 'Utility-scale solar farms and ground mount systems across multiple states',
    url: '#services',
    keywords: ['solar farm', 'ground mount', 'utility scale', 'land', 'acres'],
  },
  {
    title: 'Multi-Family Solar',
    description: 'Specialized solar solutions for apartment complexes and multi-family properties',
    url: '#services',
    keywords: ['apartment', 'multi-family', 'complex', 'property', 'units'],
  },
  {
    title: 'Get a Free Quote',
    description: 'Contact us for a customized solar solution and ROI analysis',
    url: '#contact',
    keywords: ['quote', 'price', 'cost', 'estimate', 'contact', 'roi'],
  },
  {
    title: 'About SunEdge Power',
    description: '18+ years of experience in commercial solar installations nationwide',
    url: '#about',
    keywords: ['about', 'experience', 'history', 'company', 'nationwide'],
  },
  {
    title: 'Solar Incentives & Tax Credits',
    description: 'Federal and state incentives for commercial solar projects',
    url: '#services',
    keywords: ['incentive', 'tax', 'credit', 'itc', 'rebate', 'savings'],
  },
  {
    title: 'Project Portfolio',
    description: 'View our completed commercial solar installations',
    url: '#portfolio',
    keywords: ['portfolio', 'projects', 'examples', 'case study', 'completed'],
  },
  {
    title: 'Solar ROI Calculator',
    description: 'Calculate your potential savings with commercial solar',
    url: '#calculator',
    keywords: ['calculator', 'roi', 'savings', 'payback', 'investment'],
  },
];

interface SearchResult {
  title: string;
  description: string;
  url: string;
  relevance?: number;
}

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      // Escape to close
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      if (AI_CONFIG.enableSearch) {
        // Use AI-powered search
        const searchableContent = SITE_CONTENT.map(
          (item) => `${item.title} - ${item.description} - ${item.keywords.join(' ')}`,
        );

        const aiResults = await searchContent(searchQuery, searchableContent);

        // Map AI results back to our content structure
        const mappedResults = aiResults
          .map((result) => {
            const index = searchableContent.indexOf(result);
            return index !== -1 ? SITE_CONTENT[index] : null;
          })
          .filter(Boolean) as SearchResult[];

        setResults(mappedResults);
      } else {
        // Fallback to keyword search
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = SITE_CONTENT.filter(
          (item) =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.keywords.some((keyword) => keyword.includes(lowerQuery)),
        );
        setResults(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to basic search
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = SITE_CONTENT.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery),
      );
      setResults(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (url: string) => {
    setIsOpen(false);
    setQuery('');
    const element = document.querySelector(url);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Trigger */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-full transition-all duration-200 group"
      >
        <Search className="h-4 w-4 text-gray-400 group-hover:text-solar-400" />
        <span className="text-sm text-gray-400 group-hover:text-gray-300">Search...</span>
        <kbd className="hidden sm:inline-flex items-center space-x-1 text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 right-0 w-full max-w-md mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden z-50"
            >
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for solar solutions, services, quotes..."
                  className="w-full pl-12 pr-12 py-4 bg-transparent border-0 text-white placeholder:text-gray-500 focus:ring-0"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {(query || isSearching) && (
                <div className="border-t border-gray-800">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-solar-400" />
                    </div>
                  ) : results.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {results.map((result, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultClick(result.url)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium group-hover:text-solar-400 transition-colors">
                                {result.title}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">{result.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-solar-400 transition-colors" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-gray-400">No results found for "{query}"</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Try searching for "solar farms", "commercial", or "quote"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Search Tips */}
              {!query && !isSearching && (
                <div className="px-4 py-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    {AI_CONFIG.enableSearch ? (
                      <>AI-powered search • Natural language supported</>
                    ) : (
                      <>Quick search • Press ESC to close</>
                    )}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;
