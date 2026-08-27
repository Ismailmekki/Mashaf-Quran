import React, { useState, useEffect, useRef } from "react";
import { Smartphone, X, Download } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { BottomNavigation } from "./components/BottomNavigation";
import { SurahIndex } from "./components/SurahIndex";
import { QuranReader } from "./components/QuranReader";
import { RecitersCollection } from "./components/RecitersCollection";
import { AudioPlayerBar } from "./components/AudioPlayerBar";
import { TadabburAIModal } from "./components/TadabburAIModal";
import { PrayerTimesQibla } from "./components/PrayerTimesQibla";
import { AdhkarHisn } from "./components/AdhkarHisn";
import { KhatmahTracker } from "./components/KhatmahTracker";
import { SearchModal } from "./components/SearchModal";
import { ReaderSettingsModal } from "./components/ReaderSettingsModal";
import { LanguageTranslationModal } from "./components/LanguageTranslationModal";
import { ApkInstallModal } from "./components/ApkInstallModal";
import { ReaderSettings, Bookmark, KhatmahPlan, Reciter } from "./types";
import { RECITERS_LIST, getAyahAudioUrl } from "./data/recitersData";
import { SURAHS_LIST } from "./data/surahsData";

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 26,
  fontFamily: "amiri",
  theme: "dark",
  showTajweed: false,
  showTranslation: false,
  translationLang: "en",
  selectedTafseer: "muyassar",
  autoScroll: true,
  audioSpeed: 1
};

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>("index");

  // Reader State
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [initialAyahNumber, setInitialAyahNumber] = useState<number | undefined>(undefined);

  // Settings State with LocalStorage
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem("quran_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("quran_settings", JSON.stringify(readerSettings));
  }, [readerSettings]);

  // Bookmarks State with LocalStorage
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem("quran_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("quran_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Last Read State with LocalStorage
  const [lastRead, setLastRead] = useState<{
    surahNumber: number;
    ayahNumber: number;
    surahName: string;
    page: number;
  } | null>(() => {
    const saved = localStorage.getItem("quran_last_read");
    return saved ? JSON.parse(saved) : null;
  });

  const handleUpdateLastRead = (
    surahNumber: number,
    ayahNumber: number,
    surahName: string,
    page: number
  ) => {
    const lr = { surahNumber, ayahNumber, surahName, page };
    setLastRead(lr);
    localStorage.setItem("quran_last_read", JSON.stringify(lr));
  };

  // Khatmah Plan State with LocalStorage
  const [khatmahPlan, setKhatmahPlan] = useState<KhatmahPlan>(() => {
    const saved = localStorage.getItem("quran_khatmah");
    return saved
      ? JSON.parse(saved)
      : {
          id: "khatmah_1",
          name: "ختمة القرآن الكريم",
          targetDays: 30,
          startDate: new Date().toISOString(),
          currentPage: 1,
          totalPages: 604,
          completedDays: [],
          isFinished: false
        };
  });

  useEffect(() => {
    localStorage.setItem("quran_khatmah", JSON.stringify(khatmahPlan));
  }, [khatmahPlan]);

  // Audio Playback State
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(() => {
    const savedId = localStorage.getItem("quran_reciter_id");
    return RECITERS_LIST.find((r) => r.id === savedId) || RECITERS_LIST[0];
  });

  useEffect(() => {
    localStorage.setItem("quran_reciter_id", selectedReciter.id);
  }, [selectedReciter]);

  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<{
    surah: number;
    ayah: number;
  } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [repeatTimes, setRepeatTimes] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Modals & Install Banner
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTranslationsOpen, setIsTranslationsOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(() => {
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true);
    const dismissed = localStorage.getItem("quran_dismiss_install_banner");
    return !isStandalone && dismissed !== "true";
  });

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("quran_dismiss_install_banner", "true");
  };

  // Tadabbur active payload
  const [tadabburAyah, setTadabburAyah] = useState<{
    surahName: string;
    ayahNumber: number;
    ayahText: string;
  } | null>(null);

  // Audio Handlers
  const playAyah = (surahNumber: number, ayahNumberInSurah: number) => {
    setCurrentPlayingAyah({ surah: surahNumber, ayah: ayahNumberInSurah });
    const audioUrl = getAyahAudioUrl(selectedReciter.serverFolder, surahNumber, ayahNumberInSurah);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.warn("Audio play failed:", err);
          setIsPlayingAudio(false);
        });
    }
  };

  const handleAudioEnded = () => {
    if (!currentPlayingAyah) return;
    const currentSurahMeta = SURAHS_LIST.find((s) => s.number === currentPlayingAyah.surah);
    if (!currentSurahMeta) return;

    if (currentPlayingAyah.ayah < currentSurahMeta.numberOfAyahs) {
      playAyah(currentPlayingAyah.surah, currentPlayingAyah.ayah + 1);
    } else if (currentPlayingAyah.surah < 114) {
      setCurrentSurahNumber(currentPlayingAyah.surah + 1);
      playAyah(currentPlayingAyah.surah + 1, 1);
    } else {
      setIsPlayingAudio(false);
      setCurrentPlayingAyah(null);
    }
  };

  const handleNextAyah = () => {
    if (!currentPlayingAyah) return;
    const currentSurahMeta = SURAHS_LIST.find((s) => s.number === currentPlayingAyah.surah);
    if (!currentSurahMeta) return;

    if (currentPlayingAyah.ayah < currentSurahMeta.numberOfAyahs) {
      playAyah(currentPlayingAyah.surah, currentPlayingAyah.ayah + 1);
    } else if (currentPlayingAyah.surah < 114) {
      setCurrentSurahNumber(currentPlayingAyah.surah + 1);
      playAyah(currentPlayingAyah.surah + 1, 1);
    }
  };

  const handlePrevAyah = () => {
    if (!currentPlayingAyah) return;
    if (currentPlayingAyah.ayah > 1) {
      playAyah(currentPlayingAyah.surah, currentPlayingAyah.ayah - 1);
    } else if (currentPlayingAyah.surah > 1) {
      const prevSurahMeta = SURAHS_LIST.find((s) => s.number === currentPlayingAyah.surah - 1);
      if (prevSurahMeta) {
        setCurrentSurahNumber(prevSurahMeta.number);
        playAyah(prevSurahMeta.number, prevSurahMeta.numberOfAyahs);
      }
    }
  };

  const handleResumeAudio = () => {
    if (audioRef.current && currentPlayingAyah) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    } else {
      playAyah(currentSurahNumber, 1);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = (
    surahNumber: number,
    surahName: string,
    ayahNumber: number,
    ayahText: string
  ) => {
    const existingIndex = bookmarks.findIndex(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
    if (existingIndex >= 0) {
      setBookmarks((prev) => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      const newBm: Bookmark = {
        id: `bm_${surahNumber}_${ayahNumber}_${Date.now()}`,
        surahNumber,
        surahName,
        ayahNumber,
        ayahText,
        createdAt: new Date().toISOString()
      };
      setBookmarks((prev) => [newBm, ...prev]);
    }
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Surah select handler
  const handleSelectSurah = (surahNum: number, initialAyah?: number) => {
    setCurrentSurahNumber(surahNum);
    setInitialAyahNumber(initialAyah);
    setActiveTab("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaySurah = (surahNum: number) => {
    setCurrentSurahNumber(surahNum);
    setActiveTab("reader");
    playAyah(surahNum, 1);
  };

  const handleOpenTadabbur = (surahName: string, ayahNum: number, ayahText: string) => {
    setTadabburAyah({ surahName, ayahNumber: ayahNum, ayahText });
    setActiveTab("tadabbur");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenSurahByPage = (pageNumber: number) => {
    const targetSurah =
      SURAHS_LIST.find((s) => s.page === pageNumber) ||
      [...SURAHS_LIST].reverse().find((s) => s.page <= pageNumber) ||
      SURAHS_LIST[0];
    handleSelectSurah(targetSurah.number);
  };

  const currentSurahMeta = SURAHS_LIST.find((s) => s.number === currentSurahNumber);

  return (
    <div className="min-h-screen bg-[#12161F] text-[#F7FAFC] flex flex-col font-tajawal antialiased selection:bg-[#C5A059] selection:text-[#1A202C] relative bg-geometric-grid-dark">
      {/* Top Geometric Accent Line */}
      <div className="w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#C5A059] via-[#8B6E3D] to-[#C5A059] sticky top-0 z-50 shadow-sm" />

      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSearch={() => setIsSearchOpen(true)}
        openApkModal={() => setIsApkModalOpen(true)}
        openSettings={() => setIsSettingsOpen(true)}
        openTranslations={() => setIsTranslationsOpen(true)}
        readerSettings={readerSettings}
        setReaderSettings={setReaderSettings}
        isPlayingAudio={isPlayingAudio}
        activeSurahName={currentSurahMeta?.name}
      />

      {/* Floating Standalone Mobile App Install Banner */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-[#1A202C] via-[#1E293B] to-[#1A202C] border-b border-[#C5A059]/40 py-2 px-3 sm:px-6 shadow-md transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-200">
              <div className="w-7 h-7 bg-[#C5A059] flex items-center justify-center text-[#1A202C] shrink-0 rotate-45">
                <Smartphone className="-rotate-45 w-3.5 h-3.5" />
              </div>
              <span className="leading-snug">
                <strong className="text-white font-bold ml-1">تثبيت التطبيق على هاتفك:</strong>
                <span className="hidden sm:inline text-stone-300">
                  يعمل بملء الشاشة كتطبيق مستقل على الآيفون والأندرويد بدون متصفح وبدون إنترنت
                </span>
                <span className="sm:hidden text-stone-300">يعمل بدون متصفح</span>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-banner-install"
                onClick={() => setIsApkModalOpen(true)}
                className="px-3 py-1 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] font-bold text-xs flex items-center gap-1 cursor-pointer shadow border border-[#8B6E3D]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت الآن</span>
              </button>
              <button
                onClick={handleDismissBanner}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
                title="إخفاء هذا الشريط"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {/* 1. Surah Index Tab */}
        {activeTab === "index" && (
          <SurahIndex
            onSelectSurah={handleSelectSurah}
            onPlaySurah={handlePlaySurah}
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            lastRead={lastRead}
          />
        )}

        {/* 2. Quran Reader Tab */}
        {activeTab === "reader" && (
          <QuranReader
            surahNumber={currentSurahNumber}
            initialAyahNumber={initialAyahNumber}
            onNavigateSurah={(sNum) => {
              setCurrentSurahNumber(sNum);
              setInitialAyahNumber(1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            readerSettings={readerSettings}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onOpenTadabbur={handleOpenTadabbur}
            currentPlayingAyah={currentPlayingAyah}
            isPlayingAudio={isPlayingAudio}
            onPlayAyah={playAyah}
            onPauseAudio={handlePauseAudio}
            reciters={RECITERS_LIST}
            selectedReciter={selectedReciter}
            onSelectReciter={setSelectedReciter}
            onUpdateLastRead={handleUpdateLastRead}
          />
        )}

        {/* 3. Reciters Collection Tab (مجموعة القراء) */}
        {activeTab === "reciters" && (
          <RecitersCollection
            selectedReciter={selectedReciter}
            onSelectReciter={(reciter) => {
              setSelectedReciter(reciter);
              if (currentPlayingAyah) {
                playAyah(currentPlayingAyah.surah, currentPlayingAyah.ayah);
              }
            }}
            onPlaySurahWithReciter={(surahNum, reciter) => {
              setSelectedReciter(reciter);
              setCurrentSurahNumber(surahNum);
              setActiveTab("reader");
              playAyah(surahNum, 1);
            }}
            onOpenQuranReader={(surahNum) => {
              setCurrentSurahNumber(surahNum);
              setActiveTab("reader");
            }}
          />
        )}

        {/* 4. Adhkar & Masbaha Tab */}
        {activeTab === "adhkar" && <AdhkarHisn />}

        {/* 5. Prayer Times & Qibla Tab */}
        {activeTab === "prayers" && <PrayerTimesQibla />}

        {/* 6. AI Tadabbur & Ask Quran Tab */}
        {activeTab === "tadabbur" && (
          <TadabburAIModal
            initialSurahName={tadabburAyah?.surahName}
            initialAyahNumber={tadabburAyah?.ayahNumber}
            initialAyahText={tadabburAyah?.ayahText}
            onClose={() => setTadabburAyah(null)}
          />
        )}

        {/* 7. Khatmah Tracker Tab */}
        {activeTab === "khatmah" && (
          <KhatmahTracker
            onOpenSurahByPage={handleOpenSurahByPage}
            khatmahPlan={khatmahPlan}
            setKhatmahPlan={setKhatmahPlan}
          />
        )}
      </main>

      {/* Floating Audio Bar (when audio is active or playing) */}
      <AudioPlayerBar
        currentPlaying={currentPlayingAyah}
        isPlaying={isPlayingAudio}
        onPlay={handleResumeAudio}
        onPause={handlePauseAudio}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        reciters={RECITERS_LIST}
        selectedReciter={selectedReciter}
        onSelectReciter={(r) => {
          setSelectedReciter(r);
          if (currentPlayingAyah) {
            playAyah(currentPlayingAyah.surah, currentPlayingAyah.ayah);
          }
        }}
        repeatTimes={repeatTimes}
        onSetRepeatTimes={setRepeatTimes}
        playbackSpeed={playbackSpeed}
        onSetPlaybackSpeed={setPlaybackSpeed}
        onAudioEnded={handleAudioEnded}
        audioRef={audioRef}
      />

      {/* Bottom Mobile Navigation */}
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(surahNum, ayahNum) => {
          handleSelectSurah(surahNum, ayahNum);
        }}
      />

      {/* Reader Settings Modal */}
      <ReaderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={readerSettings}
        setSettings={setReaderSettings}
      />

      {/* Language Translations Modal */}
      <LanguageTranslationModal
        isOpen={isTranslationsOpen}
        onClose={() => setIsTranslationsOpen(false)}
        readerSettings={readerSettings}
        setReaderSettings={setReaderSettings}
      />

      {/* APK / PWA Install Guide Modal */}
      <ApkInstallModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
};

export default App;
