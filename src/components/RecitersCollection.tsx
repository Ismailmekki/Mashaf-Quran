import React, { useState, useMemo, useEffect } from "react";
import {
  Mic,
  Play,
  Pause,
  Check,
  Search,
  Volume2,
  BookOpen,
  MapPin,
  Music,
  Headphones,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { Reciter } from "../types";
import { RECITERS_LIST, getSurahAudioUrl } from "../data/recitersData";
import { SURAHS_LIST } from "../data/surahsData";

interface RecitersCollectionProps {
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  onPlaySurahWithReciter: (surahNumber: number, reciter: Reciter) => void;
  onOpenQuranReader: (surahNumber: number) => void;
}

export const RecitersCollection: React.FC<RecitersCollectionProps> = ({
  selectedReciter,
  onSelectReciter,
  onPlaySurahWithReciter,
  onOpenQuranReader
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [previewSurahNumber, setPreviewSurahNumber] = useState<number>(1);
  const [previewAudioReciterId, setPreviewAudioReciterId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  const categories = [
    { id: "all", label: `جميع القراء (${RECITERS_LIST.length})` },
    { id: "haramain", label: "أئمة الحرمين الشريفين" },
    { id: "murattal", label: "المصاحف المرتلة والتلاوات العذبة" },
    { id: "mujawwad", label: "المصاحف المجودة والمحافل" },
    { id: "teacher", label: "المصاحف المعلمة (للتحفيظ والتلقين)" }
  ];

  const filteredReciters = useMemo(() => {
    let list = RECITERS_LIST;

    if (activeCategory !== "all") {
      list = list.filter((r) => r.style === activeCategory);
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (r) =>
        r.name.includes(q) ||
        r.englishName.toLowerCase().includes(q) ||
        (r.riwayah && r.riwayah.includes(q)) ||
        (r.location && r.location.includes(q))
    );
  }, [activeCategory, searchQuery]);

  const handleTogglePreviewAudio = (reciter: Reciter) => {
    if (previewAudioReciterId === reciter.id && audioElement) {
      audioElement.pause();
      setPreviewAudioReciterId(null);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audioUrl = getSurahAudioUrl(previewSurahNumber, reciter);
    const newAudio = new Audio(audioUrl);
    newAudio.play().then(() => {
      setPreviewAudioReciterId(reciter.id);
      setAudioElement(newAudio);
    }).catch(() => {
      setPreviewAudioReciterId(null);
    });

    newAudio.onended = () => {
      setPreviewAudioReciterId(null);
    };
  };

  const getStyleBadge = (style?: string) => {
    switch (style) {
      case "mujawwad":
        return { label: "مجود", bg: "bg-amber-950/70 text-amber-300 border-amber-500/40" };
      case "teacher":
        return { label: "مصحف معلم", bg: "bg-indigo-950/70 text-indigo-300 border-indigo-500/40" };
      case "haramain":
        return { label: "إمام الحرم", bg: "bg-[#C5A059]/20 text-[#E2C785] border-[#C5A059]/50" };
      case "murattal":
      default:
        return { label: "مرتل", bg: "bg-emerald-950/70 text-emerald-300 border-emerald-500/40" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Banner Header with Geometric Balance motif */}
      <div className="p-6 sm:p-8 bg-[#1A202C] border border-[#C5A059]/40 relative overflow-hidden shadow-xl text-center sm:text-right">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-geometric-hatch opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12161F] border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono uppercase tracking-widest mb-2">
              <Mic className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>مكتبة القراء الكبرى (40 قارئاً معتمداً)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-tajawal">
              نخبة قراء العالم الإسلامي والحرمين
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
              تلاوات صوتية نقية وعالية الجودة لكبار المشايخ وقراء الحرمين الشريفين، تشمل التلاوات الخاشعة (وديع اليمني، إسلام صبحي، هزاع البلوشي، خالد الجليل) والمصاحف المعلمة والمجودة.
            </p>
          </div>

          {/* Active Reciter Quick Card */}
          <div className="p-3.5 bg-[#12161F] border border-[#C5A059] flex items-center gap-3 shrink-0 shadow-sm text-right">
            <div className="w-10 h-10 bg-[#C5A059] flex items-center justify-center text-[#1A202C] font-bold shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-mono block">القارئ المعتمد حالياً:</span>
              <h4 className="font-bold text-sm text-[#C5A059] font-tajawal truncate max-w-[160px]">
                {selectedReciter.name}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Surah Selector for Sample Listening */}
      <div className="p-3 bg-[#1A202C] border border-[#2D3748] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-300">
          <Headphones className="w-4 h-4 text-[#C5A059]" />
          <span>سورة الاستماع التجريبي للعينة:</span>
        </div>
        <select
          value={previewSurahNumber}
          onChange={(e) => {
            setPreviewSurahNumber(Number(e.target.value));
            if (audioElement) audioElement.pause();
            setPreviewAudioReciterId(null);
          }}
          className="bg-[#12161F] border border-[#2D3748] text-[#C5A059] font-bold px-3 py-1.5 outline-none cursor-pointer"
        >
          {SURAHS_LIST.map((s) => (
            <option key={s.number} value={s.number}>
              سورة {s.name} ({s.englishName})
            </option>
          ))}
        </select>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            id="input-search-reciters"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم القارئ (مثال: وديع اليمني، المنشاوي، المعيقلي، هزاع البلوشي، خالد الجليل، عبد الباسط)..."
            className="w-full py-3 pr-11 pl-4 bg-[#1A202C] border border-[#2D3748] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-stone-100 placeholder-stone-500 text-sm outline-none transition-all"
          />
          <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-300 hover:text-white bg-[#2D3748] px-2 py-0.5 cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-reciters-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059] shadow-sm"
                  : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748] hover:border-[#C5A059]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reciters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReciters.map((reciter) => {
          const isSelected = selectedReciter.id === reciter.id;
          const isPreviewPlaying = previewAudioReciterId === reciter.id;
          const badge = getStyleBadge(reciter.style);

          return (
            <div
              key={reciter.id}
              className={`p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 group relative ${
                isSelected
                  ? "bg-[#1A202C] border-2 border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40"
                  : "bg-[#1A202C] hover:bg-[#1f2735] border-[#2D3748] hover:border-[#C5A059]"
              }`}
            >
              <div>
                {/* Top Badge & Info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-[#C5A059] text-[#1A202C] font-bold">
                      <Check className="w-3 h-3" />
                      <span>القارئ الحالي</span>
                    </span>
                  )}
                </div>

                {/* Reciter Name */}
                <h3 className="font-bold text-lg text-white group-hover:text-[#E2C785] font-tajawal transition-colors">
                  {reciter.name}
                </h3>
                <p className="text-xs text-stone-400 font-mono mt-0.5">{reciter.englishName}</p>

                {/* Riwayah and Location */}
                <div className="mt-3 pt-2.5 border-t border-[#2D3748] flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span className="truncate max-w-[170px]">{reciter.riwayah || "حفص عن عاصم"}</span>
                  {reciter.location && (
                    <span className="flex items-center gap-1 text-stone-400 shrink-0">
                      <MapPin className="w-3 h-3 text-[#C5A059]" />
                      <span>{reciter.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-[#2D3748] flex items-center justify-between gap-2">
                {/* Preview Sample Audio */}
                <button
                  onClick={() => handleTogglePreviewAudio(reciter)}
                  className={`px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer transition-colors border ${
                    isPreviewPlaying
                      ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                      : "bg-[#12161F] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
                  }`}
                  title="استماع لعينة صوتية سريعة"
                >
                  {isPreviewPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
                      <span>عينة صوتية</span>
                    </>
                  )}
                </button>

                {/* Set as Active or Play Quran with this reciter */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectReciter(reciter);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#12161F] text-[#C5A059] border-[#C5A059]"
                        : "bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] border-[#8B6E3D] shadow-sm"
                    }`}
                  >
                    {isSelected ? "تم الاختيار ✓" : "تعيين كقارئ"}
                  </button>

                  <button
                    onClick={() => {
                      onSelectReciter(reciter);
                      onOpenQuranReader(1);
                    }}
                    className="p-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 hover:text-white cursor-pointer"
                    title="فتح المصحف والقراءة بصوت هذا القارئ"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReciters.length === 0 && (
        <div className="text-center py-12 text-stone-400 border border-[#2D3748] bg-[#1A202C]">
          <p>لم يتم العثور على قارئ مطابق لـ "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};
