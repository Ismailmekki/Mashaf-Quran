import React, { useState } from "react";
import { X, Globe, Search, Check, BookOpen, Volume2, Sparkles } from "lucide-react";
import { ReaderSettings } from "../types";

export interface TranslationEdition {
  id: string;
  langCode: string;
  languageArabic: string;
  languageNative: string;
  translator: string;
  flag: string;
  direction: "ltr" | "rtl";
  sampleText: string;
}

export const TRANSLATIONS_LIST: TranslationEdition[] = [
  {
    id: "en",
    langCode: "en",
    languageArabic: "الإنجليزية (صحيح انترناشونال)",
    languageNative: "English (Sahih International)",
    translator: "Saheeh International",
    flag: "🇬🇧",
    direction: "ltr",
    sampleText: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
  },
  {
    id: "en.khattab",
    langCode: "en",
    languageArabic: "الإنجليزية المعاصرة (د. مصطفى خطاب)",
    languageNative: "The Clear Quran (Dr. Mustafa Khattab)",
    translator: "Dr. Mustafa Khattab",
    flag: "🇺🇸",
    direction: "ltr",
    sampleText: "In the Name of Allah—the Most Compassionate, Most Merciful."
  },
  {
    id: "en.yusufali",
    langCode: "en",
    languageArabic: "الإنجليزية الكلاسيكية (يوسف علي)",
    languageNative: "English (Abdullah Yusuf Ali)",
    translator: "Abdullah Yusuf Ali",
    flag: "🇬🇧",
    direction: "ltr",
    sampleText: "In the name of Allah, Most Gracious, Most Merciful."
  },
  {
    id: "fr",
    langCode: "fr",
    languageArabic: "الفرنسية (محمد حميد الله)",
    languageNative: "Français (Muhammad Hamidullah)",
    translator: "Muhammad Hamidullah",
    flag: "🇫🇷",
    direction: "ltr",
    sampleText: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux."
  },
  {
    id: "ur",
    langCode: "ur",
    languageArabic: "الأردية (فتح محمد جالندھری)",
    languageNative: "اردو (فتح محمد جالندھری)",
    translator: "فتح محمد جالندھری",
    flag: "🇵🇰",
    direction: "rtl",
    sampleText: "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔"
  },
  {
    id: "tr",
    langCode: "tr",
    languageArabic: "التركية (رئاسة الشؤون الدينية)",
    languageNative: "Türkçe (Diyanet İşleri)",
    translator: "Diyanet İşleri Başkanlığı",
    flag: "🇹🇷",
    direction: "ltr",
    sampleText: "Rahmân ve Rahîm olan Allah'ın adıyla."
  },
  {
    id: "id",
    langCode: "id",
    languageArabic: "الإندونيسية (وزارة الشؤون الدينية)",
    languageNative: "Bahasa Indonesia (Kemenag)",
    translator: "Kementerian Agama Republik Indonesia",
    flag: "🇮🇩",
    direction: "ltr",
    sampleText: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang."
  },
  {
    id: "ru",
    langCode: "ru",
    languageArabic: "الروسية (إلمير كولييف)",
    languageNative: "Русский (Эльмир Кулиев)",
    translator: "Эльмир Кулиев",
    flag: "🇷🇺",
    direction: "ltr",
    sampleText: "Во имя Аллаха, Милостивого, Милосердного!"
  },
  {
    id: "de",
    langCode: "de",
    languageArabic: "الألمانية (بوبنهايم وإلياس)",
    languageNative: "Deutsch (Bubenheim & Elyas)",
    translator: "A. S. Bubenheim und N. Elyas",
    flag: "🇩🇪",
    direction: "ltr",
    sampleText: "Im Namen Allahs, des Allerbarmers, des Barmherzigen."
  },
  {
    id: "es",
    langCode: "es",
    languageArabic: "الإسبانية (خوليو كورتيس)",
    languageNative: "Español (Julio Cortés)",
    translator: "Julio Cortés",
    flag: "🇪🇸",
    direction: "ltr",
    sampleText: "En el nombre de Alá, el Compasivo, el Misericordioso."
  },
  {
    id: "fa",
    langCode: "fa",
    languageArabic: "الفارسية (مکارم شیرازی)",
    languageNative: "فارسی (مکارم شیرازی)",
    translator: "ناصر مکارم شیرازی",
    flag: "🇮🇷",
    direction: "rtl",
    sampleText: "به نام خداوند بخشنده بخشایشگر."
  },
  {
    id: "bn",
    langCode: "bn",
    languageArabic: "البنغالية (محيي الدين خان)",
    languageNative: "বাংলা (মুহিউদ্দীন খান)",
    translator: "মুহিউদ্দীন খান",
    flag: "🇧🇩",
    direction: "ltr",
    sampleText: "শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।"
  },
  {
    id: "zh",
    langCode: "zh",
    languageArabic: "الصينية (محمد ما جيان)",
    languageNative: "中文 (马坚 - Ma Jian)",
    translator: "马坚 (Ma Jian)",
    flag: "🇨🇳",
    direction: "ltr",
    sampleText: "奉至仁至慈的真主之名。"
  },
  {
    id: "hi",
    langCode: "hi",
    languageArabic: "الهندية (فاروق خان)",
    languageNative: "हिन्दी (फ़ारूक़ ख़ान)",
    translator: "फ़ारूक़ ख़ान और अहमद",
    flag: "🇮🇳",
    direction: "ltr",
    sampleText: "अल्लाह के नाम से, जो बड़ा कृपाशील, अत्यन्त दयावान है।"
  },
  {
    id: "ku",
    langCode: "ku",
    languageArabic: "الكردية (برهان محمد أمين)",
    languageNative: "کوردی (بورهان محەمەد ئەمین)",
    translator: "بورهان محەمەد ئەمین",
    flag: "☀️",
    direction: "rtl",
    sampleText: "بەناوی خوای بەخشندەی میهرەبان."
  },
  {
    id: "it",
    langCode: "it",
    languageArabic: "الإيطالية (حمزة بيكاردو)",
    languageNative: "Italiano (Hamza Piccardo)",
    translator: "Hamza Roberto Piccardo",
    flag: "🇮🇹",
    direction: "ltr",
    sampleText: "In nome di Allah, il Compassionevole, il Misericordioso."
  },
  {
    id: "pt",
    langCode: "pt",
    languageArabic: "البرتغالية (سمير الحايك)",
    languageNative: "Português (Samir El-Hayek)",
    translator: "Samir El-Hayek",
    flag: "🇵🇹",
    direction: "ltr",
    sampleText: "Em nome de Deus, o Clemente, o Misericordioso."
  },
  {
    id: "bs",
    langCode: "bs",
    languageArabic: "البوسنية (بسيم كوركوت)",
    languageNative: "Bosanski (Besim Korkut)",
    translator: "Besim Korkut",
    flag: "🇧🇦",
    direction: "ltr",
    sampleText: "U ime Allaha, Milostivog, Samilosnog!"
  },
  {
    id: "ms",
    langCode: "ms",
    languageArabic: "الماليزية (عبد الله باسميح)",
    languageNative: "Bahasa Melayu (Abdullah Basmeih)",
    translator: "Abdullah Muhammad Basmeih",
    flag: "🇲🇾",
    direction: "ltr",
    sampleText: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani."
  },
  {
    id: "sv",
    langCode: "sv",
    languageArabic: "السويدية (كنوت بيرنستروم)",
    languageNative: "Svenska (Knut Bernström)",
    translator: "Mohammed Knut Bernström",
    flag: "🇸🇪",
    direction: "ltr",
    sampleText: "I Guds, den Nåderikes, den Barmhärtiges namn."
  }
];

