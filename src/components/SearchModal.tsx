import React, { useState, useEffect } from "react";
import { Search, X, BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { searchQuranText, SearchResult } from "../services/quranApi";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (surahNumber: number, ayahNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchQuranText(query);
      setResults(res.results);
      setTotalCount(res.total);
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#1A202C] border border-[#C5A059]/40 w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl mt-8 sm:mt-0">
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#2D3748] flex items-center gap-3 bg-[#12161F]">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input
            id="input-quran-live-search"
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أي كلمة أو جزء من آية في القرآن الكريم..."
            className="w-full bg-transparent text-stone-100 placeholder-stone-500 text-sm sm:text-base outline-none font-tajawal"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#C5A059] animate-spin shrink-0" />}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-[#C5A059] hover:text-white bg-[#1A202C] border border-[#2D3748] px-2 py-1 cursor-pointer font-mono"
            >
              مسح
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 bg-[#1A202C] border border-[#2D3748] text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Info */}
        {query.trim().length >= 2 && !loading && (
          <div className="px-5 py-2 bg-[#12161F] border-b border-[#2D3748] text-xs text-stone-400 flex items-center justify-between font-mono">
            <span>
              عدد النتائج المطابقة: <strong className="text-[#C5A059] font-mono">{totalCount}</strong> آية
            </span>
            <span className="text-[#C5A059]/80">رواية حفص عن عاصم</span>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectResult(item.surahNumber, item.ayahNumber);
                  onClose();
                }}
                className="p-4 bg-[#12161F] hover:bg-[#1f2735] border border-[#2D3748] hover:border-[#C5A059] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span className="font-bold text-[#C5A059] font-tajawal">
                    سورة {item.surahName} (آية {item.ayahNumber})
                  </span>
                  <span className="text-stone-500 flex items-center gap-1 text-[11px] group-hover:text-[#C5A059] font-mono">
                    <span>انتقال للمصحف</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                  </span>
                </div>
                <p className="font-quran text-base sm:text-lg text-stone-200 leading-relaxed group-hover:text-stone-100 transition-colors">
                  «{item.text}»
                </p>
              </div>
            ))
          ) : query.trim().length >= 2 && !loading ? (
            <div className="py-12 text-center text-stone-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#C5A059]" />
              <p>لم نجد أي آية تحتوي على "{query}"</p>
              <p className="text-xs text-stone-600 mt-1">تأكد من كتابة الكلمة بشكل صحيح</p>
            </div>
          ) : (
            <div className="py-12 text-center text-stone-500">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#C5A059]" />
              <p className="text-sm">اكتب كلمتين على الأقل لبدء البحث الفوري في المصحف كاملاً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
