import React, { useState, useEffect } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  RotateCcw,
  Sparkles,
  Share2,
  Users,
  UserPlus,
  Trash2,
  Copy,
  Check,
  Filter,
  Send,
  MessageCircle,
  BookMarked,
  UserCheck,
  Calendar,
  X,
  HeartHandshake
} from "lucide-react";
import { KhatmahPlan, GroupKhatmah, GroupKhatmahJuz } from "../types";
import { ALL_30_JUZ, createInitialJuzAssignments } from "../data/juzData";
import confetti from "canvas-confetti";

interface KhatmahTrackerProps {
  onOpenSurahByPage: (pageNumber: number) => void;
  khatmahPlan: KhatmahPlan;
  setKhatmahPlan: React.Dispatch<React.SetStateAction<KhatmahPlan>>;
}

const DEFAULT_GROUP_KHATMAH: GroupKhatmah = {
  id: "group_khatmah_1",
  title: "ختمة القرآن الكريم التشاركية المباركة",
  intention: "نية القربة إلى الله وثواب للأهل والأحباب والمسلمين",
  createdAt: new Date().toISOString(),
  targetDate: "رمضان 1448 هـ",
  participants: ["أنا (صاحب الختمة)", "الأهل والأقارب", "صديق 1"],
  juzAssignments: createInitialJuzAssignments(),
  isCompleted: false
};

