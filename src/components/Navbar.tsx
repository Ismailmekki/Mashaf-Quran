import React from "react";
import { BookOpen, Search, Sun, Moon, Palette, Type, Sparkles, Smartphone, Volume2, Globe, Users } from "lucide-react";
import { QuranTheme, ReaderSettings } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSearch: () => void;
  openApkModal: () => void;
  openSettings: () => void;
  openTranslations: () => void;
  readerSettings: ReaderSettings;
  setReaderSettings: React.Dispatch<React.SetStateAction<ReaderSettings>>;
  isPlayingAudio: boolean;
  activeSurahName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSearch,
  openApkModal,
  openSettings,
  openTranslations,
  readerSettings,
  setReaderSettings,
  isPlayingAudio,
  activeSurahName
}) => {
  const cycleTheme = () => {
    const themes: QuranTheme[] = ["dark", "emerald", "sapphire", "amber", "sepia", "classic"];
    const currentIndex = themes.indexOf(readerSettings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setReaderSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  const getThemeIcon = () => {
    switch (readerSettings.theme) {
      case "emerald":
        return <Palette className="w-4 h-4 text-emerald-400" />;
      case "sapphire":
        return <Palette className="w-4 h-4 text-sky-400" />;
      case "amber":
        return <Palette className="w-4 h-4 text-amber-400" />;
      case "sepia":
        return <Sun className="w-4 h-4 text-[#8B6E3D]" />;
      case "classic":
        return <Sun className="w-4 h-4 text-slate-800" />;
      case "dark":
      default:
        return <Moon className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <header className="sticky top-1.5 sm:top-2 z-40 w-full backdrop-blur-md bg-[#12161F]/90 border-b border-[#2D3748] shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand & Logo with Geometric Balance Motif */}
        <button
          id="btn-nav-home"
          onClick={() => setActiveTab("index")}
          className="flex items-center gap-2 sm:gap-3 text-right group cursor-pointer focus:outline-none shrink-0"
        >
          {/* Rotated Diamond Badge */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 border border-[#C5A059] rotate-45 flex items-center justify-center bg-[#1A202C] group-hover:border-[#E2C785] transition-colors shrink-0 shadow-sm">
            <BookOpen className="-rotate-45 w-4 h-4 text-[#C5A059]" />
          </div>
          <div>
            <span className="text-[#C5A059] font-medium tracking-[0.2em] text-[9px] sm:text-[10px] uppercase block leading-tight">
              The Noble Quran
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <h1 className="font-bold text-sm sm:text-lg text-white font-tajawal tracking-tight leading-tight">
                القرآن الكريم
              </h1>
              <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 uppercase tracking-wider font-mono bg-[#1A202C] text-[#C5A059] border border-[#8B6E3D]/50">
                PWA
              </span>
            </div>
          </div>
        </button>

        {/* Audio Active Pill if playing */}
        {isPlayingAudio && (
          <div
            onClick={() => setActiveTab("reader")}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A202C] border border-[#C5A059] text-[#C5A059] text-xs cursor-pointer hover:bg-[#2D3748] transition-colors animate-pulse shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="truncate max-w-[80px] sm:max-w-[140px] font-tajawal font-medium text-[11px] sm:text-xs">
              {activeSurahName ? `تلاوة: ${activeSurahName}` : "جارٍ الاستماع..."}
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Search */}
          <button
            id="btn-nav-search"
            onClick={openSearch}
            aria-label="بحث في القرآن"
            className="p-2 sm:px-2.5 sm:py-1.5 bg-[#1A202C] hover:bg-[#2D3748] text-stone-200 hover:text-white border border-[#2D3748] hover:border-[#C5A059] flex items-center gap-1 transition-colors cursor-pointer text-xs"
          >
            <Search className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden lg:inline font-medium">بحث</span>
          </button>

          {/* Reciters Collection Trigger */}
          <button
            id="btn-nav-reciters"
            onClick={() => setActiveTab("reciters")}
            aria-label="مجموعة القراء"
            className={`p-2 sm:px-2.5 sm:py-1.5 border flex items-center gap-1 transition-colors cursor-pointer text-xs ${
              activeTab === "reciters"
                ? "bg-[#C5A059] border-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                : "bg-[#1A202C] hover:bg-[#2D3748] border-[#2D3748] text-stone-200"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline font-medium">القراء</span>
          </button>

          {/* Language Translations Modal Trigger */}
          <button
            id="btn-nav-translations"
            onClick={openTranslations}
            aria-label="الترجمة باللغات"
            className="p-2 sm:px-2.5 sm:py-1.5 bg-[#1A202C] hover:bg-[#2D3748] text-stone-200 hover:text-white border border-[#2D3748] hover:border-[#C5A059] flex items-center gap-1 transition-colors cursor-pointer text-xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline font-medium">الترجمة</span>
          </button>

          {/* AI Tadabbur Tab Trigger */}
          <button
            id="btn-nav-ai"
            onClick={() => setActiveTab("tadabbur")}
            aria-label="تدبر بالذكاء الاصطناعي"
            className={`p-2 sm:px-2.5 sm:py-1.5 border flex items-center gap-1 transition-colors cursor-pointer text-xs ${
              activeTab === "tadabbur"
                ? "bg-[#C5A059] border-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                : "bg-[#1A202C] hover:bg-[#2D3748] border-[#2D3748] hover:border-[#C5A059] text-stone-200"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === "tadabbur" ? "text-[#1A202C]" : "text-[#C5A059]"}`} />
            <span className="hidden md:inline font-medium">تدبر ذكي</span>
          </button>

          {/* Theme Quick Cycle */}
          <button
            id="btn-nav-theme"
            onClick={cycleTheme}
            title="تغيير مظهر القراءة"
            aria-label="تغيير المظهر"
            className="p-2 bg-[#1A202C] hover:bg-[#2D3748] text-stone-200 hover:text-white border border-[#2D3748] hover:border-[#C5A059] transition-colors cursor-pointer"
          >
            {getThemeIcon()}
          </button>

          {/* Reader Settings Modal Trigger */}
          <button
            id="btn-nav-settings"
            onClick={openSettings}
            title="إعدادات الخط والمصحف"
            aria-label="إعدادات الخط"
            className="p-2 bg-[#1A202C] hover:bg-[#2D3748] text-stone-200 hover:text-white border border-[#2D3748] hover:border-[#C5A059] transition-colors cursor-pointer"
          >
            <Type className="w-4 h-4 text-[#C5A059]" />
          </button>

          {/* APK / App Install Badge */}
          <button
            id="btn-nav-apk"
            onClick={openApkModal}
            title="تثبيت التطبيق على هاتفك"
            className="p-2 sm:px-3 sm:py-1.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-sm border border-[#8B6E3D] shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#1A202C]" />
            <span className="hidden sm:inline">تحميل التطبيق</span>
          </button>
        </div>
      </div>
    </header>
  );
};
