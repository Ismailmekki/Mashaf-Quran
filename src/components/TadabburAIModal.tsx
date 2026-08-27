import React, { useState } from "react";
import { Sparkles, Send, BookOpen, Copy, Check, RefreshCw, MessageSquare, Lightbulb, Compass } from "lucide-react";
import Markdown from "react-markdown";

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
  const [mode, setMode] = useState<"ayah" | "chat">(initialAyahText ? "ayah" : "chat");
  const [surahName, setSurahName] = useState(initialSurahName || "الفاتحة");
  const [ayahNumber, setAyahNumber] = useState(initialAyahNumber || 1);
  const [ayahText, setAyahText] = useState(initialAyahText || "");
  const [customQuestion, setCustomQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMarkdown, setResponseMarkdown] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const suggestedPrompts = [
    "ما هي الدروس والعبر المستفادة من سورة يوسف؟",
    "اذكر لي آيات الصبر وتفريج الهموم مع التفسير والتدبر",
    "ما هي اللطائف البلاغية والإيمانية في آية الكرسي؟",
    "ما فضل قراءة سورة الملك والكهف؟",
    "كيف يعالج القرآن الكريم القلق وضيق الصدر؟",
    "وصايا لقمان لابنه وتطبيقاتها التربوية المعاصرة"
  ];

  const handleFetchTadabbur = async (overridePrompt?: string) => {
    setLoading(true);
    setError(null);
    setResponseMarkdown("");

    try {
      const q = overridePrompt || customQuestion;
      const endpoint = mode === "ayah" && ayahText ? "/api/gemini/tadabbur" : "/api/gemini/ask-quran";
      const body =
        mode === "ayah" && ayahText
          ? {
              surahName,
              ayahNumber,
              ayahText,
              mode: q ? "question" : "tadabbur",
              customQuestion: q
            }
          : {
              question: q
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "تعذر الحصول على استجابة");
      }

      setResponseMarkdown(data.result || data.answer || "تمت الإجابة بنجاح.");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseMarkdown) return;
    navigator.clipboard.writeText(responseMarkdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28">
      {/* Header with Geometric Balance styling */}
      <div className="p-6 bg-[#1A202C] border border-[#C5A059]/40 shadow-xl mb-6 text-center sm:text-right relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-geometric-hatch opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12161F] border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>مساعد التدبر القرآني الذكي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-tajawal">
              تدبر القرآن الكريم بالذكاء الاصطناعي
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              تأملات إيمانية، لطائف بلاغية، أسباب النزول، وإجابات موثقة حول مواضيع وقصص القرآن الكريم
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[#12161F] p-1 border border-[#2D3748] text-xs">
            <button
              id="btn-tadabbur-mode-ayah"
              onClick={() => setMode("ayah")}
              className={`px-3 py-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === "ayah"
                  ? "bg-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>تدبر آية محددة</span>
            </button>
            <button
              id="btn-tadabbur-mode-chat"
              onClick={() => setMode("chat")}
              className={`px-3 py-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === "chat"
                  ? "bg-[#C5A059] text-[#1A202C] font-bold shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>سؤال وموضوع عام</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Section for Ayah Mode */}
      {mode === "ayah" && (
        <div className="p-5 bg-[#1A202C] border border-[#2D3748] mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs text-stone-400 mb-1 font-mono">اسم السورة:</label>
              <input
                type="text"
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                placeholder="مثال: البقرة، يوسف، الكهف"
                className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-200 text-xs outline-none focus:border-[#C5A059]"
              />
            </div>
            <div className="w-full sm:w-28">
              <label className="block text-xs text-stone-400 mb-1 font-mono">رقم الآية:</label>
              <input
                type="number"
                min="1"
                value={ayahNumber}
                onChange={(e) => setAyahNumber(Number(e.target.value))}
                className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-200 text-xs outline-none focus:border-[#C5A059] font-mono text-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1 font-mono">نص الآية الكريمة (اختياري أو للصق):</label>
            <textarea
              rows={2}
              value={ayahText}
              onChange={(e) => setAyahText(e.target.value)}
              placeholder="الصق نص الآية الكريمة هنا..."
              className="w-full p-3 bg-[#12161F] border border-[#2D3748] text-stone-200 text-sm font-quran outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1 font-mono">سؤال مخصص حول الآية (اختياري):</label>
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="مثال: ما سر تقديم الرحمة على المغفرة في هذه الآية؟"
              className="w-full p-2.5 bg-[#12161F] border border-[#2D3748] text-stone-200 text-xs outline-none focus:border-[#C5A059]"
            />
          </div>

          <button
            id="btn-generate-tadabbur"
            disabled={loading}
            onClick={() => handleFetchTadabbur()}
            className="w-full py-3 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-all border border-[#8B6E3D]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1A202C]/30 border-t-[#1A202C] animate-spin" />
                <span>جارٍ استخلاص اللطائف والتدبر...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#1A202C]" />
                <span>توليد التدبر والتأمل الإيماني</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Input Section for Chat / Topic Mode */}
      {mode === "chat" && (
        <div className="p-5 bg-[#1A202C] border border-[#2D3748] mb-6 space-y-4">
          <div>
            <label className="block text-xs text-stone-400 mb-1 font-mono">
              اسأل عما تشاء في علوم القرآن وتفسيره ومواضيعه:
            </label>
            <div className="flex gap-2">
              <input
                id="input-tadabbur-query"
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading && customQuestion.trim()) {
                    handleFetchTadabbur();
                  }
                }}
                placeholder="مثال: ما هي الآيات التي تتحدث عن الرزق؟ أو قصص بني إسرائيل..."
                className="flex-1 p-3 bg-[#12161F] border border-[#2D3748] text-stone-200 text-sm outline-none focus:border-[#C5A059]"
              />
              <button
                id="btn-send-tadabbur-query"
                disabled={loading || !customQuestion.trim()}
                onClick={() => handleFetchTadabbur()}
                className="px-5 py-3 bg-[#C5A059] hover:bg-[#B38F46] disabled:opacity-40 text-[#1A202C] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all shrink-0 border border-[#8B6E3D]"
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

          {/* Suggested Prompts Grid */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2 font-mono">
              <Lightbulb className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>مواضيع وتساؤلات مقترحة:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomQuestion(prompt);
                    handleFetchTadabbur(prompt);
                  }}
                  className="px-3 py-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] hover:border-[#C5A059] text-stone-300 hover:text-white text-xs transition-colors cursor-pointer text-right"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error View */}
      {error && (
        <div className="p-4 bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs mb-6 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Markdown Response Output Card */}
      {responseMarkdown && (
        <div className="p-6 sm:p-8 bg-[#1A202C] border border-[#C5A059]/50 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-[#2D3748]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#12161F] border border-[#C5A059]/60 text-[#C5A059] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
              </div>
              <h3 className="font-bold text-base text-white font-tajawal">
                الوقفة التدبرية والتفسير
              </h3>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-200 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[#C5A059]">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>نسخ التدبر</span>
                </>
              )}
            </button>
          </div>

          <div className="text-stone-200 text-sm sm:text-base leading-loose space-y-4">
            <div className="markdown-body">
              <Markdown>{responseMarkdown}</Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