export const KhatmahTracker: React.FC<KhatmahTrackerProps> = ({
  onOpenSurahByPage,
  khatmahPlan,
  setKhatmahPlan
}) => {
  // Main Tab: 'group' (Collective Khatmah with Roles & WhatsApp) | 'individual' (Solo Khatmah) | 'duaa' (Khatm Duaa)
  const [activeKhatmahTab, setActiveKhatmahTab] = useState<"group" | "individual" | "duaa">("group");

  // Group Khatmah State with LocalStorage
  const [groupKhatmah, setGroupKhatmah] = useState<GroupKhatmah>(() => {
    const saved = localStorage.getItem("quran_group_khatmah");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.juzAssignments && parsed.juzAssignments.length === 30) {
          return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_GROUP_KHATMAH;
  });

  useEffect(() => {
    localStorage.setItem("quran_group_khatmah", JSON.stringify(groupKhatmah));
  }, [groupKhatmah]);

  // UI States for Group Khatmah
  const [newParticipantName, setNewParticipantName] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "reading" | "unassigned">("all");
  const [filterParticipant, setFilterParticipant] = useState<string>("all");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [khatmahTitleInput, setKhatmahTitleInput] = useState(groupKhatmah.title);
  const [khatmahIntentionInput, setKhatmahIntentionInput] = useState(groupKhatmah.intention || "");

  // Just Completed Modal / Celebration Banner
  const [justCompletedJuz, setJustCompletedJuz] = useState<GroupKhatmahJuz | null>(null);

  // Individual Khatmah UI States
  const [showEditTarget, setShowEditTarget] = useState(false);
  const [targetDaysInput, setTargetDaysInput] = useState(khatmahPlan.targetDays || 30);

  // Group Khatmah Statistics
  const completedAjzaCount = groupKhatmah.juzAssignments.filter((j) => j.status === "completed").length;
  const readingAjzaCount = groupKhatmah.juzAssignments.filter((j) => j.status === "reading").length;
  const unassignedAjzaCount = 30 - completedAjzaCount - readingAjzaCount;
  const groupPercentage = Math.round((completedAjzaCount / 30) * 100);

  // Individual Khatmah Statistics
  const individualPercentage = Math.min(100, Math.round((khatmahPlan.currentPage / 604) * 100));
  const dailyGoalPages = Math.ceil(604 / khatmahPlan.targetDays);

  // ===================== Group Khatmah Handlers =====================

  // Add Participant
  const handleAddParticipant = () => {
    const trimmed = newParticipantName.trim();
    if (!trimmed) return;
    if (groupKhatmah.participants.includes(trimmed)) {
      alert("هذا الاسم موجود بالفعل في قائمة المشاركين.");
      return;
    }

    setGroupKhatmah((prev) => ({
      ...prev,
      participants: [...prev.participants, trimmed]
    }));
    setNewParticipantName("");
  };

  // Remove Participant
  const handleRemoveParticipant = (name: string) => {
    if (groupKhatmah.participants.length <= 1) {
      alert("يجب الإبقاء على مشارك واحد على الأقل في الختمة.");
      return;
    }
    setGroupKhatmah((prev) => ({
      ...prev,
      participants: prev.participants.filter((p) => p !== name),
      juzAssignments: prev.juzAssignments.map((j) =>
        j.assignedTo === name ? { ...j, assignedTo: "", status: "unassigned" } : j
      )
    }));
  };

  // Auto-distribute all 30 Ajza among available participants evenly
  const handleAutoDistribute = () => {
    const parts = groupKhatmah.participants;
    if (parts.length === 0) return;

    const newAssignments: GroupKhatmahJuz[] = groupKhatmah.juzAssignments.map((juz, index) => {
      const assignedPerson = parts[index % parts.length];
      const status: "unassigned" | "reading" | "completed" =
        juz.status === "completed" ? "completed" : "reading";
      return {
        ...juz,
        assignedTo: assignedPerson,
        status
      };
    });

    setGroupKhatmah((prev) => ({
      ...prev,
      juzAssignments: newAssignments
    }));
  };

  // Assign specific Juz to a participant
  const handleAssignJuz = (juzNumber: number, personName: string) => {
    setGroupKhatmah((prev) => ({
      ...prev,
      juzAssignments: prev.juzAssignments.map((j) => {
        if (j.juzNumber === juzNumber) {
          const status: "unassigned" | "reading" | "completed" = personName
            ? j.status === "unassigned"
              ? "reading"
              : j.status
            : "unassigned";
          return {
            ...j,
            assignedTo: personName,
            status
          };
        }
        return j;
      })
    }));
  };

  // Toggle or Cycle Status of a Juz (unassigned/reading -> completed)
  const handleToggleJuzStatus = (juzNumber: number) => {
    setGroupKhatmah((prev) => {
      let justDoneItem: GroupKhatmahJuz | null = null;

      const updated = prev.juzAssignments.map((j) => {
        if (j.juzNumber === juzNumber) {
          let nextStatus: "unassigned" | "reading" | "completed" = "reading";
          let completedAt = j.completedAt;

          if (j.status === "unassigned") {
            nextStatus = "reading";
          } else if (j.status === "reading") {
            nextStatus = "completed";
            completedAt = new Date().toLocaleDateString("ar-SA");
            justDoneItem = { ...j, status: "completed", completedAt };
          } else {
            nextStatus = j.assignedTo ? "reading" : "unassigned";
            completedAt = undefined;
          }

          return { ...j, status: nextStatus, completedAt };
        }
        return j;
      });

      const newCompletedCount = updated.filter((j) => j.status === "completed").length;
      if (newCompletedCount === 30 && !prev.isCompleted) {
        try {
          confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 } });
        } catch (e) {}
      } else if (justDoneItem) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
        setJustCompletedJuz(justDoneItem);
      }

      return {
        ...prev,
        juzAssignments: updated,
        isCompleted: newCompletedCount === 30
      };
    });
  };

  // Reset Group Khatmah
  const handleResetGroupKhatmah = () => {
    if (confirm("هل تريد إعادة تعيين جميع أجزاء الختمة الجماعية للبدء من جديد؟")) {
      setGroupKhatmah((prev) => ({
        ...prev,
        juzAssignments: createInitialJuzAssignments(),
        isCompleted: false
      }));
    }
  };

  // ===================== WhatsApp Custom Message Generators =====================

  // 1. Send Individual Juz Completion notification to WhatsApp Group
  const generateJuzCompletionWhatsAppMessage = (juz: GroupKhatmahJuz): string => {
    const readerName = juz.assignedTo ? juz.assignedTo : "أحد القراء الكرام";
    const dateStr = juz.completedAt || new Date().toLocaleDateString("ar-SA");
    const appUrl = window.location.href;

    let msg = `✨ *إشعار إتمام قراءة جزء من القرآن الكريم* ✨\n\n`;
    msg += `📖 *تم بحمد الله وتوفيقه إتمام قراءة:* *الجزء ${juz.juzNumber}* (${juz.juzName})\n`;
    msg += `📜 *نطاق السور:* ${juz.surahRange} (صفحة ${juz.startPage})\n`;
    msg += `👤 *القارئ:* *${readerName}*\n`;
    msg += `📅 *تاريخ الإتمام:* ${dateStr}\n`;
    msg += `🕌 *ضمن:* ${groupKhatmah.title}\n`;
    if (groupKhatmah.intention) {
      msg += `🤲 *النية:* ${groupKhatmah.intention}\n`;
    }
    msg += `\n📊 *حالة الختمة الحالية:* تم إنجاز (${completedAjzaCount + (juz.status !== "completed" ? 1 : 0)}/30 جزء)\n`;
    msg += `------------------------------------\n`;
    msg += `🤲 *«اللهم اجعل القرآن العظيم ربيع قلوبنا، ونور صدورنا، وجلاء أحزاننا، وذهاب همومنا»*\n`;
    msg += `\n📲 *تابع الختمة وشارك معنا عبر التطبيق:* \n${appUrl}`;
    return msg;
  };

  const handleShareJuzToWhatsApp = (juz: GroupKhatmahJuz) => {
    const text = generateJuzCompletionWhatsAppMessage(juz);
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  // 2. Send Grand Khatmah Full Completion (30/30) notification to WhatsApp Group
  const generateFullKhatmahCelebrationMessage = (): string => {
    const appUrl = window.location.href;
    const dateStr = new Date().toLocaleDateString("ar-SA");

    let msg = `🎉🌟 *بشرى سارة: تمت بحمد الله وتوفيقه ختمة القرآن الكريم كاملة!* 🌟🎉\n\n`;
    msg += `🕌 *الختمة المباركة:* *${groupKhatmah.title}*\n`;
    if (groupKhatmah.intention) {
      msg += `🤲 *النية المباركة:* ${groupKhatmah.intention}\n`;
    }
    msg += `📅 *تاريخ الختم المبارك:* ${dateStr}\n`;
    msg += `------------------------------------\n`;
    msg += `👥 *قائمة القراء الأكارم والأجزاء المنجزة:*\n\n`;

    groupKhatmah.juzAssignments.forEach((j) => {
      const person = j.assignedTo || "مشارك مبارك";
      msg += `✅ *الجزء ${j.juzNumber}* (${j.juzName}) ← القارئ: *${person}*\n`;
    });

    msg += `\n------------------------------------\n`;
    msg += `🤲 *دعاء ختم القرآن الكريم:*\n`;
    msg += `«اللهم ارحمنا بالقرآن واجعله لنا إماماً ونوراً وهدىً ورحمة، اللهم ذكرنا منه ما نسينا وعلمنا منه ما جهلنا، وارزقنا تلاوته آناء الليل وأطراف النهار واجعله لنا حجة يا رب العالمين. تقبل الله من الجميع وجعله في ميزان حسناتكم.»\n\n`;
    msg += `📲 *رابط الختمة المباركة:* \n${appUrl}`;
    return msg;
  };

  const handleShareFullKhatmahToWhatsApp = () => {
    const text = generateFullKhatmahCelebrationMessage();
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  // 3. Send Vacant / Reserved Ajza Table to WhatsApp Group for members to pick parts
  const generateWhatsAppReservationTableMessage = (): string => {
    const appUrl = window.location.href;
    let msg = `🌟 *دعوة للمشاركة في ${groupKhatmah.title}* 🌟\n`;
    if (groupKhatmah.intention) {
      msg += `🤲 *النية:* ${groupKhatmah.intention}\n`;
    }
    msg += `📊 *نسبة الإنجاز الحالية:* ${completedAjzaCount}/30 جزء (${groupPercentage}%)\n`;
    msg += `------------------------------------\n`;
    msg += `📋 *جدول توزيع الأجزاء وحجز المتبقي:*\n\n`;

    groupKhatmah.juzAssignments.forEach((j) => {
      if (j.status === "completed") {
        msg += `✅ *الجزء ${j.juzNumber}* (${j.juzName}) ← *${j.assignedTo || "تمت القراءة"}* [مكتمل ✓]\n`;
      } else if (j.status === "reading") {
        msg += `📖 *الجزء ${j.juzNumber}* (${j.juzName}) ← *${j.assignedTo || "محدد"}* [جارٍ القراءة]\n`;
      } else {
        msg += `⏳ *الجزء ${j.juzNumber}* (${j.juzName}) ← _(شاغر متاح للحجز)_\n`;
      }
    });

    msg += `\n------------------------------------\n`;
    msg += `💡 *اختر الجزء الذي ترغب في قراءته وشاركه معنا في القروب أو افتح الرابط:* \n${appUrl}\n\n`;
    msg += `🤲 *تقبل الله منا ومنكم صالح الأعمال وجعل القرآن ربيع قلوبنا.*`;
    return msg;
  };

  const handleShareReservationToWhatsApp = () => {
    const text = generateWhatsAppReservationTableMessage();
    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  // Copy text report to clipboard
  const handleCopyKhatmahReport = (type: "full" | "table") => {
    const text = type === "full" ? generateFullKhatmahCelebrationMessage() : generateWhatsAppReservationTableMessage();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedNotification(type);
      setTimeout(() => setCopiedNotification(null), 2500);
    });
  };

  // 4. Send Individual Khatmah Progress to WhatsApp
  const handleShareIndividualProgressToWhatsApp = () => {
    const appUrl = window.location.href;
    let msg = `📖 *تقرير وردي القرآني وختمتي اليومية* 📖\n\n`;
    msg += `🌟 *وصلت بحمد الله إلى:* الصفحة *${khatmahPlan.currentPage}* من 604 صفحة\n`;
    msg += `📊 *نسبة الإنجاز:* *${individualPercentage}%*\n`;
    msg += `🎯 *الورد اليومي المستهدف:* ${dailyGoalPages} صفحات/يوم\n`;
    msg += `⏳ *الصفحات المتبقية للختم:* ${Math.max(0, 604 - khatmahPlan.currentPage)} صفحة\n\n`;
    msg += `🤲 *«اللهم وفقنا لتلاوة كتابك وتدبره والعمل به»*\n\n`;
    msg += `📲 *تطبيق القرآن الكريم:* \n${appUrl}`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  // Save Title & Intention
  const handleSaveTitleIntention = () => {
    setGroupKhatmah((prev) => ({
      ...prev,
      title: khatmahTitleInput,
      intention: khatmahIntentionInput
    }));
    setEditingTitle(false);
  };

  // ===================== Individual Khatmah Handlers =====================
  const handleAdvanceIndividualPage = (pagesCount = 1) => {
    const nextPage = Math.min(604, khatmahPlan.currentPage + pagesCount);
    const isFinished = nextPage >= 604;

    if (isFinished && !khatmahPlan.isFinished) {
      try {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }

    setKhatmahPlan((prev) => ({
      ...prev,
      currentPage: nextPage,
      isFinished
    }));
  };

  const handleResetIndividualKhatmah = () => {
    if (confirm("هل أنت متأكد من رغبتك في بدء ختمة فردية جديدة من الصفحة الأولى؟")) {
      setKhatmahPlan({
        id: "khatmah_1",
        name: "ختمة القرآن الكريم",
        targetDays: targetDaysInput,
        startDate: new Date().toISOString(),
        currentPage: 1,
        totalPages: 604,
        completedDays: [],
        isFinished: false
      });
    }
  };

  // Filtered Ajza List
  const filteredAjza = groupKhatmah.juzAssignments.filter((j) => {
    if (filterStatus === "completed" && j.status !== "completed") return false;
    if (filterStatus === "reading" && j.status !== "reading") return false;
    if (filterStatus === "unassigned" && j.status !== "unassigned") return false;
    if (filterParticipant !== "all" && j.assignedTo !== filterParticipant) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Segmented Tabs: Group vs Individual vs Duaa */}
      <div className="flex items-center gap-1.5 p-1 bg-[#1A202C] border border-[#2D3748] shadow-sm">
        <button
          onClick={() => setActiveKhatmahTab("group")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeKhatmahTab === "group"
              ? "bg-[#C5A059] text-[#1A202C] shadow font-bold"
              : "text-stone-300 hover:text-white hover:bg-[#12161F]"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>الختمة التشاركية (توزيع الأدوار + واتساب WhatsApp)</span>
        </button>

        <button
          onClick={() => setActiveKhatmahTab("individual")}
          className={`py-2.5 px-3 sm:px-5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeKhatmahTab === "individual"
              ? "bg-[#C5A059] text-[#1A202C] shadow font-bold"
              : "text-stone-300 hover:text-white hover:bg-[#12161F]"
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>الختمة الفردية</span>
        </button>

        <button
          onClick={() => setActiveKhatmahTab("duaa")}
          className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeKhatmahTab === "duaa"
              ? "bg-[#C5A059] text-[#1A202C] shadow font-bold"
              : "text-stone-300 hover:text-white hover:bg-[#12161F]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>دعاء الختم</span>
        </button>
      </div>

      {/* Instant Juz Completion Celebration Toast / Popup */}
      {justCompletedJuz && (
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-[#103E33] to-[#0A2E26] border-2 border-emerald-500 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-lg shrink-0">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-emerald-200 font-tajawal flex items-center gap-2">
                <span>هنيئاً لك! تم إتمام قراءة {justCompletedJuz.juzName} (الجزء {justCompletedJuz.juzNumber})</span>
              </h4>
              <p className="text-xs text-emerald-100/90 font-mono mt-0.5">
                القارئ: {justCompletedJuz.assignedTo || "أنا"} • شارك الإنجاز وأخبر قروب الواتساب فوراً 📲
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleShareJuzToWhatsApp(justCompletedJuz)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>إرسال الإشعار للقروب على WhatsApp</span>
            </button>
            <button
              onClick={() => setJustCompletedJuz(null)}
              className="p-2 text-emerald-200 hover:text-white bg-emerald-900/60 border border-emerald-700"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================== TAB 1: GROUP INTERACTIVE KHATMAH ===================== */}
      {activeKhatmahTab === "group" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Hero Card for Group Khatmah */}
          <div className="p-6 sm:p-7 bg-[#1A202C] border border-[#C5A059]/40 shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-geometric-hatch opacity-10 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#12161F] border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>ختمة القرآن التشاركية التفاعلية</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal flex items-center gap-2">
                  <span>{groupKhatmah.title}</span>
                  <button
                    onClick={() => {
                      setKhatmahTitleInput(groupKhatmah.title);
                      setKhatmahIntentionInput(groupKhatmah.intention || "");
                      setEditingTitle(!editingTitle);
                    }}
                    className="text-xs text-[#C5A059] hover:underline font-mono"
                  >
                    [تعديل]
                  </button>
                </h2>
                {groupKhatmah.intention && (
                  <p className="text-xs text-[#E2C785] font-tajawal">
                    🤲 النية: {groupKhatmah.intention}
                  </p>
                )}
              </div>

              {/* WhatsApp Share & Actions Header Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Send Table / Broadcast to WhatsApp Group */}
                <button
                  id="btn-share-whatsapp-table"
                  onClick={handleShareReservationToWhatsApp}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95 border border-emerald-400"
                  title="إرسال جدول حجز الأجزاء ومشاركة الختمة في قروب الواتساب"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>إرسال جدول الختمة على WhatsApp 📲</span>
                </button>

                {/* If completed, show grand celebration button */}
                {completedAjzaCount === 30 && (
                  <button
                    onClick={handleShareFullKhatmahToWhatsApp}
                    className="px-3.5 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-lg animate-bounce border border-[#8B6E3D]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>بشرى ختم القرآن على WhatsApp 🎉</span>
                  </button>
                )}

                <button
                  id="btn-copy-khatmah"
                  onClick={() => handleCopyKhatmahReport("table")}
                  className="px-3 py-2.5 bg-[#12161F] hover:bg-[#2D3748] text-stone-200 border border-[#2D3748] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="نسخ تقرير توزيع الأجزاء"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-400" />
                      <span>نسخ النص</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Edit Title / Intention Modal/Drawer */}
            {editingTitle && (
              <div className="p-4 bg-[#12161F] border border-[#2D3748] space-y-3 relative z-10 animate-in fade-in">
                <h4 className="text-xs font-bold text-[#C5A059] font-tajawal">
                  تعديل اسم الختمة والنية:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={khatmahTitleInput}
                    onChange={(e) => setKhatmahTitleInput(e.target.value)}
                    placeholder="عنوان الختمة (مثال: ختمة رمضان المبارك 1448هـ)"
                    className="p-2 bg-[#1A202C] border border-[#2D3748] text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
                  />
                  <input
                    type="text"
                    value={khatmahIntentionInput}
                    onChange={(e) => setKhatmahIntentionInput(e.target.value)}
                    placeholder="النية (مثال: صدقة جارية للأهل والأحباب)"
                    className="p-2 bg-[#1A202C] border border-[#2D3748] text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingTitle(false)}
                    className="px-3 py-1 text-xs text-stone-400 hover:text-white cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveTitleIntention}
                    className="px-4 py-1 bg-[#C5A059] text-[#1A202C] font-bold text-xs cursor-pointer"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            )}

            {/* Progress Bar with Geometric Frame */}
            <div className="space-y-2 relative z-10">
              <div className="w-full h-4 bg-[#12161F] overflow-hidden border border-[#2D3748] p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#8B6E3D] via-[#C5A059] to-[#E2C785] transition-all duration-500 shadow-sm"
                  style={{ width: `${groupPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>0 جزء</span>
                <span className="font-bold text-[#C5A059]">
                  {completedAjzaCount} من 30 جزء منجز ({groupPercentage}%)
                </span>
                <span>30 جزء (الختم المبارك)</span>
              </div>
            </div>

            {/* Statistics Summary Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 relative z-10">
              <div className="p-3 bg-[#12161F] border border-emerald-600/40 text-center">
                <span className="text-[10px] text-emerald-400 font-mono block">تمت قراءتها</span>
                <p className="text-xl font-bold font-mono text-emerald-300 mt-0.5">
                  {completedAjzaCount} <span className="text-xs text-stone-400 font-normal">أجزاء</span>
                </p>
              </div>

              <div className="p-3 bg-[#12161F] border border-amber-600/40 text-center">
                <span className="text-[10px] text-amber-400 font-mono block">قيد القراءة</span>
                <p className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                  {readingAjzaCount} <span className="text-xs text-stone-400 font-normal">أجزاء</span>
                </p>
              </div>

              <div className="p-3 bg-[#12161F] border border-stone-700 text-center">
                <span className="text-[10px] text-stone-400 font-mono block">متاح للحجز</span>
                <p className="text-xl font-bold font-mono text-stone-200 mt-0.5">
                  {unassignedAjzaCount} <span className="text-xs text-stone-400 font-normal">أجزاء</span>
                </p>
              </div>

              <div className="p-3 bg-[#12161F] border border-[#C5A059]/40 text-center">
                <span className="text-[10px] text-[#C5A059] font-mono block">المشاركون</span>
                <p className="text-xl font-bold font-mono text-[#E2C785] mt-0.5">
                  {groupKhatmah.participants.length} <span className="text-xs text-stone-400 font-normal">قراء</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section: Participants Management & Role Distribution */}
          <div className="p-5 bg-[#1A202C] border border-[#2D3748] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-white font-tajawal flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>إدارة أسماء المشاركين وتوزيع الأدوار</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  أضف أسماء عائلتك وأصدقائك ووزع عليهم أجزاء القرآن بضغطة واحدة
                </p>
              </div>

              {/* Auto-distribute button */}
              <button
                id="btn-auto-distribute-roles"
                onClick={handleAutoDistribute}
                className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow border border-[#8B6E3D]"
                title="توزيع الأجزاء الـ 30 بالتساوي على جميع المشاركين المسجلين"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>توزيع الأدوار بالتساوي تلقائياً ⚡</span>
              </button>
            </div>

            {/* Add New Participant Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
                placeholder="اكتب اسم المشارك الجديد (مثال: محمد، فاطمة، عبد الله...)"
                className="flex-1 p-2.5 bg-[#12161F] border border-[#2D3748] text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                onClick={handleAddParticipant}
                className="px-4 py-2.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#C5A059]/50 text-[#C5A059] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إضافة اسم</span>
              </button>
            </div>

            {/* List of Participant Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {groupKhatmah.participants.map((person) => {
                const assignedCount = groupKhatmah.juzAssignments.filter((j) => j.assignedTo === person).length;
                const completedCount = groupKhatmah.juzAssignments.filter(
                  (j) => j.assignedTo === person && j.status === "completed"
                ).length;

                return (
                  <div
                    key={person}
                    className="pl-2 pr-3 py-1.5 bg-[#12161F] border border-[#2D3748] flex items-center gap-2 text-xs text-stone-200"
                  >
                    <span className="font-semibold text-white">{person}</span>
                    <span className="text-[10px] font-mono text-[#C5A059] bg-[#1A202C] px-1.5 py-0.5 border border-[#2D3748]">
                      {completedCount}/{assignedCount} جزء
                    </span>
                    <button
                      onClick={() => handleRemoveParticipant(person)}
                      className="text-stone-500 hover:text-rose-400 p-0.5 cursor-pointer"
                      title="حذف هذا المشارك"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: 30 Ajza List & Interactive Assignment Matrix */}
          <div className="space-y-3">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#1A202C] border border-[#2D3748]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>تصفية الأجزاء:</span>
                </span>

                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-2.5 py-1 text-xs font-mono border cursor-pointer ${
                    filterStatus === "all"
                      ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                      : "bg-[#12161F] text-stone-300 border-[#2D3748]"
                  }`}
                >
                  الكل (30)
                </button>

                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`px-2.5 py-1 text-xs font-mono border cursor-pointer ${
                    filterStatus === "completed"
                      ? "bg-emerald-600 text-white font-bold border-emerald-500"
                      : "bg-[#12161F] text-emerald-400 border-[#2D3748]"
                  }`}
                >
                  مكتمل ({completedAjzaCount})
                </button>

                <button
                  onClick={() => setFilterStatus("reading")}
                  className={`px-2.5 py-1 text-xs font-mono border cursor-pointer ${
                    filterStatus === "reading"
                      ? "bg-amber-500 text-[#1A202C] font-bold border-amber-400"
                      : "bg-[#12161F] text-amber-300 border-[#2D3748]"
                  }`}
                >
                  قيد القراءة ({readingAjzaCount})
                </button>

                <button
                  onClick={() => setFilterStatus("unassigned")}
                  className={`px-2.5 py-1 text-xs font-mono border cursor-pointer ${
                    filterStatus === "unassigned"
                      ? "bg-stone-600 text-white font-bold border-stone-500"
                      : "bg-[#12161F] text-stone-400 border-[#2D3748]"
                  }`}
                >
                  شاغر ({unassignedAjzaCount})
                </button>
              </div>

              {/* Filter by participant */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-stone-400 whitespace-nowrap">القارئ:</span>
                <select
                  value={filterParticipant}
                  onChange={(e) => setFilterParticipant(e.target.value)}
                  className="p-1.5 text-xs bg-[#12161F] border border-[#2D3748] text-white focus:outline-none focus:border-[#C5A059] flex-1 sm:flex-none"
                >
                  <option value="all">جميع المشاركين</option>
                  {groupKhatmah.participants.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 30 Ajza Cards Grid with WhatsApp Juz Completion Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAjza.map((juz) => {
                const isCompleted = juz.status === "completed";
                const isReading = juz.status === "reading";

                return (
                  <div
                    key={juz.juzNumber}
                    className={`p-4 border transition-all ${
                      isCompleted
                        ? "bg-[#1A202C] border-emerald-500/50 shadow-md"
                        : isReading
                        ? "bg-[#1A202C] border-[#C5A059]/50"
                        : "bg-[#1A202C] border-[#2D3748]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 text-xs font-mono font-bold border ${
                              isCompleted
                                ? "bg-emerald-950/60 text-emerald-300 border-emerald-600/50"
                                : isReading
                                ? "bg-amber-950/60 text-amber-300 border-amber-600/50"
                                : "bg-[#12161F] text-stone-400 border-[#2D3748]"
                            }`}
                          >
                            الجزء {juz.juzNumber}
                          </span>
                          <h4 className="font-bold text-sm text-white font-tajawal">
                            {juz.juzName}
                          </h4>
                        </div>
                        <p className="text-xs text-stone-400 font-mono mt-1">
                          {juz.surahRange} (ص {juz.startPage})
                        </p>
                      </div>

                      {/* Status Action Toggle Button */}
                      <button
                        onClick={() => handleToggleJuzStatus(juz.juzNumber)}
                        className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                          isCompleted
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : isReading
                            ? "bg-amber-500 text-[#1A202C] border-amber-400"
                            : "bg-[#12161F] text-stone-300 border-[#2D3748] hover:bg-[#2D3748]"
                        }`}
                        title="انقر لتغيير حالة قراءة هذا الجزء"
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تمت القراءة ✓</span>
                          </>
                        ) : isReading ? (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>جارٍ القراءة</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            <span>لم تبدأ</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Participant Assignment Row */}
                    <div className="mt-3 pt-3 border-t border-[#2D3748] flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                        <span className="text-[11px] text-stone-400 whitespace-nowrap">القارئ:</span>
                        <select
                          value={juz.assignedTo}
                          onChange={(e) => handleAssignJuz(juz.juzNumber, e.target.value)}
                          className="p-1 text-xs bg-[#12161F] border border-[#2D3748] text-[#C5A059] font-semibold focus:outline-none focus:border-[#C5A059] flex-1 max-w-[200px]"
                        >
                          <option value="">-- اختر قارئاً --</option>
                          {groupKhatmah.participants.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Open reader for this Juz */}
                      <button
                        onClick={() => onOpenSurahByPage(juz.startPage)}
                        className="px-2.5 py-1 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                        title="فتح أول صفحة في هذا الجزء بالمصحف الشريف"
                      >
                        <BookOpen className="w-3 h-3 text-[#C5A059]" />
                        <span>اقرأ (ص {juz.startPage})</span>
                      </button>
                    </div>

                    {/* Dedicated WhatsApp Share Button for this specific Juz */}
                    <div className="mt-2.5 pt-2 border-t border-[#2D3748]/60 flex items-center justify-between">
                      <button
                        onClick={() => handleShareJuzToWhatsApp(juz)}
                        className={`w-full py-1 px-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/60 text-emerald-300"
                            : "bg-[#12161F] hover:bg-[#2D3748] text-[#25D366] border-[#2D3748]"
                        }`}
                        title="إرسال إشعار قراءة أو إتمام هذا الجزء مباشرة على قروب الواتساب"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                        <span>
                          {isCompleted
                            ? "📲 إرسال إشعار إتمام هذا الجزء على WhatsApp"
                            : "📲 إرسال حجز/إتمام هذا الجزء على WhatsApp"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Reset Group Khatmah Button */}
            <div className="pt-4 flex justify-between items-center text-xs text-stone-400 font-mono">
              <button
                onClick={handleResetGroupKhatmah}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط وتصفير الختمة الجماعية</span>
              </button>
              <span>متبقي {unassignedAjzaCount + readingAjzaCount} جزء للاكتمال</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: INDIVIDUAL KHATMAH ===================== */}
      {activeKhatmahTab === "individual" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 sm:p-8 bg-[#1A202C] border border-[#C5A059]/40 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-geometric-hatch opacity-10 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="text-center sm:text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#12161F] border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono uppercase tracking-widest mb-2">
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>متابعة الورد الفردي وختمة القرآن</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-tajawal">
                  ختمتك الفردية المباركة ({individualPercentage}%)
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1 font-mono">
                  وصلت إلى الصفحة <strong className="text-[#C5A059] text-base">{khatmahPlan.currentPage}</strong> من 604 صفحة
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-resume-individual-khatmah"
                  onClick={() => onOpenSurahByPage(khatmahPlan.currentPage)}
                  className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-transform border border-[#8B6E3D]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>متابعة التلاوة في المصحف</span>
                </button>

                {/* Send Individual Progress to WhatsApp */}
                <button
                  onClick={handleShareIndividualProgressToWhatsApp}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>إرسال إنجاز اليوم على WhatsApp 📲</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 relative z-10">
              <div className="w-full h-3.5 bg-[#12161F] overflow-hidden border border-[#2D3748] p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#8B6E3D] via-[#C5A059] to-[#E2C785] transition-all duration-500 shadow-sm"
                  style={{ width: `${individualPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>البداية: سورة الفاتحة</span>
                <span className="font-bold text-[#C5A059]">{individualPercentage}% منجز</span>
                <span>الهدف: سورة الناس (ص 604)</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
              <div className="p-3.5 bg-[#12161F] border border-[#2D3748] text-center">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">الصفحات المتبقية</span>
                <p className="text-lg font-bold font-mono text-white mt-0.5">
                  {Math.max(0, 604 - khatmahPlan.currentPage)}
                </p>
              </div>
              <div className="p-3.5 bg-[#12161F] border border-[#2D3748] text-center">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">الورد اليومي المقترح</span>
                <p className="text-lg font-bold font-mono text-[#C5A059] mt-0.5">
                  {dailyGoalPages} صفحات/يوم
                </p>
              </div>
              <div className="p-3.5 bg-[#12161F] border border-[#2D3748] text-center">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">مدة الختمة</span>
                <p className="text-lg font-bold font-mono text-white mt-0.5">
                  {khatmahPlan.targetDays} يوماً
                </p>
              </div>
              <div className="p-3.5 bg-[#12161F] border border-[#2D3748] text-center">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">الحالة</span>
                <p className="text-sm font-bold text-[#C5A059] mt-1 font-tajawal">
                  {khatmahPlan.isFinished ? "مكتملة بحمد الله ✓" : "مستمرة"}
                </p>
              </div>
            </div>

            {/* Fast Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#2D3748] relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-add-page-1"
                  onClick={() => handleAdvanceIndividualPage(1)}
                  className="px-3 py-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>قرأت صفحة (+1)</span>
                </button>
                <button
                  id="btn-add-page-4"
                  onClick={() => handleAdvanceIndividualPage(4)}
                  className="px-3 py-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>قرأت 4 صفحات</span>
                </button>
                <button
                  id="btn-add-juz-20"
                  onClick={() => handleAdvanceIndividualPage(20)}
                  className="px-3 py-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>قرأت جزءاً (+20 ص)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <button
                  onClick={() => setShowEditTarget(!showEditTarget)}
                  className="text-xs text-stone-400 hover:text-white cursor-pointer"
                >
                  تعديل الهدف
                </button>
                <span>•</span>
                <button
                  onClick={handleResetIndividualKhatmah}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>بدء ختمة جديدة</span>
                </button>
              </div>
            </div>

            {/* Edit Target Days */}
            {showEditTarget && (
              <div className="p-4 bg-[#12161F] border border-[#2D3748] flex items-center gap-3">
                <span className="text-xs text-stone-300">حدد مدة الختمة المستهدفة:</span>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={targetDaysInput}
                  onChange={(e) => setTargetDaysInput(Number(e.target.value))}
                  className="w-20 p-1.5 bg-[#1A202C] border border-[#2D3748] text-xs font-mono text-[#C5A059] text-center"
                />
                <span className="text-xs text-stone-400">يوماً</span>
                <button
                  onClick={() => {
                    setKhatmahPlan((prev) => ({ ...prev, targetDays: targetDaysInput }));
                    setShowEditTarget(false);
                  }}
                  className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold cursor-pointer"
                >
                  حفظ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: DUAA KHATM AL-QURAN ===================== */}
      {activeKhatmahTab === "duaa" && (
        <div className="p-6 sm:p-8 bg-[#1A202C] border border-[#2D3748] space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-bold text-lg text-white font-tajawal">
                دعاء ختم القرآن الكريم الجامع
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareFullKhatmahToWhatsApp}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>إرسال دعاء الختم على WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  const duaaText = `«اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً. اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ. اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ المَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ.»`;
                  navigator.clipboard.writeText(duaaText);
                  alert("تم نسخ دعاء ختم القرآن الكريم");
                }}
                className="px-3 py-1.5 bg-[#12161F] text-[#C5A059] border border-[#2D3748] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الدعاء</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-400">
            يُستحب قراءة هذا الدعاء المأثور عند إتمام ختم كتاب الله تعالى والتضرع به إلى الله
          </p>

          <div className="p-5 sm:p-6 bg-[#12161F] border border-[#2D3748] leading-[2.5] font-quran text-base sm:text-lg text-stone-200 text-justify">
            «اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً.
            اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ.
            اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ المَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ.
            اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ وَخَيْرَ عَمَلِي خَوَاتِمَهُ وَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ فِيهِ.
            اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً هَنِيَّةً وَمِيتَةً سَوِيَّةً وَمَرَدّاً غَيْرَ مُخْزٍ وَلَا فَاضِحٍ.
            اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ المَسْأَلَةِ وَخَيْرَ الدُّعَاءِ وَخَيْرَ النَّجَاحِ وَخَيْرَ العِلْمِ وَخَيْرَ العَمَلِ وَخَيْرَ الثَّوَابِ وَخَيْرَ الحَيَاةِ وَخَيْرَ المَمَاتِ وَثَبِّتْنِي وَثَقِّلْ مَوَازِينِي وَحَقِّقْ إِيمَانِي وَارْفَعْ دَرَجَاتِي وَتَقَبَّلْ صَلَاتِي وَاغْفِرْ خَطِيئَاتِي وَأَسْأَلُكَ العُلَا مِنَ الجَنَّةِ.»
          </div>
        </div>
      )}
    </div>
  );
};
