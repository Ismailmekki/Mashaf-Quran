import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Share2,
  Copy,
  Check,
  FileText,
  Volume2,
  RefreshCw,
  Columns,
  Layers,
  ArrowRight,
  ArrowLeft,
  Info,
  Eye,
  EyeOff,
  GraduationCap,
  Globe
} from "lucide-react";
import { SurahDetail, Ayah, ReaderSettings, Bookmark as BookmarkType, Reciter } from "../types";
import { fetchSurah, fetchSurahTranslations, fetchTafseer, fetchMushafPage, TAFSEER_EDITIONS_MAP, TRANSLATIONS_MAP } from "../services/quranApi";
import { SURAHS_LIST } from "../data/surahsData";
import { getAyahVocabulary, getWordMeaningsForAyah } from "../data/quranVocabulary";

interface QuranReaderProps {
  surahNumber: number;
  initialAyahNumber?: number;
  onNavigateSurah: (surahNumber: number) => void;
  readerSettings: ReaderSettings;
  bookmarks: BookmarkType[];
  onToggleBookmark: (surahNumber: number, surahName: string, ayahNumber: number, ayahText: string) => void;
  onOpenTadabbur: (surahName: string, ayahNumber: number, ayahText: string) => void;
  currentPlayingAyah: { surah: number; ayah: number } | null;
  isPlayingAudio: boolean;
  onPlayAyah: (surahNumber: number, ayahNumberInSurah: number) => void;
  onPauseAudio: () => void;
  reciters: Reciter[];
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  onUpdateLastRead: (surahNumber: number, ayahNumber: number, surahName: string, page: number) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  surahNumber,
  initialAyahNumber,
  onNavigateSurah,
  readerSettings,
  bookmarks,
  onToggleBookmark,
  onOpenTadabbur,
  currentPlayingAyah,
  isPlayingAudio,
  onPlayAyah,
  onPauseAudio,
  reciters,
  selectedReciter,
  onSelectReciter,
  onUpdateLastRead
}) => {
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readerMode, setReaderMode] = useState<"verse" | "mushaf">("verse");
  const [mushafPage, setMushafPage] = useState<number>(1);
  const [mushafPageData, setMushafPageData] = useState<Ayah[]>([]);
  const [loadingMushafPage, setLoadingMushafPage] = useState(false);

  // Active Ayah details modal (Tafseer & Word Meanings)
  const [selectedAyahForTafseer, setSelectedAyahForTafseer] = useState<Ayah | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"tafseer" | "vocab">("tafseer");
  const [selectedTafseerEdition, setSelectedTafseerEdition] = useState<string>(readerSettings.selectedTafseer || "muyassar");
  const [tafseerText, setTafseerText] = useState<string>("");
  const [loadingTafseer, setLoadingTafseer] = useState(false);
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);

  // Hifz state
  const [revealedAyahs, setRevealedAyahs] = useState<Record<number, boolean>>({});
  const [memorizedAyahs, setMemorizedAyahs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("hifz_memorized_ayahs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [loadingTranslations, setLoadingTranslations] = useState(false);
  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Load Surah
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const translationCode = readerSettings.translationLang ? readerSettings.translationLang : "en";

    fetchSurah(surahNumber, translationCode)
      .then((data) => {
        if (isMounted) {
          setSurahDetail(data);
          setMushafPage(data.page);
          setLoading(false);

          // Update last read
          if (data.ayahs && data.ayahs.length > 0) {
            const initialAyah = initialAyahNumber || 1;
            const target = data.ayahs.find((a) => a.numberInSurah === initialAyah) || data.ayahs[0];
            onUpdateLastRead(surahNumber, target.numberInSurah, data.name, target.page || data.page);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "حدث خطأ أثناء تحميل السورة");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surahNumber, readerSettings.translationLang]);

  // Ensure translations are populated whenever showTranslation is active or translation language changes
  useEffect(() => {
    if (!readerSettings.showTranslation || !surahDetail || !surahDetail.ayahs || surahDetail.ayahs.length === 0) {
      return;
    }

    const currentLangKey = readerSettings.translationLang || "en";
    const hasTranslations = surahDetail.ayahs.some(
      (a) => typeof a.translation === "string" && a.translation.trim().length > 0
    );

    if (!hasTranslations) {
      setLoadingTranslations(true);
      fetchSurahTranslations(surahNumber, currentLangKey)
        .then((transMap) => {
          if (transMap.size > 0) {
            setSurahDetail((prev) => {
              if (!prev) return null;
              const updatedAyahs = prev.ayahs.map((a) => ({
                ...a,
                translation: transMap.get(a.numberInSurah) || a.translation || ""
              }));
              return { ...prev, ayahs: updatedAyahs };
            });
          }
          setLoadingTranslations(false);
        })
        .catch((e) => {
          console.warn("Failed to dynamically fetch translations:", e);
          setLoadingTranslations(false);
        });
    }
  }, [readerSettings.showTranslation, readerSettings.translationLang, surahNumber, surahDetail?.name]);

  // Load Mushaf Page if in Mushaf mode
  useEffect(() => {
    if (readerMode === "mushaf") {
      setLoadingMushafPage(true);
      fetchMushafPage(mushafPage)
        .then((data) => {
          setMushafPageData(data.ayahs);
          setLoadingMushafPage(false);
        })
        .catch(() => {
          setLoadingMushafPage(false);
        });
    }
  }, [mushafPage, readerMode]);

  // Scroll to initial or playing ayah
  useEffect(() => {
    if (initialAyahNumber && !loading) {
      const el = ayahRefs.current.get(initialAyahNumber);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 200);
      }
    }
  }, [initialAyahNumber, loading]);

  useEffect(() => {
    if (
      currentPlayingAyah &&
      currentPlayingAyah.surah === surahNumber &&
      readerSettings.autoScroll
    ) {
      const el = ayahRefs.current.get(currentPlayingAyah.ayah);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentPlayingAyah, surahNumber, readerSettings.autoScroll]);

  // Load Tafseer for selected Ayah
  const handleOpenTafseer = async (ayah: Ayah, defaultTab: "tafseer" | "vocab" = "tafseer") => {
    setSelectedAyahForTafseer(ayah);
    setActiveModalTab(defaultTab);
    setLoadingTafseer(true);
    setTafseerText("");

    const targetTafseer = TAFSEER_EDITIONS_MAP[selectedTafseerEdition]?.id || "ar.muyassar";
    const text = await fetchTafseer(surahNumber, ayah.numberInSurah, targetTafseer);
    setTafseerText(text);
    setLoadingTafseer(false);
  };

  const handleSwitchTafseerEdition = async (editionKey: string) => {
    if (!selectedAyahForTafseer) return;
    setSelectedTafseerEdition(editionKey);
    setLoadingTafseer(true);
    const targetTafseer = TAFSEER_EDITIONS_MAP[editionKey]?.id || "ar.muyassar";
    const text = await fetchTafseer(surahNumber, selectedAyahForTafseer.numberInSurah, targetTafseer);
    setTafseerText(text);
    setLoadingTafseer(false);
  };

  const toggleAyahMemorized = (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    const next = { ...memorizedAyahs, [key]: !memorizedAyahs[key] };
    setMemorizedAyahs(next);
    try {
      localStorage.setItem("hifz_memorized_ayahs", JSON.stringify(next));
    } catch {}
  };

  const toggleRevealAyah = (ayahNum: number) => {
    setRevealedAyahs((prev) => ({ ...prev, [ayahNum]: !prev[ayahNum] }));
  };

  const handleCopyAyah = (ayah: Ayah) => {
    if (!surahDetail) return;
    const textToCopy = `«${ayah.text}» [سورة ${surahDetail.name}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedAyahNumber(ayah.numberInSurah);
      setTimeout(() => setCopiedAyahNumber(null), 2500);
    });
  };

  const handleShareAyah = (ayah: Ayah) => {
    if (!surahDetail) return;
    const shareData = {
      title: `سورة ${surahDetail.name} - آية ${ayah.numberInSurah}`,
      text: `«${ayah.text}» [سورة ${surahDetail.name}: ${ayah.numberInSurah}]`
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopyAyah(ayah);
    }
  };

  const getFontFamilyClass = () => {
    switch (readerSettings.fontFamily) {
      case "quran":
        return "font-quran";
      case "scheherazade":
        return "font-scheherazade";
      case "cairo":
        return "font-cairo";
      case "tajawal":
        return "font-tajawal";
      case "amiri":
      default:
        return "font-amiri";
    }
  };

  const getThemeWrapperClass = () => {
    switch (readerSettings.theme) {
      case "emerald":
        return "theme-emerald bg-[#05231C] text-emerald-50";
      case "sapphire":
        return "theme-sapphire bg-[#0A192F] text-sky-50";
      case "amber":
        return "theme-amber bg-[#1A1218] text-amber-50";
      case "sepia":
        return "theme-sepia bg-[#FBF7EE] text-[#2C221E]";
      case "classic":
        return "theme-classic bg-white text-slate-950";
      case "dark":
      default:
        return "theme-dark bg-[#0F141C] text-stone-100";
    }
  };

  const isAyahBookmarked = (ayahNum: number) => {
    return bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNum);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full border-4 border-[#C5A059]/20 border-t-[#C5A059] animate-spin mb-4" />
        <h3 className="font-bold text-lg text-[#C5A059] font-tajawal">جارٍ تحميل السورة الشريفة...</h3>
        <p className="text-xs text-stone-400 mt-1">رواية حفص عن عاصم بالرسم العثماني</p>
      </div>
    );
  }

  if (error || !surahDetail) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <p className="text-rose-400 font-medium mb-3">{error || "تعذر تحميل بيانات السورة"}</p>
        <button
          onClick={() => onNavigateSurah(surahNumber)}
          className="px-4 py-2 bg-[#C5A059] text-[#1A202C] font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-200 ${getThemeWrapperClass()}`}>
      {/* Top Reading Navigation Bar */}
      <div className="sticky top-16 z-30 backdrop-blur-md bg-[#12161F]/90 border-b border-[#2D3748] px-3 sm:px-6 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Previous Surah button */}
          <button
            id="btn-prev-surah"
            disabled={surahNumber <= 1}
            onClick={() => onNavigateSurah(surahNumber - 1)}
            className={`px-3 py-1.5 border text-xs flex items-center gap-1 transition-all ${
              surahNumber <= 1
                ? "opacity-30 cursor-not-allowed border-[#2D3748] text-stone-600"
                : "border-[#2D3748] hover:border-[#C5A059] bg-[#1A202C] text-stone-200 cursor-pointer"
            }`}
          >
            <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            <span className="hidden sm:inline">السورة السابقة</span>
          </button>

          {/* Surah Title & Mode Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-center">
              <h2 className="font-bold text-base sm:text-lg text-white font-tajawal">
                سورة {surahDetail.name}
              </h2>
              <span className="text-[10px] text-[#C5A059] font-mono block">
                {surahDetail.revelationType === "Meccan" ? "مكية" : "مدنية"} • {surahDetail.numberOfAyahs} آية • ص {surahDetail.page}
              </span>
            </div>

            {/* View Mode Toggle: Verse / Mushaf */}
            <div className="flex items-center bg-[#1A202C] p-0.5 border border-[#2D3748] text-xs">
              <button
                id="btn-mode-verse"
                onClick={() => setReaderMode("verse")}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  readerMode === "verse"
                    ? "bg-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="عرض آية بآية مع الترجمة والتفسير"
              >
                آية بآية
              </button>
              <button
                id="btn-mode-mushaf"
                onClick={() => setReaderMode("mushaf")}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  readerMode === "mushaf"
                    ? "bg-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="عرض صفحة المصحف الشريف"
              >
                صفحة المصحف
              </button>
            </div>
          </div>

          {/* Next Surah button */}
          <button
            id="btn-next-surah"
            disabled={surahNumber >= 114}
            onClick={() => onNavigateSurah(surahNumber + 1)}
            className={`px-3 py-1.5 border text-xs flex items-center gap-1 transition-all ${
              surahNumber >= 114
                ? "opacity-30 cursor-not-allowed border-[#2D3748] text-stone-600"
                : "border-[#2D3748] hover:border-[#C5A059] bg-[#1A202C] text-stone-200 cursor-pointer"
            }`}
          >
            <span className="hidden sm:inline">السورة التالية</span>
            <ChevronLeft className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6">
        {/* Decorative Surah Header Frame with Geometric Balance styling */}
        <div className="mb-8 p-6 sm:p-8 bg-[#1A202C] border border-[#C5A059]/40 text-center relative overflow-hidden shadow-md">
          {/* Geometric Hatch Watermark */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-geometric-hatch opacity-10 pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-geometric-hatch opacity-10 pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 bg-[#12161F] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono tracking-wider uppercase">
                الجزء {surahDetail.juz} • الحزب {Math.ceil(surahDetail.juz * 2)}
              </span>
              {readerSettings.hifzMode && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#12161F] border border-amber-500/40 text-amber-300 text-xs font-mono">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>وضع التحفيظ مفعل (تكرار {readerSettings.hifzRepeatCount || 3} مرات)</span>
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-tajawal text-white tracking-wide">
              سُورَةُ {surahDetail.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto font-mono">
              {surahDetail.revelationType === "Meccan" ? "سورة مكية" : "سورة مدنية"} • ترتيبها ({surahDetail.number}) • عدد آياتها ({surahDetail.numberOfAyahs})
            </p>
          </div>

          {/* Basmalah Display */}
          {surahNumber !== 9 && (
            <div className="mt-6 pt-5 border-t border-[#2D3748]">
              <p className="font-quran text-2xl sm:text-3xl text-[#C5A059] leading-relaxed">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          )}
        </div>

        {/* 1. VERSE-BY-VERSE MODE */}
        {readerMode === "verse" && (
          <div className="space-y-4">
            {surahDetail.ayahs.map((ayah) => {
              const isPlayingThisAyah =
                currentPlayingAyah?.ayah === ayah.numberInSurah &&
                currentPlayingAyah?.surah === surahNumber;
              const bookmarked = isAyahBookmarked(ayah.numberInSurah);
              const isMemorized = !!memorizedAyahs[`${surahNumber}:${ayah.numberInSurah}`];
              const isHiddenForHifz =
                readerSettings.hifzMode &&
                readerSettings.hifzHideText &&
                !revealedAyahs[ayah.numberInSurah];

              return (
                <div
                  key={ayah.numberInSurah}
                  ref={(el) => {
                    if (el) ayahRefs.current.set(ayah.numberInSurah, el);
                  }}
                  id={`ayah-${ayah.numberInSurah}`}
                  className={`p-4 sm:p-6 border transition-all duration-200 group ${
                    isPlayingThisAyah
                      ? "bg-[#1A202C] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/40 active-playing-glow"
                      : "bg-[#1A202C] hover:bg-[#1f2735] border-[#2D3748] hover:border-[#C5A059]"
                  }`}
                >
                  {/* Ayah Meta & Quick Actions Top Bar */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#2D3748] text-xs">
                    {/* Rotated Diamond Ayah Badge */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-[#C5A059] rotate-45 flex items-center justify-center bg-[#12161F] text-[#C5A059] shrink-0 mr-0.5">
                        <span className="-rotate-45 text-[11px] font-bold text-[#C5A059] font-mono">
                          {ayah.numberInSurah}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                        صفحة {ayah.page || surahDetail.page}
                      </span>
                      {isMemorized && (
                        <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                          تم الحفظ ✓
                        </span>
                      )}
                    </div>

                    {/* Ayah Action Buttons with Geometric styling */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      {/* Play Ayah Audio */}
                      <button
                        id={`btn-play-ayah-${ayah.numberInSurah}`}
                        onClick={() => {
                          if (isPlayingThisAyah && isPlayingAudio) {
                            onPauseAudio();
                          } else {
                            onPlayAyah(surahNumber, ayah.numberInSurah);
                          }
                        }}
                        title={isPlayingThisAyah && isPlayingAudio ? "إيقاف مؤقت" : "استماع للآية"}
                        className={`p-1.5 sm:px-3 sm:py-1 text-xs flex items-center gap-1 transition-colors cursor-pointer border ${
                          isPlayingThisAyah && isPlayingAudio
                            ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                            : "bg-[#12161F] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
                        }`}
                      >
                        {isPlayingThisAyah && isPlayingAudio ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span className="hidden sm:inline">إيقاف</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
                            <span className="hidden sm:inline">استماع</span>
                          </>
                        )}
                      </button>

                      {/* Tafseer Button */}
                      <button
                        id={`btn-tafseer-ayah-${ayah.numberInSurah}`}
                        onClick={() => handleOpenTafseer(ayah, "tafseer")}
                        title="تفسير الآية"
                        className="p-1.5 sm:px-3 sm:py-1 bg-[#12161F] hover:bg-[#2D3748] text-stone-300 border border-[#2D3748] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="hidden sm:inline">التفسير</span>
                      </button>

                      {/* Word Meanings / Vocabulary Button */}
                      <button
                        id={`btn-vocab-ayah-${ayah.numberInSurah}`}
                        onClick={() => handleOpenTafseer(ayah, "vocab")}
                        title="معاني الكلمات وغريب الآية"
                        className="p-1.5 sm:px-3 sm:py-1 bg-[#12161F] hover:bg-[#2D3748] text-stone-300 border border-[#2D3748] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="hidden sm:inline">معاني الكلمات</span>
                      </button>

                      {/* AI Tadabbur Button */}
                      <button
                        id={`btn-tadabbur-ayah-${ayah.numberInSurah}`}
                        onClick={() =>
                          onOpenTadabbur(surahDetail.name, ayah.numberInSurah, ayah.text)
                        }
                        title="تدبر بالذكاء الاصطناعي"
                        className="p-1.5 sm:px-3 sm:py-1 bg-[#12161F] hover:bg-[#2D3748] border border-[#C5A059]/40 text-[#C5A059] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="hidden sm:inline font-medium">تدبر ذكي</span>
                      </button>

                      {/* Hifz Memorization Toggle */}
                      {readerSettings.hifzMode && (
                        <button
                          onClick={() => toggleAyahMemorized(surahNumber, ayah.numberInSurah)}
                          title="تعليم الآية كمحفوظة"
                          className={`p-1.5 text-xs transition-colors cursor-pointer border ${
                            isMemorized
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-[#12161F] hover:bg-[#2D3748] text-stone-400 border-[#2D3748]"
                          }`}
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Bookmark Button */}
                      <button
                        id={`btn-bookmark-ayah-${ayah.numberInSurah}`}
                        onClick={() =>
                          onToggleBookmark(
                            surahNumber,
                            surahDetail.name,
                            ayah.numberInSurah,
                            ayah.text
                          )
                        }
                        title={bookmarked ? "إزالة من المحفوظات" : "حفظ الآية"}
                        className={`p-1.5 text-xs transition-colors cursor-pointer border ${
                          bookmarked
                            ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059]"
                            : "bg-[#12161F] hover:bg-[#2D3748] text-stone-400 border-[#2D3748]"
                        }`}
                      >
                        {bookmarked ? (
                          <BookmarkCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Copy Button */}
                      <button
                        id={`btn-copy-ayah-${ayah.numberInSurah}`}
                        onClick={() => handleCopyAyah(ayah)}
                        title="نسخ نص الآية"
                        className="p-1.5 bg-[#12161F] hover:bg-[#2D3748] text-stone-400 hover:text-white border border-[#2D3748] text-xs transition-colors cursor-pointer"
                      >
                        {copiedAyahNumber === ayah.numberInSurah ? (
                          <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Share Button */}
                      <button
                        id={`btn-share-ayah-${ayah.numberInSurah}`}
                        onClick={() => handleShareAyah(ayah)}
                        title="مشاركة الآية"
                        className="p-1.5 bg-[#12161F] hover:bg-[#2D3748] text-stone-400 hover:text-white border border-[#2D3748] text-xs transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Uthmani Arabic Ayah Text with Hifz hide/reveal feature */}
                  <div className="py-2 text-right relative">
                    {isHiddenForHifz ? (
                      <div className="p-6 bg-[#12161F] border border-[#2D3748] text-center space-y-3">
                        <p className="text-stone-500 font-tajawal text-sm blur-sm select-none">
                          {ayah.text}
                        </p>
                        <button
                          onClick={() => toggleRevealAyah(ayah.numberInSurah)}
                          className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>كشف نص الآية للتحقق من الحفظ</span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p
                          style={{ fontSize: `${readerSettings.fontSize}px` }}
                          className={`leading-[2.2] tracking-wide text-stone-100 select-text ${getFontFamilyClass()}`}
                        >
                          {ayah.text}
                          <span className="ayah-symbol font-mono text-[#C5A059] inline-block px-1.5">
                            ﴿{ayah.numberInSurah}﴾
                          </span>
                        </p>
                        {readerSettings.hifzMode && readerSettings.hifzHideText && (
                          <button
                            onClick={() => toggleRevealAyah(ayah.numberInSurah)}
                            className="mt-2 text-[11px] text-stone-400 hover:text-[#C5A059] flex items-center gap-1 font-mono"
                          >
                            <EyeOff className="w-3 h-3" />
                            <span>إخفاء الآية مجدداً</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Translation Line (if enabled) */}
                  {readerSettings.showTranslation && (
                    <div className="mt-3 pt-3 border-t border-[#2D3748]/80 bg-[#12161F]/60 p-3 border border-[#2D3748] transition-all">
                      {(() => {
                        const langKey = readerSettings.translationLang || "en";
                        const transInfo = TRANSLATIONS_MAP[langKey] || TRANSLATIONS_MAP["en"];
                        const isRtl = transInfo?.direction === "rtl";

                        if (ayah.translation && ayah.translation.trim().length > 0) {
                          return (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] text-[#C5A059]">
                                <span className="font-mono flex items-center gap-1.5 font-bold">
                                  <span>{transInfo?.flag || "🌍"}</span>
                                  <span>{transInfo?.name || transInfo?.language || "English"}</span>
                                </span>
                                <span className="text-[10px] text-stone-500 font-mono">
                                  {isRtl ? "RTL • ترجمة معتمدة" : "LTR • Certified Translation"}
                                </span>
                              </div>
                              <p
                                dir={isRtl ? "rtl" : "ltr"}
                                className={`text-xs sm:text-sm text-stone-200 leading-relaxed ${
                                  isRtl ? "text-right font-tajawal" : "text-left font-sans"
                                }`}
                              >
                                {ayah.translation}
                              </p>
                            </div>
                          );
                        }

                        if (loadingTranslations) {
                          return (
                            <div className="flex items-center gap-2 text-xs text-stone-400 py-1 font-tajawal">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                              <span>جارٍ تحميل الترجمة ({transInfo?.name || "المحددة"})...</span>
                            </div>
                          );
                        }

                        return (
                          <div className="flex items-center justify-between text-xs text-stone-400 font-tajawal py-1">
                            <span>لا تتوفر ترجمة مباشرة لهذه الآية حالياً.</span>
                            <button
                              onClick={() => {
                                setLoadingTranslations(true);
                                fetchSurahTranslations(surahNumber, langKey)
                                  .then((transMap) => {
                                    if (transMap.size > 0) {
                                      setSurahDetail((prev) => {
                                        if (!prev) return null;
                                        return {
                                          ...prev,
                                          ayahs: prev.ayahs.map((a) => ({
                                            ...a,
                                            translation: transMap.get(a.numberInSurah) || a.translation || ""
                                          }))
                                        };
                                      });
                                    }
                                    setLoadingTranslations(false);
                                  })
                                  .catch(() => setLoadingTranslations(false));
                              }}
                              className="text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>إعادة التحميل</span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 2. MUSHAF PAGE MODE (1-604 Pages) */}
        {readerMode === "mushaf" && (
          <div className="space-y-4">
            {/* Mushaf Page Navigation Controls */}
            <div className="p-3 bg-[#1A202C] border border-[#2D3748] flex items-center justify-between gap-2">
              <button
                disabled={mushafPage <= 1}
                onClick={() => setMushafPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] disabled:opacity-40 text-stone-200 text-xs flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                <span>الصفحة السابقة</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#C5A059] font-bold font-mono">
                  صفحة {mushafPage} من 604
                </span>
                <input
                  type="range"
                  min="1"
                  max="604"
                  value={mushafPage}
                  onChange={(e) => setMushafPage(Number(e.target.value))}
                  className="w-24 sm:w-40 accent-[#C5A059] cursor-pointer"
                />
              </div>

              <button
                disabled={mushafPage >= 604}
                onClick={() => setMushafPage((p) => Math.min(604, p + 1))}
                className="px-3 py-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] disabled:opacity-40 text-stone-200 text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>الصفحة التالية</span>
                <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>

            {/* Mushaf Page Card */}
            <div className="p-6 sm:p-10 bg-[#1A202C] border-2 border-[#C5A059]/40 shadow-md text-center min-h-[600px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-geometric-hatch opacity-5 pointer-events-none" />
              {loadingMushafPage ? (
                <div className="py-24 text-center">
                  <div className="w-10 h-10 border-2 border-[#C5A059]/20 border-t-[#C5A059] animate-spin mx-auto mb-3" />
                  <p className="text-xs text-stone-400 font-mono">جارٍ تحميل الصفحة {mushafPage}...</p>
                </div>
              ) : (
                <>
                  {/* Page Top Header */}
                  <div className="flex items-center justify-between border-b border-[#2D3748] pb-3 mb-6 text-xs text-[#C5A059] font-tajawal">
                    <span>الجزء {mushafPageData[0]?.juz || surahDetail.juz}</span>
                    <span className="font-bold text-white">سورة {surahDetail.name}</span>
                    <span className="font-mono">صفحة {mushafPage}</span>
                  </div>

                  {/* Verses Flow Continuous Text */}
                  <div className="text-justify leading-[2.6] text-stone-100 py-4 relative z-10">
                    {mushafPageData.map((ayah) => {
                      const isPlaying =
                        currentPlayingAyah?.ayah === ayah.numberInSurah &&
                        currentPlayingAyah?.surah === surahNumber;
                      return (
                        <span
                          key={ayah.number}
                          onClick={() => handleOpenTafseer(ayah, "tafseer")}
                          className={`cursor-pointer transition-colors px-1 py-0.5 ${
                            isPlaying
                              ? "bg-[#C5A059]/20 text-[#E2C785] border-b border-[#C5A059]"
                              : "hover:bg-[#2D3748] hover:text-[#E2C785]"
                          } ${getFontFamilyClass()}`}
                          style={{ fontSize: `${readerSettings.fontSize}px` }}
                          title={`الآية ${ayah.numberInSurah} - اضغط للتفسير ومعاني الكلمات`}
                        >
                          {ayah.text}
                          <span className="ayah-symbol font-mono text-[#C5A059] mx-1 inline-block">
                            ﴿{ayah.numberInSurah}﴾
                          </span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Page Bottom Footer */}
                  <div className="border-t border-[#2D3748] pt-3 mt-6 text-center text-xs text-[#C5A059] font-mono">
                    — {mushafPage} —
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom Surah Navigation Quick Bar */}
        <div className="mt-10 p-4 bg-[#1A202C] border border-[#2D3748] flex items-center justify-between gap-3">
          <button
            disabled={surahNumber <= 1}
            onClick={() => onNavigateSurah(surahNumber - 1)}
            className="px-4 py-2 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] disabled:opacity-30 text-stone-200 text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            <span>السورة السابقة</span>
          </button>

          <span className="text-xs text-stone-400 font-mono">
            سورة {surahDetail.name} ({surahDetail.number} من 114)
          </span>

          <button
            disabled={surahNumber >= 114}
            onClick={() => onNavigateSurah(surahNumber + 1)}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F46] disabled:opacity-30 text-[#1A202C] font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors border border-[#8B6E3D]"
          >
            <span>السورة التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comprehensive Tafseer & Word Meanings Modal Sheet */}
      {selectedAyahForTafseer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#1A202C] border border-[#C5A059]/40 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#2D3748] flex items-center justify-between bg-[#12161F]">
              <div>
                <span className="text-[10px] text-[#C5A059] uppercase tracking-widest font-mono block">
                  Quranic Exegesis & Vocabulary
                </span>
                <h3 className="font-bold text-base sm:text-lg text-white font-tajawal">
                  الآية {selectedAyahForTafseer.numberInSurah} من سورة {surahDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAyahForTafseer(null)}
                className="p-2 border border-[#2D3748] bg-[#1A202C] text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Ayah Text preview */}
            <div className="p-4 bg-[#12161F] border-b border-[#2D3748] text-right">
              <p className="font-quran text-lg sm:text-xl text-[#C5A059] leading-loose">
                «{selectedAyahForTafseer.text}»
                <span className="ayah-symbol font-mono text-stone-300 mx-1">
                  ﴿{selectedAyahForTafseer.numberInSurah}﴾
                </span>
              </p>
            </div>

            {/* Modal Navigation Tabs: [التفسير المعتمد] vs [معاني الكلمات وغريب القرآن] */}
            <div className="flex border-b border-[#2D3748] bg-[#12161F] text-xs">
              <button
                onClick={() => setActiveModalTab("tafseer")}
                className={`flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeModalTab === "tafseer"
                    ? "border-[#C5A059] text-[#C5A059] bg-[#1A202C]"
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>موسوعة التفاسير (10 تفاسير)</span>
              </button>
              <button
                onClick={() => setActiveModalTab("vocab")}
                className={`flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeModalTab === "vocab"
                    ? "border-[#C5A059] text-[#C5A059] bg-[#1A202C]"
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>معاني المفردات وغريب القرآن والإعراب</span>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-stone-200 text-sm leading-relaxed">
              {activeModalTab === "tafseer" && (
                <div className="space-y-4">
                  {/* Dynamic Tafseer Source Selector */}
                  <div>
                    <label className="block text-xs font-mono text-stone-400 mb-1.5">اختر كتاب التفسير:</label>
                    <select
                      value={selectedTafseerEdition}
                      onChange={(e) => handleSwitchTafseerEdition(e.target.value)}
                      className="w-full p-2 bg-[#12161F] border border-[#2D3748] text-[#C5A059] text-xs font-semibold outline-none cursor-pointer focus:border-[#C5A059]"
                    >
                      <option value="muyassar">التفسير الميسر (مجمع الملك فهد)</option>
                      <option value="saadi">تيسير الكريم الرحمن (تفسير السعدي)</option>
                      <option value="ibnkathir">تفسير القرآن العظيم (ابن كثير)</option>
                      <option value="tabari">جامع البيان في تأويل آي القرآن (الطبري)</option>
                      <option value="qurtubi">الجامع لأحكام القرآن (القرطبي)</option>
                      <option value="baghawi">معالم التنزيل (تفسير البغوي)</option>
                      <option value="jalalayn">تفسير الجلالين (المحلي والسيوطي)</option>
                      <option value="waseet">التفسير الوسيط للقرآن الكريم (د. طنطاوي)</option>
                      <option value="tanweer">التحرير والتنوير (ابن عاشور)</option>
                      <option value="eerab">إعراب القرآن الكريم وبيانه (محيي الدين درويش)</option>
                    </select>
                  </div>

                  {loadingTafseer ? (
                    <div className="py-12 text-center">
                      <div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] animate-spin mx-auto mb-2" />
                      <p className="text-xs text-stone-400 font-mono">جارٍ تحميل نص التفسير...</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#12161F] border border-[#2D3748] space-y-2">
                      <span className="text-[11px] text-[#C5A059] font-mono font-bold block">
                        {TAFSEER_EDITIONS_MAP[selectedTafseerEdition]?.name || "التفسير"}:
                      </span>
                      <p className="text-stone-300 leading-loose whitespace-pre-wrap">{tafseerText}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Word Meanings & Vocabulary Breakdown */}
              {activeModalTab === "vocab" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#C5A059] font-mono">
                      تحليل مفردات الآية وغريب الكلمات وجذورها اللغوية:
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono">معجم القرآن الكريم</span>
                  </div>

                  {(() => {
                    const vocabList = getWordMeaningsForAyah(
                      surahNumber,
                      selectedAyahForTafseer.numberInSurah,
                      selectedAyahForTafseer.text
                    );

                    return (
                      <div className="space-y-2.5">
                        {vocabList.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#12161F] border border-[#2D3748] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-right"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base text-[#C5A059] font-quran">{item.word}</span>
                                {item.root && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-[#1A202C] border border-[#2D3748] text-stone-400 font-mono">
                                    الجذر: {item.root}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-300 mt-1">{item.meaning}</p>
                            </div>
                            {item.grammar && (
                              <span className="text-[11px] text-stone-400 font-mono bg-[#1A202C] px-2 py-1 border border-[#2D3748] shrink-0">
                                {item.grammar}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-[#2D3748] bg-[#12161F] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  const ayah = selectedAyahForTafseer;
                  setSelectedAyahForTafseer(null);
                  onOpenTadabbur(surahDetail.name, ayah.numberInSurah, ayah.text);
                }}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#8B6E3D]"
              >
                <Sparkles className="w-4 h-4 text-[#1A202C]" />
                <span>تدبر وتأمل بالذكاء الاصطناعي</span>
              </button>

              <button
                onClick={() => handleCopyAyah(selectedAyahForTafseer)}
                className="px-4 py-2 bg-[#1A202C] hover:bg-[#2D3748] border border-[#2D3748] text-stone-200 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>نسخ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
