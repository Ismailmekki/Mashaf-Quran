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

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت مساعد قرآني إسلامي متخصص في علوم القرآن والتفسير والتدبر واللغة العربية والبلاغة. تلتزم بالمنهج الإسلامي الموثوق مع إيراد الشواهد والأدلة بلغة عربية فصيحة ومؤثرة.",
        temperature: 0.7,
      },
    });

    return res.json({
      result: response.text || "عذراً، تعذر توليد التدبر في الوقت الحالي.",
    });
  } catch (error: any) {
    console.error("Gemini Tadabbur error:", error);
    return res.status(500).json({
      error: error?.message || "حدث خطأ أثناء معالجة طلب التدبر بالذكاء الاصطناعي.",
    });
  }
});

// Quran AI Assistant endpoint for broad questions and themes
app.post("/api/gemini/ask-quran", async (req, res) => {
  try {
    const { question, history = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing question" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.",
      });
    }

    const systemInstruction = `أنت "المساعد القرآني الذكي" (Quran AI Companion).
مهمتك مساعدة المسلمين والمهتمين بالقرآن الكريم في:
- الإجابة عن مواضيع القرآن، قصص الأنبياء، الأحكام، الآيات المرتبطة بموضوع معين (مثل الصبر، الرزق، الشفاء، التوبة، البر، التقوى).
- تزويد السائل بأسماء السور وأرقام الآيات الكريمة بدقة تامة.
- الاستشهاد بنصوص الآيات بين علامتي تنصيص « » مع ذكر اسم السورة ورقم الآية.
- تقديم نصائح إيمانية وتربوية من هدي القرآن الكريم والسنة النبوية الصحيحة.
- الرد بلغة عربية فصيحة، واضحة، محترمة، ومرتبة باستخدام Markdown.`;

    const prompt = `سؤال المستخدم: ${question}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return res.json({
      answer: response.text || "عذراً، لم أتمكن من الحصول على إجابة.",
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
