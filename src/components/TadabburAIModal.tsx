import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  Lightbulb,
  Volume2,
  VolumeX,
  Share2,
  Bookmark,
  Trash2,
  Layers,
  ChevronDown
} from "lucide-react";
import Markdown from "react-markdown";
import { SURAHS_LIST } from "../data/surahsData";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
  surahInfo?: string;
}

interface TadabburAIModalProps {
  initialSurahName?: string;
  initialAyahNumber?: number;
  initialAyahText?: string;
  onClose?: () => void;
}

export const TadabburAIModal: React.FC<TadabburAIModalProps> = ({
  initialSurahName,
  initialAyahNumber,
  initialAyahText,
  onClose
}) => {
  const [mode, setMode] = useState<"ayah" | "chat" | "topics">(initialAyahText ? "ayah" : "chat");
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(() => {
    if (initialSurahName) {
      const match = SURAHS_LIST.find((s) => s.name === initialSurahName);
      if (match) return match.number;
    }
    return 1;
  });
  const [ayahNumber, setAyahNumber] = useState(initialAyahNumber || 1);
  const [ayahText, setAyahText] = useState(initialAyahText || "");
  const [customQuestion, setCustomQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      sender: "ai",
      text: `السلام عليكم ورحمة الله وبركاته 🌿\n\nأنا **مساعد التدبر القرآني التفاعلي بالذكاء الاصطناعي**.\nيمكنك سؤالي عن أي موضوع في القرآن الكريم، قصص الأنبياء، أسباب النزول، اللطائف البلاغية والإيمانية، أو طلب أدعية وآيات لتفريج الهموم والبركة في الرزق.`,
      timestamp: "الآن"
    }
  ]);

  // Ayah reflection result
  const [ayahReflection, setAyahReflection] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedSurahMeta = SURAHS_LIST.find((s) => s.number === selectedSurahNumber) || SURAHS_LIST[0];

  const questionCategories = [
    {
      id: "general",
      title: "💡 تساؤلات عامة",
      questions: [
        "ما هي الدروس والعبر المستفادة من سورة يوسف؟",
        "ما هي اللطائف البلاغية والإيمانية في آية الكرسي؟",
        "وصايا لقمان لابنه وتطبيقاتها التربوية المعاصرة",
        "ما فضل سورة الكهف وسورة الملك؟"
      ]
    },
    {
      id: "relief",
      title: "🌿 تفريج الكروب والهموم",
      questions: [
        "اذكر لي آيات الصبر والسكينة وتفريج الهموم مع التدبر",
        "كيف عالج القرآن الكريم الحزن وضيق الصدر؟",
        "أدعية الأنبياء في القرآن عند الشدائد واستجابتها",
        "آيات الشفاء والرقية الشرعية في القرآن الكريم"
      ]
    },
    {
      id: "miracles",
      title: "✨ الإعجاز والبلاغة",
      questions: [
        "ما هي أسرار اختيار الألفاظ في فاتحة الكتاب؟",
        "الإعجاز العلمي في آيات تكوين السحاب والمطر",
        "لطائف التقديم والتأخير في سورة البقرة",
        "ما الحكمة من تكرار (فبأي آلاء ربكما تكذبان) في سورة الرحمن؟"
      ]
    },
    {
      id: "rulings",
      title: "⚖️ المعاملات والأسرة",
      questions: [
        "المنهج القرآني في بناء الأسرة والمودة والرحمة",
        "آيات التعامل المالي والصدق في البيع والشراء",
        "هدي القرآن في أدب الحوار مع المخالفين",
        "حقوق الوالدين والإحسان إليهما في ضوء الآيات"
      ]
    }
  ];

  const ayahPresetQuestions = [
    "ما المعنى العام والهدف الإيماني الأساسي للآية؟",
    "ما هي اللطائف البلاغية ودلالات الكلمات في هذه الآية؟",
    "هل هناك سبب نزول موثق لهذه الآية الكريمة؟",
    "ما هي الدروس التربوية وكيف أطبق هذه الآية في حياتي اليومية؟",
    "اكتب لي دعاءً خاشعاً مستوحى من هدي هذه الآية الكريمة"
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, loading]);

  // Voice speech synthesis
  const toggleSpeech = (id: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#_`~\[\]]/g, "").replace(/\n+/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ar-SA";
    utterance.rate = 0.95;

    // Find Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith("ar"));
    if (arVoice) {
      utterance.voice = arVoice;
    }

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(id);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: "تدبر قرآني بالذكاء الاصطناعي",
        text
      }).catch(() => {});
    } else {
      handleCopy("share", text);
    }
  };

  // Send question in chat mode
  const handleSendChatQuestion = async (queryText?: string, categoryTag?: string) => {
    const q = (queryText || customQuestion).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      category: categoryTag
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setCustomQuestion("");
    setLoading(true);
    setError(null);

    try {
      // Build past history context
      const historyContext = chatMessages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch("/api/gemini/ask-quran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          history: historyContext,
          category: categoryTag
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "تعذر الحصول على استجابة");
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.answer || "تمت الإجابة بنجاح.",
        timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي");
    } finally {
      setLoading(false);
    }
  };

  // Ayah mode reflection
  const handleFetchAyahTadabbur = async (specificQuestion?: string) => {
    setLoading(true);
    setError(null);

    try {
      const q = specificQuestion || customQuestion;
      const res = await fetch("/api/gemini/tadabbur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surahName: selectedSurahMeta.name,
          ayahNumber,
          ayahText,
          mode: q ? "question" : "tadabbur",
          customQuestion: q
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "تعذر توليد التدبر");
      }

      setAyahReflection(data.result || "تمت معالجة التدبر بنجاح.");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    setChatMessages([
      {
        id: "welcome-msg-reset",
        sender: "ai",
        text: `تم بدء محادثة تدبر جديدة 🌿\n\nتفضل بطرح أي سؤال أو استفسار حول القرآن الكريم وسأجيبك فوراً.`,
        timestamp: "الآن"
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Banner Header with Geometric Balance motif */}
      <div className="p-6 bg-[#1A202C] border border-[#C5A059]/40 shadow-xl text-center sm:text-right relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-geometric-hatch opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12161F] border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>مساعد التدبر والأسئلة القرآنية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-tajawal">
              تدبر القرآن الكريم بالذكاء الاصطناعي
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              حوار تفاعلي، إجابات موثقة، أسرار بلاغية، وأسئلة مستنبطة من آيات الكتاب الحكيم
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-[#12161F] p-1 border border-[#2D3748] text-xs shrink-0">
            <button
              id="btn-tadabbur-tab-chat"
              onClick={() => setMode("chat")}
              className={`px-3.5 py-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === "chat"
                  ? "bg-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>حوار وتساؤلات</span>
            </button>
            <button
              id="btn-tadabbur-tab-ayah"
              onClick={() => setMode("ayah")}
              className={`px-3.5 py-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === "ayah"
                  ? "bg-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>تدبر آية محددة</span>
            </button>
            <button
              id="btn-tadabbur-tab-topics"
              onClick={() => setMode("topics")}
              className={`px-3.5 py-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === "topics"
                  ? "bg-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>بنك الأسئلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Interactive Chat Dialogue */}
      {mode === "chat" && (
        <div className="space-y-4">
          {/* Quick Categories Bar */}
          <div className="p-3 bg-[#1A202C] border border-[#2D3748] flex items-center justify-between gap-2 overflow-x-auto text-xs">
            <span className="text-[#C5A059] font-mono whitespace-nowrap text-[11px]">مواضيع سريعة:</span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSendChatQuestion("ما هي الآيات والأدعية التي تزيل القلق والهم؟", "تفريج الهموم")}
                className="px-2.5 py-1 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] hover:border-[#C5A059] text-stone-300 text-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                🌿 تفريج الهم والحزن
              </button>
              <button
                onClick={() => handleSendChatQuestion("ما هي أسباب البركة وسعة الرزق في القرآن الكريم؟", "الرزق")}
                className="px-2.5 py-1 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] hover:border-[#C5A059] text-stone-300 text-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                💰 سعة الرزق والبركة
              </button>
              <button
                onClick={() => handleSendChatQuestion("ما هي أبرز اللطائف والإشارات البلاغية في سورة يوسف؟", "قصص القرآن")}
                className="px-2.5 py-1 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] hover:border-[#C5A059] text-stone-300 text-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                📜 عبر سورة يوسف
              </button>
              <button
                onClick={() => handleSendChatQuestion("كيف يرشدنا القرآن لحسن بر الوالدين وصلة الرحم؟", "الأخلاق")}
                className="px-2.5 py-1 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] hover:border-[#C5A059] text-stone-300 text-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                🤝 بر الوالدين
              </button>
            </div>
            {chatMessages.length > 2 && (
              <button
                onClick={handleClearChat}
                className="p-1.5 bg-[#12161F] hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 border border-[#2D3748] hover:border-rose-700 cursor-pointer shrink-0"
                title="مسح المحادثة وبدء حوار جديد"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Conversation Stream Container */}
          <div className="p-4 sm:p-6 bg-[#1A202C] border border-[#2D3748] min-h-[380px] max-h-[580px] overflow-y-auto space-y-4">
            {chatMessages.map((msg) => {
              const isAi = msg.sender === "ai";
              const isSpeaking = speakingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? "items-start" : "items-end"} animate-in fade-in duration-200`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] p-4 border transition-all ${
                      isAi
                        ? "bg-[#12161F] border-[#C5A059]/40 text-stone-100 shadow-md"
                        : "bg-[#C5A059] border-[#8B6E3D] text-[#1A202C] font-semibold"
                    }`}
                  >
                    {/* Header line for AI Message */}
                    {isAi && (
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#2D3748] text-xs">
                        <div className="flex items-center gap-1.5 text-[#C5A059] font-tajawal font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>المساعد القرآني</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleSpeech(msg.id, msg.text)}
                            className={`p-1 border cursor-pointer ${
                              isSpeaking
                                ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059]"
                                : "bg-[#1A202C] border-[#2D3748] text-stone-400 hover:text-stone-200"
                            }`}
                            title={isSpeaking ? "إيقاف الصوت" : "استماع صوتي للإجابة"}
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="p-1 bg-[#1A202C] border border-[#2D3748] text-stone-400 hover:text-stone-200 cursor-pointer"
                            title="نسخ الإجابة"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#C5A059]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleShare(msg.text)}
                            className="p-1 bg-[#1A202C] border border-[#2D3748] text-stone-400 hover:text-stone-200 cursor-pointer"
                            title="مشاركة"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="text-xs sm:text-sm leading-relaxed">
                      {isAi ? (
                        <div className="markdown-body">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      ) : (
                        <p className="font-tajawal text-sm whitespace-pre-wrap">{msg.text}</p>
                      )}
                    </div>

                    <div className="mt-2 text-[10px] opacity-60 font-mono text-left">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start">
                <div className="p-4 bg-[#12161F] border border-[#C5A059]/40 text-stone-200 text-xs flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
                  <span className="font-tajawal">جارٍ استحضار الآيات والتفسير بالذكاء الاصطناعي...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs text-center">
              {error}
            </div>
          )}

          {/* Chat Input Box */}
          <div className="p-3 bg-[#1A202C] border border-[#2D3748] flex gap-2 items-center">
            <input
              id="input-tadabbur-chat"
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && customQuestion.trim()) {
                  handleSendChatQuestion();
                }
              }}
              placeholder="اكتب سؤالك أو موضوعك القرآني هنا (مثال: ما معنى سورة الإخلاص؟ أو آيات الصبر)..."
              className="flex-1 p-3 bg-[#12161F] border border-[#2D3748] focus:border-[#C5A059] text-stone-100 placeholder-stone-500 text-sm outline-none"
            />
            <button
              id="btn-send-tadabbur-chat"
              disabled={loading || !customQuestion.trim()}
              onClick={() => handleSendChatQuestion()}
              className="px-5 py-3 bg-[#C5A059] hover:bg-[#B38F46] disabled:opacity-40 text-[#1A202C] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#8B6E3D] shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#1A202C]/30 border-t-[#1A202C] animate-spin" />
              ) : (
                <>
                  <span>إرسال</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Specific Ayah Deep Reflection */}
      {mode === "ayah" && (
        <div className="space-y-6">
          <div className="p-5 bg-[#1A202C] border border-[#2D3748] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Surah Dropdown Selector */}
              <div>
                <label className="block text-xs text-stone-400 mb-1 font-mono">اختر السورة:</label>
                <select
                  value={selectedSurahNumber}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    setSelectedSurahNumber(num);
                    setAyahNumber(1);
                  }}
                  className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-200 text-xs outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  {SURAHS_LIST.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. سورة {s.name} ({s.numberOfAyahs} آية)
                    </option>
                  ))}
                </select>
              </div>

              {/* Ayah Number Input */}
              <div>
                <label className="block text-xs text-stone-400 mb-1 font-mono">رقم الآية (1 إلى {selectedSurahMeta.numberOfAyahs}):</label>
                <input
                  type="number"
                  min="1"
                  max={selectedSurahMeta.numberOfAyahs}
                  value={ayahNumber}
                  onChange={(e) => setAyahNumber(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-[#C5A059] font-bold font-mono text-xs outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Optional Ayah Text paste */}
            <div>
              <label className="block text-xs text-stone-400 mb-1 font-mono">نص الآية الكريمة (اختياري للتحقق):</label>
              <textarea
                rows={2}
                value={ayahText}
                onChange={(e) => setAyahText(e.target.value)}
                placeholder={`آية من سورة ${selectedSurahMeta.name}...`}
                className="w-full p-3 bg-[#12161F] border border-[#2D3748] text-stone-200 text-sm font-quran outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Preset Ayah Questions */}
            <div>
              <label className="block text-xs text-stone-400 mb-2 font-mono">
                اختر سؤالاً مخصصاً حول الآية أو اطلب تدبراً شاملاً:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ayahPresetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomQuestion(q);
                      handleFetchAyahTadabbur(q);
                    }}
                    className="p-2.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] hover:border-[#C5A059] text-stone-300 hover:text-white text-xs text-right cursor-pointer transition-colors"
                  >
                    • {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              id="btn-generate-ayah-tadabbur"
              disabled={loading}
              onClick={() => handleFetchAyahTadabbur()}
              className="w-full py-3 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-all border border-[#8B6E3D]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1A202C]/30 border-t-[#1A202C] animate-spin" />
                  <span>جارٍ استخلاص اللطائف والتدبر من أمهات التفاسير...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#1A202C]" />
                  <span>توليد التدبر الإيماني والوقفة التربوية الشاملة</span>
                </>
              )}
            </button>
          </div>

          {/* Ayah Reflection Output Card */}
          {ayahReflection && (
            <div className="p-6 sm:p-8 bg-[#1A202C] border border-[#C5A059]/50 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D3748]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#12161F] border border-[#C5A059]/60 text-[#C5A059] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white font-tajawal">
                      وقفة تدبرية: سورة {selectedSurahMeta.name} (آية {ayahNumber})
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSpeech("ayah-speech", ayahReflection)}
                    className={`px-3 py-1.5 text-xs flex items-center gap-1 cursor-pointer border ${
                      speakingMessageId === "ayah-speech"
                        ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059]"
                        : "bg-[#12161F] hover:bg-[#2D3748] border-[#2D3748] text-stone-300"
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">استماع</span>
                  </button>

                  <button
                    onClick={() => handleCopy("ayah-result", ayahReflection)}
                    className="px-3 py-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-200 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === "ayah-result" ? (
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
                    onClick={() => handleShare(ayahReflection)}
                    className="p-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-200 cursor-pointer"
                    title="مشاركة"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-stone-200 text-sm sm:text-base leading-loose space-y-4">
                <div className="markdown-body">
                  <Markdown>{ayahReflection}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Questions Bank */}
      {mode === "topics" && (
        <div className="space-y-6">
          <div className="p-4 bg-[#1A202C] border border-[#2D3748] text-stone-300 text-xs">
            اختر أي سؤال من بنك التساؤلات والتدبر القرآني للبدء الفوري بالإجابة والتحاور:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionCategories.map((cat) => (
              <div key={cat.id} className="p-5 bg-[#1A202C] border border-[#2D3748] space-y-3">
                <h4 className="font-bold text-sm text-[#C5A059] font-tajawal pb-2 border-b border-[#2D3748]">
                  {cat.title}
                </h4>
                <div className="space-y-2">
                  {cat.questions.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => {
                        setMode("chat");
                        handleSendChatQuestion(q, cat.title);
                      }}
                      className="w-full p-2.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] hover:border-[#C5A059] text-stone-200 text-xs text-right flex items-start gap-2 cursor-pointer transition-colors group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span className="group-hover:text-[#E2C785] transition-colors">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
