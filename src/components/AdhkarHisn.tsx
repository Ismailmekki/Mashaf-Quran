import React, { useState, useEffect } from "react";
import {
  Heart,
  RotateCcw,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  Award,
  RefreshCw,
  Copy,
  Share2,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  X,
  Tag
} from "lucide-react";
import { Dhikr, RenewableDua } from "../types";
import { ADHKAR_LIST, TASBEEH_PRESETS } from "../data/adhkarData";
import { RENEWABLE_DUAS_LIST, getRandomDua, getDailyDua } from "../data/renewableDuasData";
import { playTasbeehClickSound, playCompletionChime } from "../utils/audioFeedback";
import confetti from "canvas-confetti";

interface CustomDua {
  id: string;
  title: string;
  arabic: string;
  category: string;
  virtue?: string;
  source?: string;
  createdAt: number;
  count?: number;
}

interface CustomTasbeeh {
  id: string;
  text: string;
  target: number;
}

export const AdhkarHisn: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("renewable_duas");
  const [adhkarState, setAdhkarState] = useState<Dhikr[]>(ADHKAR_LIST);

  // Renewable Duas state
  const [dailyDua, setDailyDua] = useState<RenewableDua>(getDailyDua());
  const [selectedDuaCategory, setSelectedDuaCategory] = useState<string>("all");
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  // Custom User Duas state
  const [customDuas, setCustomDuas] = useState<CustomDua[]>(() => {
    try {
      const saved = localStorage.getItem("quran_custom_user_duas");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddDuaModalOpen, setIsAddDuaModalOpen] = useState(false);
  const [editingDuaId, setEditingDuaId] = useState<string | null>(null);
  const [duaFormTitle, setDuaFormTitle] = useState("");
  const [duaFormArabic, setDuaFormArabic] = useState("");
  const [duaFormCategory, setDuaFormCategory] = useState("شخصي");
  const [duaFormVirtue, setDuaFormVirtue] = useState("");

  // Tasbeeh state
  const [tasbeehList, setTasbeehList] = useState<CustomTasbeeh[]>(() => {
    try {
      const saved = localStorage.getItem("quran_custom_tasbeeh_list");
      return saved ? JSON.parse(saved) : TASBEEH_PRESETS.map((p, idx) => ({ id: `preset-${idx}`, text: p.text, target: p.target }));
    } catch {
      return TASBEEH_PRESETS.map((p, idx) => ({ id: `preset-${idx}`, text: p.text, target: p.target }));
    }
  });
  const [selectedTasbeehIndex, setSelectedTasbeehIndex] = useState(0);
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [tasbeehTotalRounds, setTasbeehTotalRounds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAddTasbeehModalOpen, setIsAddTasbeehModalOpen] = useState(false);
  const [newTasbeehText, setNewTasbeehText] = useState("");
  const [newTasbeehTarget, setNewTasbeehTarget] = useState(33);

  // Lifetime tasbeeh stats
  const [lifetimeTasbeehClicks, setLifetimeTasbeehClicks] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("quran_lifetime_tasbeeh_count");
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Save custom Duas to local storage
  useEffect(() => {
    try {
      localStorage.setItem("quran_custom_user_duas", JSON.stringify(customDuas));
    } catch (e) {}
  }, [customDuas]);

  // Save custom tasbeeh list to local storage
  useEffect(() => {
    try {
      localStorage.setItem("quran_custom_tasbeeh_list", JSON.stringify(tasbeehList));
    } catch (e) {}
  }, [tasbeehList]);

  // Save lifetime tasbeeh
  useEffect(() => {
    try {
      localStorage.setItem("quran_lifetime_tasbeeh_count", String(lifetimeTasbeehClicks));
    } catch (e) {}
  }, [lifetimeTasbeehClicks]);

  const categories = [
    { id: "renewable_duas", label: "الأدعية المتجددة والخاصة" },
    { id: "tasbeeh", label: "السبحة الإلكترونية الذكية" },
    { id: "morning", label: "أذكار الصباح" },
    { id: "evening", label: "أذكار المساء" },
    { id: "sleep", label: "أذكار النوم" },
    { id: "post_prayer", label: "أذكار بعد الصلاة" },
    { id: "quran_duas", label: "جوامع الدعاء القرآني" },
    { id: "khatmah_dua", label: "دعاء ختم القرآن" }
  ];

  const duaCategories = [
    { id: "all", label: "الكل" },
    { id: "my_duas", label: `أدعيتي الخاصة (${customDuas.length})` },
    { id: "prophets", label: "أدعية الأنبياء والمرسلين" },
    { id: "quranic", label: "جوامع الدعاء القرآني" },
    { id: "distress", label: "تفريج الكرب والهم" },
    { id: "rizq", label: "سعة الرزق والبركة" },
    { id: "forgiveness", label: "طلب المغفرة والتوبة" },
    { id: "guidance", label: "الهداية والثبات والصلاح" },
    { id: "parents", label: "بر الوالدين والذرية" }
  ];

  const handleIncrementDhikr = (id: string) => {
    if (soundEnabled) {
      playTasbeehClickSound();
    }
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
    setAdhkarState((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCount = Math.min(item.repeatCount, item.currentCount + 1);
          if (nextCount === item.repeatCount && item.currentCount < item.repeatCount) {
            playCompletionChime();
            try {
              confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
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

  // Tasbeeh interactive tap
  const handleTasbeehTap = () => {
    if (soundEnabled) {
      playTasbeehClickSound();
    }
    if (navigator.vibrate) {
      navigator.vibrate(35);
    }

    setLifetimeTasbeehClicks((c) => c + 1);

    const activeTasbeeh = tasbeehList[selectedTasbeehIndex] || tasbeehList[0];
    const target = activeTasbeeh ? activeTasbeeh.target : 33;
    const nextCount = tasbeehCount + 1;

    if (nextCount >= target) {
      setTasbeehCount(0);
      setTasbeehTotalRounds((r) => r + 1);
      playCompletionChime();
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      setTasbeehCount(nextCount);
    }
  };

  const handleRefreshDailyDua = () => {
    setDailyDua(getRandomDua());
    if (soundEnabled) playTasbeehClickSound();
    try {
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.4 } });
    } catch {}
  };

  const handleCopyDua = (dua: RenewableDua | CustomDua) => {
    const textToCopy = `«${dua.arabic || (dua as any).text}»\n${dua.source || (dua as any).reference ? `[المصدر: ${dua.source || (dua as any).reference}]` : ""}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedDuaId(dua.id);
      setTimeout(() => setCopiedDuaId(null), 2500);
    });
  };

  const handleShareDua = (dua: RenewableDua | CustomDua) => {
    const shareData = {
      title: dua.title || (dua as any).categoryName || "دعاء مبارك",
      text: `«${dua.arabic || (dua as any).text}»\n${dua.source || (dua as any).reference ? `[المصدر: ${dua.source || (dua as any).reference}]` : ""}`
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopyDua(dua);
    }
  };

  // Add or Edit Custom Dua
  const handleSaveCustomDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duaFormArabic.trim()) return;

    if (editingDuaId) {
      setCustomDuas((prev) =>
        prev.map((d) =>
          d.id === editingDuaId
            ? {
                ...d,
                title: duaFormTitle.trim() || "دعاء خاص",
                arabic: duaFormArabic.trim(),
                category: duaFormCategory,
                virtue: duaFormVirtue.trim()
              }
            : d
        )
      );
    } else {
      const newDua: CustomDua = {
        id: `custom-dua-${Date.now()}`,
        title: duaFormTitle.trim() || "دعاء خاص",
        arabic: duaFormArabic.trim(),
        category: duaFormCategory,
        virtue: duaFormVirtue.trim(),
        source: "أدعيتي الخاصة",
        createdAt: Date.now(),
        count: 0
      };
      setCustomDuas((prev) => [newDua, ...prev]);
    }

    setIsAddDuaModalOpen(false);
    setEditingDuaId(null);
    setDuaFormTitle("");
    setDuaFormArabic("");
    setDuaFormVirtue("");
    setSelectedDuaCategory("my_duas");

    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.5 } });
    } catch {}
  };

  const handleDeleteCustomDua = (id: string) => {
    setCustomDuas((prev) => prev.filter((d) => d.id !== id));
  };

  const handleEditCustomDua = (dua: CustomDua) => {
    setEditingDuaId(dua.id);
    setDuaFormTitle(dua.title);
    setDuaFormArabic(dua.arabic);
    setDuaFormCategory(dua.category);
    setDuaFormVirtue(dua.virtue || "");
    setIsAddDuaModalOpen(true);
  };

  // Add custom tasbeeh
  const handleSaveCustomTasbeeh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTasbeehText.trim()) return;

    const newItem: CustomTasbeeh = {
      id: `tasbeeh-${Date.now()}`,
      text: newTasbeehText.trim(),
      target: Number(newTasbeehTarget) || 33
    };

    setTasbeehList((prev) => [...prev, newItem]);
    setSelectedTasbeehIndex(tasbeehList.length);
    setTasbeehCount(0);
    setIsAddTasbeehModalOpen(false);
    setNewTasbeehText("");
    setNewTasbeehTarget(33);
  };

  const filteredAdhkar = adhkarState.filter((a) => a.category === activeCategory);

  // Combine standard and custom duas
  const displayedDuas = selectedDuaCategory === "my_duas"
    ? customDuas
    : selectedDuaCategory === "all"
    ? [...customDuas, ...RENEWABLE_DUAS_LIST]
    : RENEWABLE_DUAS_LIST.filter((d) => d.category === selectedDuaCategory);

  const activeTasbeeh = tasbeehList[selectedTasbeehIndex] || tasbeehList[0] || { text: "سبحان الله", target: 33 };
  const tasbeehProgress = Math.min(100, (tasbeehCount / (activeTasbeeh.target || 33)) * 100);

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

      {/* 1. RENEWABLE DUAS VIEW (الأدعية المتجددة + أدعيتي الخاصة + زر إضافة دعاء) */}
      {activeCategory === "renewable_duas" && (
        <div className="space-y-6">
          {/* Daily Renewable Dua Card Header Frame */}
          <div className="p-6 sm:p-8 bg-[#1A202C] border-2 border-[#C5A059] relative overflow-hidden shadow-xl text-center space-y-4">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-geometric-hatch opacity-15 pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-geometric-hatch opacity-15 pointer-events-none" />

            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[#2D3748]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#12161F] border border-[#C5A059] text-[#C5A059] text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>دعاء اليوم المتجدد</span>
                </span>
                <span className="px-2.5 py-1 bg-[#12161F] border border-[#2D3748] text-stone-400 text-xs font-mono">
                  {dailyDua.categoryName || dailyDua.title || "دعاء مبارك"}
                </span>
              </div>

              {/* Prominent Add Dua Button right at the top */}
              <button
                id="btn-open-add-dua-modal"
                onClick={() => {
                  setEditingDuaId(null);
                  setDuaFormTitle("");
                  setDuaFormArabic("");
                  setDuaFormVirtue("");
                  setIsAddDuaModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md border border-[#8B6E3D]"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة دعاء جديد</span>
              </button>
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

          {/* Duas Library Category Filter + Add Dua Toolbar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#2D3748]">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[#C5A059] font-tajawal">
                  مكتبة الأدعية والأوراد ({displayedDuas.length} دعاء)
                </h4>
                {customDuas.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E2C785]">
                    {customDuas.length} من أدعيتك الخاصة
                  </span>
                )}
              </div>

              <button
                id="btn-add-custom-dua-pill"
                onClick={() => {
                  setEditingDuaId(null);
                  setDuaFormTitle("");
                  setDuaFormArabic("");
                  setDuaFormVirtue("");
                  setIsAddDuaModalOpen(true);
                }}
                className="px-3 py-1 bg-[#12161F] hover:bg-[#2D3748] border border-[#C5A059] text-[#C5A059] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة دعاء</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {duaCategories.map((sub) => (
                <button
                  key={sub.id}
                  id={`filter-dua-${sub.id}`}
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

          {/* Renewable & Custom Duas List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedDuas.map((dua: any) => {
              const isCustom = !!dua.createdAt;
              return (
                <div
                  key={dua.id}
                  className={`p-5 bg-[#1A202C] border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                    isCustom
                      ? "border-[#C5A059]/60 shadow-sm ring-1 ring-[#C5A059]/20"
                      : "border-[#2D3748] hover:border-[#C5A059]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-[#C5A059] font-tajawal">
                        {dua.title || dua.categoryName || "دعاء مبارك"}
                      </span>
                      <div className="flex items-center gap-1">
                        {isCustom ? (
                          <span className="text-[10px] px-2 py-0.5 bg-[#C5A059] text-[#1A202C] font-bold font-mono">
                            دعاء خاص بك
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-[#12161F] border border-[#2D3748] text-stone-400 font-mono">
                            {dua.categoryName || "دعاء مأثور"}
                          </span>
                        )}
                      </div>
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
                      {dua.source || dua.reference || (isCustom ? "أدعيتي الخاصة" : "مأثور")}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCustom && (
                        <>
                          <button
                            onClick={() => handleEditCustomDua(dua)}
                            className="p-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 hover:text-white cursor-pointer"
                            title="تعديل الدعاء"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomDua(dua.id)}
                            className="p-1.5 bg-[#12161F] hover:bg-rose-950/60 border border-[#2D3748] text-rose-400 hover:text-rose-300 cursor-pointer"
                            title="حذف الدعاء"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
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
              );
            })}
          </div>

          {displayedDuas.length === 0 && (
            <div className="text-center py-12 border border-[#2D3748] bg-[#1A202C] space-y-3">
              <Sparkles className="w-10 h-10 text-[#C5A059]/40 mx-auto" />
              <p className="text-stone-300 font-medium">لم تقم بإضافة أدعية خاصة بعد</p>
              <button
                onClick={() => setIsAddDuaModalOpen(true)}
                className="px-4 py-2 bg-[#C5A059] text-[#1A202C] font-bold text-xs cursor-pointer shadow"
              >
                اضغط هنا لإضافة أول دعاء لك
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. ELECTRONIC TASBEEH VIEW (السبحة الإلكترونية التفاعلية المطورة) */}
      {activeCategory === "tasbeeh" && (
        <div className="p-6 sm:p-8 bg-[#1A202C] border border-[#C5A059]/40 shadow-2xl text-center space-y-6 max-w-lg mx-auto relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-36 h-36 bg-geometric-hatch opacity-10 pointer-events-none" />
          
          {/* Top Header Controls */}
          <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
            <div className="text-right">
              <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase block">
                Interactive Smart Tasbeeh
              </span>
              <h3 className="text-xl font-bold text-white font-tajawal">
                السبحة الإلكترونية الذكية
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 border text-xs cursor-pointer ${
                  soundEnabled
                    ? "bg-[#12161F] text-[#C5A059] border-[#C5A059]"
                    : "bg-[#12161F] text-stone-500 border-[#2D3748]"
                }`}
                title={soundEnabled ? "كتم صوت النقر" : "تفعيل صوت النقر"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Add Custom Tasbeeh */}
              <button
                onClick={() => setIsAddTasbeehModalOpen(true)}
                className="px-2.5 py-1.5 bg-[#C5A059] text-[#1A202C] text-xs font-bold flex items-center gap-1 cursor-pointer border border-[#8B6E3D]"
                title="إضافة تسبيحة مخصصة"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>تسبيحة جديدة</span>
              </button>
            </div>
          </div>

          {/* Presets Select Horizontal Bar */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {tasbeehList.map((p, idx) => (
              <button
                key={p.id || idx}
                onClick={() => {
                  setSelectedTasbeehIndex(idx);
                  setTasbeehCount(0);
                  if (soundEnabled) playTasbeehClickSound();
                }}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border ${
                  selectedTasbeehIndex === idx
                    ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059] shadow-sm"
                    : "bg-[#12161F] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
                }`}
              >
                {p.text} ({p.target})
              </button>
            ))}
          </div>

          {/* Active Dhikr Display */}
          <div className="py-2">
            <p className="font-quran text-2xl sm:text-3xl text-[#C5A059] leading-relaxed font-bold">
              {activeTasbeeh.text}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-stone-400 mt-2 font-mono">
              <span>الهدف: {activeTasbeeh.target}</span>
              <span>•</span>
              <span>الدورات المكتملة: {tasbeehTotalRounds}</span>
              <span>•</span>
              <span>الإجمالي العام: {lifetimeTasbeehClicks}</span>
            </div>
          </div>

          {/* Huge Circular Tap Target Button with Interactive Ring Progress */}
          <div className="py-2 flex justify-center">
            <button
              id="btn-tasbeeh-tap"
              onClick={handleTasbeehTap}
              className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#12161F] via-[#1A202C] to-[#252F3F] border-4 border-[#C5A059] shadow-2xl flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform duration-100 group select-none hover:border-[#E2C785]"
            >
              {/* Progress Ring Highlight */}
              <div
                className="absolute inset-0 rounded-full border-4 border-[#E2C785] transition-all pointer-events-none opacity-40"
                style={{
                  clipPath: `polygon(50% 50%, -50% -50%, ${tasbeehProgress * 2}% 0%, 100% 100%)`
                }}
              />

              <span className="text-5xl sm:text-6xl font-extrabold font-mono text-[#E2C785] tracking-wider drop-shadow-md">
                {tasbeehCount}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] mt-2 group-hover:text-white transition-colors">
                اضغط للتسبيح
              </span>
              <span className="text-[10px] text-stone-400 font-mono mt-0.5">
                {tasbeehCount} / {activeTasbeeh.target}
              </span>
            </button>
          </div>

          {/* Reset Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setTasbeehCount(0);
                if (soundEnabled) playTasbeehClickSound();
              }}
              className="px-4 py-2 bg-[#12161F] hover:bg-[#2D3748] text-stone-300 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer border border-[#2D3748]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>تصفير الدورة الحالية</span>
            </button>

            <button
              onClick={() => {
                setTasbeehCount(0);
                setTasbeehTotalRounds(0);
                if (soundEnabled) playTasbeehClickSound();
              }}
              className="px-3 py-2 bg-[#12161F] hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 text-xs flex items-center gap-1 cursor-pointer border border-[#2D3748]"
              title="تصفير الدورات"
            >
              <span>تصفير الدورات</span>
            </button>
          </div>
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

      {/* Modal 1: Add / Edit Custom Dua */}
      {isAddDuaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A202C] border border-[#C5A059]/40 w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#2D3748] flex items-center justify-between bg-[#12161F]">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-bold text-base text-white font-tajawal">
                  {editingDuaId ? "تعديل الدعاء" : "إضافة دعاء جديد"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddDuaModalOpen(false)}
                className="p-1.5 bg-[#1A202C] border border-[#2D3748] text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomDua} className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-mono">عنوان أو مناسبة الدعاء:</label>
                <input
                  type="text"
                  required
                  value={duaFormTitle}
                  onChange={(e) => setDuaFormTitle(e.target.value)}
                  placeholder="مثال: دعاء تيسير الأمور، دعاء للوالدين، دعاء الشفاء..."
                  className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-100 text-xs outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-mono">نص الدعاء المبارك (بالعربية):</label>
                <textarea
                  required
                  rows={4}
                  value={duaFormArabic}
                  onChange={(e) => setDuaFormArabic(e.target.value)}
                  placeholder="اكتب أو الصق نص الدعاء هنا..."
                  className="w-full p-3 bg-[#12161F] border border-[#2D3748] text-stone-100 text-sm font-quran outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-mono">التصنيف:</label>
                  <select
                    value={duaFormCategory}
                    onChange={(e) => setDuaFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-200 text-xs outline-none focus:border-[#C5A059]"
                  >
                    <option value="شخصي">أدعية شخصية</option>
                    <option value="للأهل والوالدين">للأهل والوالدين</option>
                    <option value="للأبناء والذرية">للأبناء والذرية</option>
                    <option value="تفريج الكرب">تفريج الكرب والهم</option>
                    <option value="الرزق والبركة">الرزق والبركة</option>
                    <option value="الشفاء والعافية">الشفاء والعافية</option>
                    <option value="النجاح والتوفيق">النجاح والتوفيق</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-mono">ملاحظة أو فضل (اختياري):</label>
                  <input
                    type="text"
                    value={duaFormVirtue}
                    onChange={(e) => setDuaFormVirtue(e.target.value)}
                    placeholder="مثال: يقال عند السجود، أو في جوف الليل..."
                    className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-100 text-xs outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#2D3748] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDuaModalOpen(false)}
                  className="px-4 py-2 bg-[#12161F] hover:bg-[#2D3748] text-stone-300 text-xs cursor-pointer border border-[#2D3748]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold cursor-pointer border border-[#8B6E3D] shadow-sm"
                >
                  {editingDuaId ? "حفظ التعديلات" : "إضافة الدعاء"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Custom Tasbeeh */}
      {isAddTasbeehModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A202C] border border-[#C5A059]/40 w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2D3748] flex items-center justify-between bg-[#12161F]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-bold text-base text-white font-tajawal">
                  إضافة تسبيحة مخصصة
                </h3>
              </div>
              <button
                onClick={() => setIsAddTasbeehModalOpen(false)}
                className="p-1.5 bg-[#1A202C] border border-[#2D3748] text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomTasbeeh} className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-mono">نص التسبيحة أو الذكر:</label>
                <input
                  type="text"
                  required
                  value={newTasbeehText}
                  onChange={(e) => setNewTasbeehText(e.target.value)}
                  placeholder="مثال: اللهم صلّ وسلم على نبينا محمد..."
                  className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-100 text-sm font-quran outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-mono">الهدف / عدد التكرار:</label>
                <select
                  value={newTasbeehTarget}
                  onChange={(e) => setNewTasbeehTarget(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-200 text-xs outline-none focus:border-[#C5A059]"
                >
                  <option value={33}>33 مرة (سنة الأذكار)</option>
                  <option value={100}>100 مرة (مضاعفة الأجر)</option>
                  <option value={500}>500 مرة</option>
                  <option value={1000}>1000 مرة (ورد كبير)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#2D3748] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTasbeehModalOpen(false)}
                  className="px-4 py-2 bg-[#12161F] hover:bg-[#2D3748] text-stone-300 text-xs cursor-pointer border border-[#2D3748]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold cursor-pointer border border-[#8B6E3D] shadow-sm"
                >
                  إضافة للسبحة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
