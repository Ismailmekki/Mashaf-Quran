import React, { useState, useMemo } from "react";
import { Search, Sparkles, BookMarked, Play, Bookmark as BookmarkIcon, Layers, Compass, ArrowLeft } from "lucide-react";
import { SurahMeta, Bookmark } from "../types";
import { SURAHS_LIST, JUZ_NAMES, removeArabicDiacritics } from "../data/surahsData";

interface SurahIndexProps {
  onSelectSurah: (surahNumber: number, initialAyah?: number) => void;
  onPlaySurah: (surahNumber: number) => void;
  bookmarks: Bookmark[];
  onRemoveBookmark: (bookmarkId: string) => void;
  lastRead: { surahNumber: number; ayahNumber: number; surahName: string; page: number } | null;
}

export const SurahIndex: React.FC<SurahIndexProps> = ({
  onSelectSurah,
  onPlaySurah,
  bookmarks,
  onRemoveBookmark,
  lastRead
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "meccan" | "medinan" | "bookmarks" | "juz">("all");
  const [selectedJuz, setSelectedJuz] = useState<number>(1);

  // Filtered Surahs
  const filteredSurahs = useMemo(() => {
    let list = SURAHS_LIST;

    if (filterType === "meccan") {
      list = list.filter((s) => s.revelationType === "Meccan");
    } else if (filterType === "medinan") {
      list = list.filter((s) => s.revelationType === "Medinan");
    } else if (filterType === "juz") {
      list = list.filter((s) => s.juz === selectedJuz);
    }

    if (!searchQuery.trim()) return list;

    const normalizedQuery = removeArabicDiacritics(searchQuery.toLowerCase());
    return list.filter((s) => {
      const normalizedName = removeArabicDiacritics(s.name);
      const englishMatch = s.englishName.toLowerCase().includes(normalizedQuery);
      const translationMatch = s.englishNameTranslation.toLowerCase().includes(normalizedQuery);
      const numberMatch = String(s.number) === normalizedQuery;
      const pageMatch = String(s.page) === normalizedQuery;
      return (
        normalizedName.includes(normalizedQuery) ||
        englishMatch ||
        translationMatch ||
        numberMatch ||
        pageMatch
      );
    });
  }, [searchQuery, filterType, selectedJuz]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-28">
      {/* Last Read Quick Banner with Geometric Balance motif */}
      {lastRead && (
        <div className="mb-6 p-5 bg-[#1A202C] border border-[#C5A059]/40 relative overflow-hidden shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute -right-12 -top-12 w-36 h-36 bg-geometric-hatch opacity-10 pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 border border-[#C5A059] rotate-45 flex items-center justify-center bg-[#12161F] text-[#C5A059] shrink-0 mr-1">
              <BookMarked className="-rotate-45 w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <span className="text-[11px] text-[#C5A059] font-medium tracking-wider uppercase block">
                تابع من حيث توقفت • Last Read
              </span>
              <h3 className="text-lg font-bold text-white font-tajawal">
                سورة {lastRead.surahName} (الآية {lastRead.ayahNumber})
              </h3>
              <p className="text-xs text-stone-400">الصفحة {lastRead.page}</p>
            </div>
          </div>
          <button
            id="btn-resume-last-read"
            onClick={() => onSelectSurah(lastRead.surahNumber, lastRead.ayahNumber)}
            className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-sm relative z-10 border border-[#8B6E3D]"
          >
            <span>متابعة القراءة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Search */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2D3748] pb-3">
          <div>
            <span className="text-[#C5A059] text-[10px] tracking-[0.2em] uppercase font-mono block">
              Holy Quran Index
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal">
              فهرس سور القرآن الكريم
            </h2>
            <p className="text-xs text-stone-400">١١٤ سورة — ٦٢٣٦ آية — ٣٠ جزءاً</p>
          </div>
          <div className="text-xs text-[#C5A059] font-mono border border-[#2D3748] px-3 py-1 bg-[#1A202C] self-start sm:self-auto">
            رواية حفص عن عاصم بالرسم العثماني
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            id="input-search-surahs"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم السورة، رقمها، الصفحة، أو المعنى الإنجليزي..."
            className="w-full py-3 pr-11 pl-4 bg-[#1A202C] border border-[#2D3748] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-stone-100 placeholder-stone-500 text-sm outline-none transition-all"
          />
          <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-300 hover:text-white bg-[#2D3748] px-2 py-0.5 cursor-pointer border border-stone-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Filter Badges with Geometric Balance borders */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            id="filter-all"
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer border ${
              filterType === "all"
                ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748] hover:border-[#C5A059]"
            }`}
          >
            الكل (114)
          </button>
          <button
            id="filter-meccan"
            onClick={() => setFilterType("meccan")}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer border ${
              filterType === "meccan"
                ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748] hover:border-[#C5A059]"
            }`}
          >
            مكية (86)
          </button>
          <button
            id="filter-medinan"
            onClick={() => setFilterType("medinan")}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer border ${
              filterType === "medinan"
                ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748] hover:border-[#C5A059]"
            }`}
          >
            مدنية (28)
          </button>
          <button
            id="filter-juz"
            onClick={() => setFilterType("juz")}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 border ${
              filterType === "juz"
                ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748] hover:border-[#C5A059]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الأجزاء (30)</span>
          </button>
          <button
            id="filter-bookmarks"
            onClick={() => setFilterType("bookmarks")}
            className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 border ${
              filterType === "bookmarks"
                ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748] hover:border-[#C5A059]"
            }`}
          >
            <BookmarkIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>الإشارات المحفوظة ({bookmarks.length})</span>
          </button>
        </div>

        {/* Juz Selector if filter is 'juz' */}
        {filterType === "juz" && (
          <div className="p-3 bg-[#1A202C] border border-[#2D3748] flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-[#C5A059] font-medium whitespace-nowrap">اختر الجزء:</span>
            <div className="flex gap-1.5">
              {JUZ_NAMES.map((name, idx) => {
                const juzNum = idx + 1;
                return (
                  <button
                    key={juzNum}
                    onClick={() => setSelectedJuz(juzNum)}
                    className={`px-3 py-1 text-xs whitespace-nowrap cursor-pointer transition-colors border ${
                      selectedJuz === juzNum
                        ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                        : "bg-[#12161F] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
                    }`}
                  >
                    جزء {juzNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bookmarks Section View */}
      {filterType === "bookmarks" && (
        <div className="space-y-3 mb-6">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 border border-[#2D3748] bg-[#1A202C]/60">
              <BookmarkIcon className="w-12 h-12 text-[#C5A059]/40 mx-auto mb-2" />
              <p className="text-stone-200 font-medium">لا توجد آيات محفوظة بعد</p>
              <p className="text-xs text-stone-500 mt-1">
                يمكنك حفظ أي آية بالضغط على أيقونة الإشارة المرجعية أثناء القراءة
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="p-4 bg-[#1A202C] border border-[#2D3748] hover:border-[#C5A059] transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#12161F] text-[#C5A059] border border-[#8B6E3D]/50 text-xs font-semibold">
                        سورة {bm.surahName}
                      </span>
                      <span className="text-xs text-stone-400">آية {bm.ayahNumber}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(bm.id);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                      title="حذف من المحفوظات"
                    >
                      إزالة
                    </button>
                  </div>
                  <p
                    onClick={() => onSelectSurah(bm.surahNumber, bm.ayahNumber)}
                    className="font-quran text-base sm:text-lg text-stone-200 line-clamp-2 cursor-pointer leading-relaxed group-hover:text-[#E2C785] transition-colors"
                  >
                    «{bm.ayahText}»
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500">
                      {new Date(bm.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                    <button
                      onClick={() => onSelectSurah(bm.surahNumber, bm.ayahNumber)}
                      className="text-xs text-[#C5A059] hover:text-[#E2C785] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>الانتقال للآية</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Surahs List Grid */}
      {filterType !== "bookmarks" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSurahs.map((surah) => {
            return (
              <div
                key={surah.number}
                id={`surah-card-${surah.number}`}
                onClick={() => onSelectSurah(surah.number)}
                className="p-3.5 bg-[#1A202C] hover:bg-[#1f2735] border border-[#2D3748] hover:border-[#C5A059] shadow-sm transition-all duration-200 cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  {/* Signature 45-degree Rotated Diamond Surah Badge */}
                  <div className="w-10 h-10 border border-[#C5A059] rotate-45 flex items-center justify-center bg-[#12161F] group-hover:border-[#E2C785] transition-colors shrink-0 mr-1">
                    <span className="-rotate-45 text-xs font-bold text-[#C5A059] font-mono">
                      {surah.number}
                    </span>
                  </div>

                  {/* Names & Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-white group-hover:text-[#E2C785] font-tajawal transition-colors">
                        سورة {surah.name}
                      </h4>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 font-mono uppercase tracking-wider border ${
                          surah.revelationType === "Meccan"
                            ? "bg-[#12161F] text-[#C5A059] border-[#8B6E3D]/50"
                            : "bg-[#12161F] text-[#81A1C1] border-[#81A1C1]/40"
                        }`}
                      >
                        {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5 font-mono">
                      <span>{surah.englishName}</span>
                      <span>•</span>
                      <span>{surah.numberOfAyahs} آية</span>
                      <span>•</span>
                      <span>ص {surah.page}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Audio Play Button */}
                <button
                  id={`btn-play-surah-${surah.number}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaySurah(surah.number);
                  }}
                  title="استماع للسورة كاملة"
                  className="p-2.5 bg-[#12161F] hover:bg-[#C5A059] text-[#C5A059] hover:text-[#1A202C] border border-[#2D3748] hover:border-[#C5A059] transition-all cursor-pointer opacity-80 group-hover:opacity-100 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {filteredSurahs.length === 0 && filterType !== "bookmarks" && (
        <div className="text-center py-12 text-stone-400">
          <p>لم يتم العثور على نتائج مطابقة لـ "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};
