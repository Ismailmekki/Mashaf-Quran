import React, { useState, useEffect } from "react";
import {
  Heart,
  RotateCcw,
  Check,
  Sparkles,
  Volume2,
  ShieldCheck,
  Award,
  RefreshCw,
  Copy,
  Share2,
  BookOpen,
  Calendar
} from "lucide-react";
import { Dhikr, RenewableDua } from "../types";
import { ADHKAR_LIST, TASBEEH_PRESETS } from "../data/adhkarData";
import { RENEWABLE_DUAS_LIST, getRandomDua, getDailyDua } from "../data/renewableDuasData";
import confetti from "canvas-confetti";

export const AdhkarHisn: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("renewable_duas");
  const [adhkarState, setAdhkarState] = useState<Dhikr[]>(ADHKAR_LIST);

  // Renewable Duas state
  const [dailyDua, setDailyDua] = useState<RenewableDua>(getDailyDua());
  const [selectedDuaCategory, setSelectedDuaCategory] = useState<string>("all");
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  // Tasbeeh state
  const [selectedTasbeehIndex, setSelectedTasbeehIndex] = useState(0);
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [tasbeehTotalRounds, setTasbeehTotalRounds] = useState(0);

  const categories = [
    { id: "renewable_duas", label: "الأدعية المتجددة واليومية" },
    { id: "morning", label: "أذكار الصباح" },
    { id: "evening", label: "أذكار المساء" },
    { id: "sleep", label: "أذكار النوم" },
    { id: "post_prayer", label: "أذكار بعد الصلاة" },
    { id: "quran_duas", label: "جوامع الدعاء القرآني" },
    { id: "khatmah_dua", label: "دعاء ختم القرآن" },
    { id: "tasbeeh", label: "السبحة الإلكترونية" }
  ];

  const duaCategories = [
    { id: "all", label: "الكل" },
    { id: "prophets", label: "أدعية الأنبياء والمرسلين" },
    { id: "quranic", label: "جوامع الدعاء القرآني" },
    { id: "distress", label: "تفريج الكرب والهم" },
    { id: "rizq", label: "سعة الرزق والبركة" },
    { id: "forgiveness", label: "طلب المغفرة والتوبة" },
    { id: "guidance", label: "الهداية والثبات والصلاح" },
    { id: "parents", label: "بر الوالدين والذرية" }
  ];

  const handleIncrementDhikr = (id: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    setAdhkarState((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCount = Math.min(item.repeatCount, item.currentCount + 1);
          if (nextCount === item.repeatCount && item.currentCount < item.repeatCount) {
            try {
              confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
            } catch (e) {}
          }
          return { ...item, currentCount: nextCount };
        }
        return item;
      })
    );
  };

  const handleResetDhikr = (id: string) => {
    setAdhkarState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, currentCount: 0 } : item))
    );
  };

  const handleResetCategory = () => {
    setAdhkarState((prev) =>
      prev.map((item) =>
        item.category === activeCategory ? { ...item, currentCount: 0 } : item
      )
    );
  };

  const handleTasbeehTap = () => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
    const currentPreset = TASBEEH_PRESETS[selectedTasbeehIndex];
    const nextCount = tasbeehCount + 1;

    if (nextCount >= currentPreset.target) {
      setTasbeehCount(0);
      setTasbeehTotalRounds((r) => r + 1);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      setTasbeehCount(nextCount);
    }
  };

  const handleRefreshDailyDua = () => {
    setDailyDua(getRandomDua());
    try {
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.4 } });
    } catch {}
  };

  const handleCopyDua = (dua: RenewableDua) => {
    const textToCopy = `«${dua.arabic || dua.text}»\n${dua.source || dua.reference ? `[المصدر: ${dua.source || dua.reference}]` : ""}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedDuaId(dua.id);
      setTimeout(() => setCopiedDuaId(null), 2500);
    });
  };

  const handleShareDua = (dua: RenewableDua) => {
    const shareData = {
      title: dua.categoryName || dua.title || "دعاء متجدد",
      text: `«${dua.arabic || dua.text}»\n${dua.source || dua.reference ? `[المصدر: ${dua.source || dua.reference}]` : ""}`
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopyDua(dua);
    }
  };

  const filteredAdhkar = adhkarState.filter((a) => a.category === activeCategory);
  const filteredDuas = selectedDuaCategory === "all"
    ? RENEWABLE_DUAS_LIST
    : RENEWABLE_DUAS_LIST.filter((d) => d.category === selectedDuaCategory);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-6">
      {/* Category Pills Navigation with Geometric styling */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`btn-adhkar-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer uppercase tracking-wider border ${
                isActive
                  ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059] shadow-sm"
                  : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 1. RENEWABLE DUAS VIEW (الأدعية المتجددة) */}
      {activeCategory === "renewable_duas" && (
        <div className="space-y-6">
          {/* Daily Renewable Dua Card Header Frame */}
          <div className="p-6 sm:p-8 bg-[#1A202C] border-2 border-[#C5A059] relative overflow-hidden shadow-xl text-center space-y-4">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-geometric-hatch opacity-15 pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-geometric-hatch opacity-15 pointer-events-none" />

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#12161F] border border-[#C5A059] text-[#C5A059] text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>دعاء اليوم المتجدد</span>
              </span>
              <span className="px-2.5 py-1 bg-[#12161F] border border-[#2D3748] text-stone-400 text-xs font-mono">
                {dailyDua.categoryName || dailyDua.title || "دعاء مبارك"}
              </span>
            </div>

            {/* Arabic Dua Text */}
            <p className="font-quran text-2xl sm:text-3xl text-white leading-[2.2] select-text max-w-2xl mx-auto py-2">
              «{dailyDua.arabic || dailyDua.text}»
            </p>

            {/* Meaning & Virtue */}
            {dailyDua.virtue && (
              <p className="text-xs sm:text-sm text-[#E2C785] font-tajawal max-w-xl mx-auto">
                ✨ {dailyDua.virtue}
              </p>
            )}

            {/* Reference */}
            {(dailyDua.source || dailyDua.reference) && (
              <p className="text-[11px] text-stone-400 font-mono">
                المصدر: {dailyDua.source || dailyDua.reference}
              </p>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#2D3748]">
              <button
                onClick={handleRefreshDailyDua}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow border border-[#8B6E3D]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تجديد دعاء آخر</span>
              </button>

              <button
                onClick={() => handleCopyDua(dailyDua)}
                className="px-3 py-2 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDuaId === dailyDua.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[#C5A059]">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>نسخ</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleShareDua(dailyDua)}
                className="px-3 py-2 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>

          {/* Duas Library Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#2D3748]">
              <h4 className="font-bold text-sm text-[#C5A059] font-tajawal">
                مكتبة الأدعية المتجددة ({filteredDuas.length} دعاء)
              </h4>
              <span className="text-[11px] text-stone-400 font-mono">من القرآن والسنة النبوية</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {duaCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedDuaCategory(sub.id)}
                  className={`px-3 py-1 text-xs whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedDuaCategory === sub.id
                      ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                      : "bg-[#1A202C] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Renewable Duas List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="p-5 bg-[#1A202C] border border-[#2D3748] hover:border-[#C5A059] transition-all duration-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#C5A059] font-tajawal">
                      {dua.categoryName || dua.title || "دعاء مبارك"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#12161F] border border-[#2D3748] text-stone-400 font-mono">
                      {dua.categoryName || "دعاء مأثور"}
                    </span>
                  </div>

                  <p className="font-quran text-lg text-stone-100 leading-relaxed text-right py-1">
                    «{dua.arabic || dua.text}»
                  </p>

                  {dua.virtue && (
                    <p className="text-xs text-stone-300 mt-2 font-tajawal leading-relaxed">
                      ✨ {dua.virtue}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#2D3748] flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-stone-500 font-mono truncate">
                    {dua.source || dua.reference || "مأثور"}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyDua(dua)}
                      className="p-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 cursor-pointer"
                      title="نسخ الدعاء"
                    >
                      {copiedDuaId === dua.id ? (
                        <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShareDua(dua)}
                      className="p-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 cursor-pointer"
                      title="مشاركة الدعاء"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ELECTRONIC TASBEEH VIEW */}
      {activeCategory === "tasbeeh" && (
        <div className="p-8 bg-[#1A202C] border border-[#C5A059]/40 shadow-xl text-center space-y-6 max-w-lg mx-auto relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-36 h-36 bg-geometric-hatch opacity-10 pointer-events-none" />
          <div>
            <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase block">
              Digital Tasbeeh & Dhikr
            </span>
            <h3 className="text-2xl font-bold text-white font-tajawal mt-1">
              عداد التسبيح والاستغفار
            </h3>
          </div>

          {/* Presets Select */}
          <div className="flex flex-wrap justify-center gap-2">
            {TASBEEH_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedTasbeehIndex(idx);
                  setTasbeehCount(0);
                }}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border ${
                  selectedTasbeehIndex === idx
                    ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                    : "bg-[#12161F] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
                }`}
              >
                {p.text} ({p.target})
              </button>
            ))}
          </div>

          {/* Active Dhikr Display */}
          <div className="py-4">
            <p className="font-quran text-2xl sm:text-3xl text-[#C5A059] leading-relaxed font-bold">
              {TASBEEH_PRESETS[selectedTasbeehIndex].text}
            </p>
            <p className="text-xs text-stone-400 mt-2 font-mono">
              الهدف: {TASBEEH_PRESETS[selectedTasbeehIndex].target} مرة • الدورات المكتملة: ({tasbeehTotalRounds})
            </p>
          </div>

          {/* Huge Tap Target Button with Geometric Motif */}
          <div className="py-2">
            <button
              id="btn-tasbeeh-tap"
              onClick={handleTasbeehTap}
              className="w-44 h-44 sm:w-52 sm:h-52 bg-gradient-to-br from-[#C5A059] via-[#A8823B] to-[#8B6E3D] hover:brightness-110 text-[#1A202C] shadow-2xl border-4 border-[#E2C785] mx-auto flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform duration-100 group select-none"
            >
              <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-wider drop-shadow-sm">
                {tasbeehCount}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A202C] mt-1">اضغط للتسبيح</span>
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setTasbeehCount(0);
              setTasbeehTotalRounds(0);
            }}
            className="px-4 py-2 bg-[#12161F] hover:bg-[#2D3748] text-stone-300 hover:text-white text-xs flex items-center gap-1.5 mx-auto cursor-pointer border border-[#2D3748]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>تصفير العداد</span>
          </button>
        </div>
      )}

      {/* 3. STANDARD ADHKAR CARDS LIST (Morning, Evening, Sleep, Post-prayer, etc.) */}
      {activeCategory !== "renewable_duas" && activeCategory !== "tasbeeh" && (
        <div className="space-y-4">
          {/* Category Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-[#2D3748]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-bold text-base text-white font-tajawal">
                {categories.find((c) => c.id === activeCategory)?.label} ({filteredAdhkar.length})
              </h3>
            </div>
            <button
              onClick={handleResetCategory}
              className="text-xs text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer bg-[#1A202C] px-3 py-1 border border-[#2D3748] hover:border-[#C5A059]"
            >
              <RotateCcw className="w-3 h-3 text-[#C5A059]" />
              <span>إعادة ضبط العدادات</span>
            </button>
          </div>

          {/* Cards */}
          {filteredAdhkar.map((dhikr) => {
            const isCompleted = dhikr.currentCount >= dhikr.repeatCount;
            return (
              <div
                key={dhikr.id}
                onClick={() => handleIncrementDhikr(dhikr.id)}
                className={`p-5 border transition-all duration-200 cursor-pointer group ${
                  isCompleted
                    ? "bg-[#1A202C] border-[#C5A059] shadow-sm"
                    : "bg-[#1A202C] hover:bg-[#1f2735] border-[#2D3748] hover:border-[#C5A059]"
                }`}
              >
                {/* Header & Title */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-bold text-sm text-[#C5A059] font-tajawal">
                    {dhikr.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono px-2.5 py-0.5 font-bold border ${
                        isCompleted
                          ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059]"
                          : "bg-[#12161F] text-stone-300 border-[#2D3748]"
                      }`}
                    >
                      {dhikr.currentCount} / {dhikr.repeatCount}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetDhikr(dhikr.id);
                      }}
                      className="p-1 text-stone-500 hover:text-stone-300 cursor-pointer"
                      title="إعادة ضبط هذا الذكر"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Arabic Dhikr Text */}
                <p className="font-quran text-lg sm:text-xl text-stone-100 leading-loose text-right py-2 select-none">
                  {dhikr.arabic}
                </p>

                {/* Reward & Reference */}
                {(dhikr.reward || dhikr.reference) && (
                  <div className="mt-3 pt-2.5 border-t border-[#2D3748] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-stone-400 font-mono">
                    {dhikr.reward && (
                      <span className="text-[#C5A059] font-medium">✨ الفضل: {dhikr.reward}</span>
                    )}
                    {dhikr.reference && (
                      <span className="text-stone-500">المصدر: {dhikr.reference}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
