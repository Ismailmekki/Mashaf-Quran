import React from "react";
import { X, Type, Palette, BookOpen, Volume2, Globe } from "lucide-react";
import { ReaderSettings, QuranTheme } from "../types";

interface ReaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  setSettings: React.Dispatch<React.SetStateAction<ReaderSettings>>;
}

export const ReaderSettingsModal: React.FC<ReaderSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings
}) => {
  if (!isOpen) return null;

  const themes: { id: QuranTheme; label: string; bg: string; text: string; border: string }[] = [
    { id: "dark", label: "الليلي الفاخر (عقيق وذهب)", bg: "bg-[#0F141C]", text: "text-[#E2C785]", border: "border-[#C5A059]/40" },
    { id: "emerald", label: "الزمردي الملكي (مسجد أخضر)", bg: "bg-[#05231C]", text: "text-emerald-300", border: "border-emerald-500/40" },
    { id: "sapphire", label: "الياقوتي الأزرق (كحلي ملكي)", bg: "bg-[#0A192F]", text: "text-sky-300", border: "border-sky-500/40" },
    { id: "amber", label: "المسك والعنبر (أصيل دافئ)", bg: "bg-[#1A1218]", text: "text-amber-300", border: "border-amber-500/40" },
    { id: "sepia", label: "الورق القرآني القديم (مريح للعين)", bg: "bg-[#FBF7EE]", text: "text-[#2C221E]", border: "border-[#8B6E3D]/40" },
    { id: "classic", label: "النهار الصافي (أبيض نقي)", bg: "bg-white", text: "text-slate-900", border: "border-slate-300" }
  ];

  const fonts = [
    { id: "amiri", label: "خط الأميري القرآني الأصيل", fontClass: "font-amiri" },
    { id: "quran", label: "خط مصحف المدينة المنورة", fontClass: "font-quran" },
    { id: "scheherazade", label: "خط شهرزاد الكلاسيكي", fontClass: "font-scheherazade" },
    { id: "cairo", label: "خط القاهرة العصري", fontClass: "font-cairo" },
    { id: "tajawal", label: "خط تجوال الواضح", fontClass: "font-tajawal" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#1A202C] border border-[#C5A059]/40 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D3748] flex items-center justify-between bg-[#12161F]">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-[#C5A059]" />
            <div>
              <span className="text-[10px] text-[#C5A059] uppercase font-mono tracking-widest block">Settings</span>
              <h3 className="font-bold text-base sm:text-lg text-white font-tajawal">
                إعدادات المصحف والخط
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* 1. Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-semibold text-stone-300 font-mono">
                حجم خط الآيات الكريمة
              </label>
              <span className="text-xs font-mono text-[#C5A059] font-bold">
                {settings.fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="42"
              step="2"
              value={settings.fontSize}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, fontSize: Number(e.target.value) }))
              }
              className="w-full h-1 bg-[#12161F] cursor-pointer accent-[#C5A059]"
            />
            {/* Live Font Preview */}
            <div className="mt-3 p-4 bg-[#12161F] border border-[#2D3748] text-center">
              <p
                style={{ fontSize: `${settings.fontSize}px` }}
                className="font-quran text-[#C5A059] leading-relaxed"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
              </p>
            </div>
          </div>

          {/* 2. Arabic Font Family */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-300 mb-2 font-mono">
              نوع الخط العربي
            </label>
            <div className="space-y-1.5">
              {fonts.map((f) => {
                const isSelected = settings.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() =>
                      setSettings((prev) => ({ ...prev, fontFamily: f.id as any }))
                    }
                    className={`w-full p-2.5 border text-right text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#12161F] border-[#C5A059] text-[#C5A059] font-bold"
                        : "bg-[#12161F] hover:bg-[#2D3748] border-[#2D3748] text-stone-300"
                    }`}
                  >
                    <span className={f.fontClass}>{f.label}</span>
                    {isSelected && <span className="text-[#C5A059] font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Quran Theme */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-300 mb-2 flex items-center gap-1.5 font-mono">
              <Palette className="w-4 h-4 text-[#C5A059]" />
              <span>مظهر ولون المصحف</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => {
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSettings((prev) => ({ ...prev, theme: t.id }))}
                    className={`p-3 border text-xs text-right transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-[#C5A059] ring-2 ring-[#C5A059]/40"
                        : "border-[#2D3748] hover:border-stone-700"
                    } ${t.bg} ${t.text}`}
                  >
                    <span className="font-semibold">{t.label}</span>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Tafseer Source */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-stone-300 mb-2 flex items-center gap-1.5 font-mono">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span>مكتبة التفاسير المعتمدة (10 تفاسير)</span>
            </label>
            <select
              value={settings.selectedTafseer}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, selectedTafseer: e.target.value as any }))
              }
              className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-200 text-xs outline-none cursor-pointer focus:border-[#C5A059]"
            >
              <option value="muyassar">التفسير الميسر (مجمع الملك فهد)</option>
              <option value="saadi">تيسير الكريم الرحمن (تفسير الشيخ السعدي)</option>
              <option value="ibnkathir">تفسير القرآن العظيم (ابن كثير)</option>
              <option value="tabari">جامع البيان في تأويل آي القرآن (الطبري)</option>
              <option value="qurtubi">الجامع لأحكام القرآن (القرطبي)</option>
              <option value="baghawi">معالم التنزيل (تفسير البغوي)</option>
              <option value="jalalayn">تفسير الجلالين (المحلي والسيوطي)</option>
              <option value="waseet">التفسير الوسيط للقرآن الكريم (د. طنطاوي)</option>
              <option value="tanweer">التحرير والتنوير (الشيخ ابن عاشور)</option>
              <option value="eerab">إعراب القرآن الكريم وبيانه (محيي الدين درويش)</option>
            </select>
          </div>

          {/* 5. Translations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-stone-300 flex items-center gap-1.5 font-mono">
                <Globe className="w-4 h-4 text-[#C5A059]" />
                <span>إظهار الترجمة اللغوية تحت الآيات</span>
              </label>
              <input
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, showTranslation: e.target.checked }))
                }
                className="w-4 h-4 accent-[#C5A059] cursor-pointer"
              />
            </div>

            {settings.showTranslation && (
              <select
                value={settings.translationLang}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, translationLang: e.target.value as any }))
                }
                className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-200 text-xs outline-none cursor-pointer focus:border-[#C5A059]"
              >
                <option value="en">🇬🇧 الإنجليزية - English (Sahih International)</option>
                <option value="en.khattab">🇺🇸 الإنجليزية المعاصرة - Clear Quran (Dr. Mustafa Khattab)</option>
                <option value="en.yusufali">🇬🇧 الإنجليزية الكلاسيكية - (Abdullah Yusuf Ali)</option>
                <option value="fr">🇫🇷 الفرنسية - Français (Muhammad Hamidullah)</option>
                <option value="ur">🇵🇰 الأردية - اردو (فتح محمد جالندھری)</option>
                <option value="tr">🇹🇷 التركية - Türkçe (Diyanet İşleri)</option>
                <option value="id">🇮🇩 الإندونيسية - Bahasa Indonesia (Kemenag)</option>
                <option value="ru">🇷🇺 الروسية - Русский (Эльмир Кулиев)</option>
                <option value="de">🇩🇪 الألمانية - Deutsch (Bubenheim & Elyas)</option>
                <option value="es">🇪🇸 الإسبانية - Español (Julio Cortés)</option>
                <option value="fa">🇮🇷 الفارسية - فارسی (مکارم شیرازی)</option>
                <option value="bn">🇧🇩 البنغالية - বাংলা (মুহিউদ্দীন খান)</option>
                <option value="zh">🇨🇳 الصينية - 中文 (马坚 - Ma Jian)</option>
                <option value="hi">🇮🇳 الهندية - हिन्दी (फ़ारूक़ ख़ान)</option>
                <option value="ku">☀️ الكردية - کوردی (بورهان محەمەد ئەمین)</option>
                <option value="it">🇮🇹 الإيطالية - Italiano (Hamza Piccardo)</option>
                <option value="pt">🇵🇹 البرتغالية - Português (Samir El-Hayek)</option>
                <option value="bs">🇧🇦 البوسنية - Bosanski (Besim Korkut)</option>
                <option value="ms">🇲🇾 الماليزية - Bahasa Melayu (Abdullah Basmeih)</option>
                <option value="sv">🇸🇪 السويدية - Svenska (Knut Bernström)</option>
              </select>
            )}
          </div>

          {/* 6. Hifz and Memorization Settings */}
          <div className="p-3.5 bg-[#12161F] border border-[#C5A059]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#C5A059] block font-mono">وضع التحفيظ وتكرار الآيات (Hifz Mode)</span>
                <span className="text-[11px] text-stone-400">تكرار الآية صوتياً للمساعدة على التثبيت والحفظ</span>
              </div>
              <input
                type="checkbox"
                checked={!!settings.hifzMode}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, hifzMode: e.target.checked }))
                }
                className="w-4 h-4 accent-[#C5A059] cursor-pointer"
              />
            </div>

            {settings.hifzMode && (
              <div className="space-y-2.5 pt-2 border-t border-[#2D3748]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-300">مرات تكرار الآية:</span>
                  <select
                    value={settings.hifzRepeatCount || 3}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, hifzRepeatCount: Number(e.target.value) }))
                    }
                    className="p-1.5 bg-[#1A202C] border border-[#2D3748] text-xs text-[#C5A059] font-bold"
                  >
                    <option value={1}>مرة واحدة (1)</option>
                    <option value={3}>3 مرات</option>
                    <option value={5}>5 مرات</option>
                    <option value={7}>7 مرات</option>
                    <option value={10}>10 مرات</option>
                    <option value={20}>20 مرة (تثبيت متقن)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-300">إخفاء نص الآية (اختبار الحفظ الذاتي):</span>
                  <input
                    type="checkbox"
                    checked={!!settings.hifzHideText}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, hifzHideText: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#C5A059] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. Auto-Scroll */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2D3748]">
            <span className="text-xs sm:text-sm text-stone-300 font-mono">
              تمرير الشاشة تلقائياً مع تلاوة الآية
            </span>
            <input
              type="checkbox"
              checked={settings.autoScroll}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, autoScroll: e.target.checked }))
              }
              className="w-4 h-4 accent-[#C5A059] cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D3748] bg-[#12161F] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold cursor-pointer shadow-sm border border-[#8B6E3D]"
          >
            تم وحفظ
          </button>
        </div>
      </div>
    </div>
  );
};
