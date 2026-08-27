import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialize GenAI
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Model fallback sequence to ensure 99.9% availability during demand spikes
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.7-flash",
  "gemini-2.5-pro",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash-lite",
];

async function generateContentWithFallback(
  ai: GoogleGenAI,
  options: {
    contents: string;
    config?: any;
  }
): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} encountered error:`, err?.status || err?.message || err);
      lastError = err;
      // continue to next model on 503 / 429 / UNAVAILABLE / rate limit / transient spike
      continue;
    }
  }

  throw lastError || new Error("تعذر الاتصال بنماذج الذكاء الاصطناعي حالياً، يرجى المحاولة بعد لحظات.");
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Tadabbur endpoint
app.post("/api/gemini/tadabbur", async (req, res) => {
  try {
    const { surahName, ayahNumber, ayahText, mode = "tadabbur", customQuestion } = req.body;

    if (!ayahText && !customQuestion) {
      return res.status(400).json({ error: "Missing ayahText or question" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.",
      });
    }

    let prompt = "";
    if (mode === "tadabbur") {
      prompt = `أنت عالم وباحث قرآني موثوق، يقدم تدبراً إيمانياً عميقاً ولطائف بلاغية وتربوية للقرآن الكريم.
يرجى تقديم تدبر إيماني وتربوي شامل للآية الكريمة التالية:
سورة: ${surahName || "غير محدد"} - الآية رقم: ${ayahNumber || "1"}
نص الآية: «${ayahText}»

يرجى تنظيم التدبر وفق الهيكل التالي بأسلوب رفيع ومؤثر:
1. **المعنى العام والهدف الإيماني للآية**
2. **لطائف بلاغية ودلالية** (أسرار الكلمات واختيار الألفاظ)
3. **أسباب النزول أو السياق القرآني** (إن وجد بشكل موثق)
4. **وقفات تربوية وتطبيق عملي في حياتنا اليومية**
5. **دعاء مستوحى من هدي الآية**

اجعل الإجابة بتنسيق Markdown جميل وواضح، مع الضبط التام والوقار الإسلامي المعتمد.`;
    } else if (mode === "tafseer") {
      prompt = `قدم خلاصة جامعة لتفسير الآية الكريمة التالية من كتب التفسير المعتمدة (تفسير ابن كثير، تفسير السعدي، التفسير الميسر):
سورة: ${surahName} - الآية: ${ayahNumber}
الآية: «${ayahText}»

وضح غريب الألفاظ ومعاني المفردات، والمقصود بالآية، وما ترشد إليه.`;
    } else if (mode === "question" && customQuestion) {
      prompt = `حول الآية الكريمة:
سورة ${surahName} آية ${ayahNumber}: «${ayahText}»
سؤال السائل: "${customQuestion}"

أجب إجابة علمية إسلامية موثوقة ومبسطة بالرجوع لعلوم القرآن والتفسير المعتمد.`;
    } else {
      prompt = `قدم تدبراً وإضاءة حول الآية: ${ayahText} من سورة ${surahName} آية ${ayahNumber}.`;
    }

    const text = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: "أنت مساعد قرآني إسلامي متخصص في علوم القرآن والتفسير والتدبر واللغة العربية والبلاغة. تلتزم بالمنهج الإسلامي الموثوق مع إيراد الشواهد والأدلة بلغة عربية فصيحة ومؤثرة.",
        temperature: 0.7,
      },
    });

    return res.json({
      result: text || "عذراً، تعذر توليد التدبر في الوقت الحالي.",
    });
  } catch (error: any) {
    console.error("Gemini Tadabbur error:", error);
    return res.status(500).json({
      error: error?.message || "حدث خطأ أثناء معالجة طلب التدبر بالذكاء الاصطناعي.",
    });
  }
});

// Quran AI Assistant endpoint for broad questions, themes, and interactive multi-turn chat
app.post("/api/gemini/ask-quran", async (req, res) => {
  try {
    const { question, history = [], category } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing question" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.",
      });
    }

    const systemInstruction = `أنت "المساعد القرآني الذكي والمجيب التفاعلي" (Interactive Quran AI Companion & Tadabbur Assistant).
مهمتك مساعدة المستخدم في:
1. الإجابة الدقيقة والموثقة عن أسئلة القرآن الكريم، أسباب النزول، التفسير، قصص الأنبياء، والإعجاز البلاغي والعلمي.
2. استخراج الآيات الدالة على أي موضوع أو حاجة إنسانية (تفريج الهموم، الرزق، الشفاء، التوبة، الصبر، بر الوالدين).
3. إيراد نصوص الآيات بدقة بين علامتي « » مع ذكر اسم السورة ورقم الآية دائماً.
4. تقديم لفتات تدبرية عميقة ووقفات تربوية مع اقتراح أدعية قرآنية مناسبة.
5. الرد بأسلوب إيماني رصين، فصيح، مرتب باستخدام عناوين فريدة ونقاط Markdown واضحة، مع اقتراح أسئلة تالية للمتابعة في نهاية الإجابة.`;

    let userPrompt = "";
    if (category) {
      userPrompt += `[التصنيف المحدد: ${category}]\n`;
    }
    if (history && history.length > 0) {
      userPrompt += `سياق المحادثة السابقة:\n${history.map((h: any) => `${h.sender === "user" ? "السائل" : "المجيب"}: ${h.text}`).join("\n")}\n\n`;
    }
    userPrompt += `السؤال الحالي: ${question}`;

    const text = await generateContentWithFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return res.json({
      answer: text || "عذراً، لم أتمكن من الحصول على إجابة.",
    });
  } catch (error: any) {
    console.error("Gemini Ask Quran error:", error);
    return res.status(500).json({
      error: error?.message || "حدث خطأ أثناء الاتصال بالمساعد القرآني.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Quran App server running on http://localhost:${PORT}`);
  });
}

startServer();