interface LanguageTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  readerSettings: ReaderSettings;
  setReaderSettings: React.Dispatch<React.SetStateAction<ReaderSettings>>;
}

export const LanguageTranslationModal: React.FC<LanguageTranslationModalProps> = ({
  isOpen,
  onClose,
  readerSettings,
  setReaderSettings
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredTranslations = TRANSLATIONS_LIST.filter(
    (t) =>
      t.languageArabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.languageNative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.translator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.langCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTranslation = (item: TranslationEdition) => {
    setReaderSettings((prev) => ({
      ...prev,
      showTranslation: true,
      translationLang: item.id as any
    }));
  };

  const handleToggleTranslationVisibility = (show: boolean) => {
    setReaderSettings((prev) => ({
      ...prev,
      showTranslation: show
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#1A202C] border border-[#C5A059]/40 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D3748] flex items-center justify-between bg-[#12161F]">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C5A059]" />
            <div>
              <span className="text-[10px] text-[#C5A059] uppercase font-mono tracking-widest block">
                World Translations ({TRANSLATIONS_LIST.length} Languages)
              </span>
              <h3 className="font-bold text-base sm:text-lg text-white font-tajawal">
                ترجمات معاني القرآن الكريم بمختلف اللغات
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#1A202C] border border-[#2D3748] text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Translation Toggle Bar */}
        <div className="p-4 bg-[#12161F] border-b border-[#2D3748] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-stone-200 font-medium">
              حالة ظهور الترجمة تحت آيات المصحف:
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 font-bold font-mono border ${
                readerSettings.showTranslation
                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                  : "bg-stone-800 text-stone-400 border-stone-600"
              }`}
            >
              {readerSettings.showTranslation ? "مفعلة الظهور" : "مخفية"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleTranslationVisibility(!readerSettings.showTranslation)}
              className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                readerSettings.showTranslation
                  ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059]"
                  : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
              }`}
            >
              {readerSettings.showTranslation ? "تعطيل الترجمة" : "تفعيل الترجمة الآن"}
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="p-3 sm:p-4 bg-[#1A202C] border-b border-[#2D3748]">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن لغة أو مترجم (إنجليزية، فرنسية، أردية، تركي، إندونيسي...)"
              className="w-full pl-3 pr-9 py-2 bg-[#12161F] border border-[#2D3748] focus:border-[#C5A059] text-stone-100 placeholder-stone-500 text-xs outline-none"
            />
          </div>
        </div>

        {/* Translation Cards List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredTranslations.map((t) => {
            const isSelected = readerSettings.translationLang === t.id && readerSettings.showTranslation;

            return (
              <div
                key={t.id}
                onClick={() => handleSelectTranslation(t)}
                className={`p-3.5 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-[#12161F] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/40"
                    : "bg-[#12161F] hover:bg-[#1A202C] border-[#2D3748] hover:border-stone-500"
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl select-none">{t.flag}</span>
                    <h4 className="font-bold text-sm text-stone-100 font-tajawal">
                      {t.languageArabic}
                    </h4>
                    <span className="text-xs text-[#C5A059] font-mono">({t.languageNative})</span>
                  </div>

                  <p className="text-[11px] text-stone-400 font-mono">
                    المترجم: {t.translator}
                  </p>

                  <p
                    dir={t.direction}
                    className={`text-xs text-stone-300 italic pt-1 ${
                      t.direction === "ltr" ? "text-left font-sans" : "text-right font-tajawal"
                    }`}
                  >
                    "{t.sampleText}"
                  </p>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTranslation(t);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer border ${
                      isSelected
                        ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059]"
                        : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>المختارة حالياً</span>
                      </>
                    ) : (
                      <span>اختيار هذه اللغة</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D3748] bg-[#12161F] flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono">
            جميع الترجمات معتمدة ومطابقة لمجمع الملك فهد لطباعة المصحف الشريف
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold cursor-pointer border border-[#8B6E3D] shadow-sm"
          >
            إغلاق وتطبيق
          </button>
        </div>
      </div>
    </div>
  );
};
