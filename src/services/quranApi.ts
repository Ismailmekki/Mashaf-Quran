import { Ayah, SurahDetail } from "../types";
import { SURAHS_LIST } from "../data/surahsData";

const CACHE_PREFIX = "quran_surah_v5_";
const PAGE_CACHE_PREFIX = "quran_page_cache_v5_";

// Fallback initial bundle for Surah 1 (Al-Fatihah)
const FATIHAH_AYAHS: Ayah[] = [
  { number: 1, numberInSurah: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", juz: 1, page: 1 },
  { number: 2, numberInSurah: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "[All] praise is [due] to Allah, Lord of the worlds -", juz: 1, page: 1 },
  { number: 3, numberInSurah: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful,", juz: 1, page: 1 },
  { number: 4, numberInSurah: 4, text: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense.", juz: 1, page: 1 },
  { number: 5, numberInSurah: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help.", juz: 1, page: 1 },
  { number: 6, numberInSurah: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path -", juz: 1, page: 1 },
  { number: 7, numberInSurah: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", juz: 1, page: 1 }
];

// Fallback initial bundle for Surah 112 (Al-Ikhlas)
const IKHLAS_AYAHS: Ayah[] = [
  { number: 6222, numberInSurah: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, 'He is Allah, [who is] One,", juz: 30, page: 604 },
  { number: 6223, numberInSurah: 2, text: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge.", juz: 30, page: 604 },
  { number: 6224, numberInSurah: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born,", juz: 30, page: 604 },
  { number: 6225, numberInSurah: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "Nor is there to Him any equivalent.'", juz: 30, page: 604 }
];

export const TAFSEER_EDITIONS_MAP: Record<string, { id: string; name: string; author: string }> = {
  muyassar: { id: "ar.muyassar", name: "التفسير الميسر", author: "نخبة من العلماء - مجمع الملك فهد" },
  saadi: { id: "ar.saadi", name: "تيسير الكريم الرحمن (تفسير السعدي)", author: "الشيخ عبد الرحمن بن ناصر السعدي" },
  ibnkathir: { id: "ar.ibnkathir", name: "تفسير القرآن العظيم (ابن كثير)", author: "الإمام الحافظ ابن كثير الدمشقي" },
  tabari: { id: "ar.tabari", name: "جامع البيان عن تأويل آي القرآن (الطبري)", author: "الإمام أبو جعفر الطبري" },
  qurtubi: { id: "ar.qurtubi", name: "الجامع لأحكام القرآن (القرطبي)", author: "الإمام شمس الدين القرطبي" },
  baghawi: { id: "ar.baghawi", name: "معالم التنزيل (تفسير البغوي)", author: "الإمام الحسين بن مسعود البغوي" },
  jalalayn: { id: "ar.jalalayn", name: "تفسير الجلالين", author: "جلال الدين المحلي وجلال الدين السيوطي" },
  waseet: { id: "ar.waseet", name: "التفسير الوسيط للقرآن الكريم", author: "فضيلة الشيخ محمد سيد طنطاوي" },
  tanweer: { id: "ar.tanweer", name: "التحرير والتنوير", author: "الشيخ محمد الطاهر بن عاشور" },
  eerab: { id: "ar.eerab", name: "إعراب القرآن الكريم وبيانه", author: "محيي الدين درويش" }
};

export const TRANSLATIONS_MAP: Record<string, { id: string; name: string; language: string; flag: string; direction: "ltr" | "rtl" }> = {
  "en": { id: "en.sahih", name: "English (Sahih International)", language: "الإنجليزية", flag: "🇬🇧", direction: "ltr" },
  "en.khattab": { id: "en.sahih", name: "English (The Clear Quran / Sahih)", language: "الإنجليزية - المعاصرة", flag: "🇺🇸", direction: "ltr" },
  "en.yusufali": { id: "en.yusufali", name: "English (Abdullah Yusuf Ali)", language: "الإنجليزية - الكلاسيكية", flag: "🇬🇧", direction: "ltr" },
  "fr": { id: "fr.hamidullah", name: "Français (Muhammad Hamidullah)", language: "الفرنسية", flag: "🇫🇷", direction: "ltr" },
  "ur": { id: "ur.jalandhry", name: "اردو (فتح محمد جالندھری)", language: "الأردية", flag: "🇵🇰", direction: "rtl" },
  "tr": { id: "tr.diyanet", name: "Türkçe (Diyanet İşleri)", language: "التركية", flag: "🇹🇷", direction: "ltr" },
  "id": { id: "id.indonesian", name: "Bahasa Indonesia (Kemenag)", language: "الإندونيسية", flag: "🇮🇩", direction: "ltr" },
  "ru": { id: "ru.kuliev", name: "Русский (Эльмир Кулиев)", language: "الروسية", flag: "🇷🇺", direction: "ltr" },
  "de": { id: "de.bubenheim", name: "Deutsch (Bubenheim & Elyas)", language: "الألمانية", flag: "🇩🇪", direction: "ltr" },
  "es": { id: "es.cortes", name: "Español (Julio Cortés)", language: "الإسبانية", flag: "🇪🇸", direction: "ltr" },
  "fa": { id: "fa.makarem", name: "فارسی (مکارم شیرازی)", language: "الفارسية", flag: "🇮🇷", direction: "rtl" },
  "bn": { id: "bn.bengali", name: "বাংলা (মুহিউদ্দীন খান)", language: "البنغالية", flag: "🇧🇩", direction: "ltr" },
  "zh": { id: "zh.jian", name: "中文 (马坚 - Ma Jian)", language: "الصينية", flag: "🇨🇳", direction: "ltr" },
  "hi": { id: "hi.farooq", name: "हिन्दी (फ़ारूक़ ख़ान)", language: "الهندية", flag: "🇮🇳", direction: "ltr" },
  "ku": { id: "ku.asan", name: "کوردی (بورهان محەمەد ئەمین)", language: "الكردية", flag: "☀️", direction: "rtl" },
  "it": { id: "it.piccardo", name: "Italiano (Hamza Piccardo)", language: "الإيطالية", flag: "🇮🇹", direction: "ltr" },
  "pt": { id: "pt.elhayek", name: "Português (Samir El-Hayek)", language: "البرتغالية", flag: "🇵🇹", direction: "ltr" },
  "bs": { id: "bs.korkut", name: "Bosanski (Besim Korkut)", language: "البوسنية", flag: "🇧🇦", direction: "ltr" },
  "ms": { id: "ms.basmeih", name: "Bahasa Melayu (Abdullah Basmeih)", language: "الماليزية", flag: "🇲🇾", direction: "ltr" },
  "sv": { id: "sv.bernstrom", name: "Svenska (Knut Bernström)", language: "السويدية", flag: "🇸🇪", direction: "ltr" }
};

export function getTranslationEditionId(key: string): string {
  if (TRANSLATIONS_MAP[key]) {
    return TRANSLATIONS_MAP[key].id;
  }
  return key || "en.sahih";
}

export function isValidTranslationText(transText: string | undefined | null, arabicAyahText: string, langKey = "en"): boolean {
  if (!transText || typeof transText !== "string") return false;
  const cleanTrans = transText.trim();
  const cleanArabic = (arabicAyahText || "").trim();
  if (cleanTrans.length === 0) return false;
  // If translation is identical to Arabic text, it is invalid
  if (cleanTrans === cleanArabic) return false;

  // If language is non-Arabic script (English, French, Turkish, Russian, German, etc.), verify it's not Arabic
  const isArabicScriptLang = ["ur", "fa", "ku"].includes(langKey);
  if (!isArabicScriptLang) {
    const arabicChars = cleanTrans.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g);
    if (arabicChars && arabicChars.length > cleanTrans.length * 0.4) {
      return false;
    }
  }

  return true;
}

export async function fetchSurahTranslations(surahNumber: number, translationKey: string): Promise<Map<number, string>> {
  const editionId = getTranslationEditionId(translationKey);
  const translationsMap = new Map<number, string>();

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${editionId}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.ayahs)) {
        for (const a of data.data.ayahs) {
          if (a.text && typeof a.text === "string") {
            translationsMap.set(a.numberInSurah, a.text);
          }
        }
        if (translationsMap.size > 0) {
          return translationsMap;
        }
      }
    }
  } catch (e) {
    console.warn("fetchSurahTranslations primary failed:", e);
  }

  // Fallback to en.sahih if secondary edition failed
  if (editionId !== "en.sahih") {
    try {
      const fallbackRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`);
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (data && data.data && Array.isArray(data.data.ayahs)) {
          for (const a of data.data.ayahs) {
            translationsMap.set(a.numberInSurah, a.text);
          }
        }
      }
    } catch (err) {
      console.warn("fetchSurahTranslations fallback failed:", err);
    }
  }

  return translationsMap;
}

export async function fetchAyahTranslation(surahNumber: number, ayahNumberInSurah: number, translationKey = "en"): Promise<string> {
  const editionId = getTranslationEditionId(translationKey);
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumberInSurah}/${editionId}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.text) {
        return data.data.text;
      }
    }
  } catch (e) {
    console.warn("fetchAyahTranslation error:", e);
  }

  if (editionId !== "en.sahih") {
    try {
      const fb = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumberInSurah}/en.sahih`);
      if (fb.ok) {
        const d = await fb.json();
        if (d?.data?.text) return d.data.text;
      }
    } catch (e) {}
  }

  return "";
}

export async function fetchSurah(surahNumber: number, translationEdition = "en"): Promise<SurahDetail> {
  const meta = SURAHS_LIST.find((s) => s.number === surahNumber) || SURAHS_LIST[0];
  const editionId = getTranslationEditionId(translationEdition);

  // Check LocalStorage cache first
  const cacheKey = `${CACHE_PREFIX}${surahNumber}_${editionId}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (
        parsed &&
        Array.isArray(parsed.ayahs) &&
        parsed.ayahs.length > 0 &&
        parsed.ayahs[0].translation &&
        isValidTranslationText(parsed.ayahs[0].translation, parsed.ayahs[0].text, translationEdition)
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Storage cache read failed:", e);
  }

  // If Fatihah or Ikhlas offline
  if (surahNumber === 1 && !navigator.onLine) {
    return { ...meta, ayahs: FATIHAH_AYAHS };
  }
  if (surahNumber === 112 && !navigator.onLine) {
    return { ...meta, ayahs: IKHLAS_AYAHS };
  }

  try {
    // Fetch Arabic Uthmani text and translation together
    const [arabicRes, transRes] = await Promise.allSettled([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${editionId}`)
    ]);

    let arabicData: any = null;
    let transData: any = null;

    if (arabicRes.status === "fulfilled" && arabicRes.value.ok) {
      arabicData = await arabicRes.value.json();
    }
    if (transRes.status === "fulfilled" && transRes.value.ok) {
      transData = await transRes.value.json();
    }

    if (!arabicData || !arabicData.data || !arabicData.data.ayahs) {
      // Fallback to secondary endpoint
      const fallbackRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      if (fallbackRes.ok) {
        arabicData = await fallbackRes.json();
      }
    }

    if (!arabicData || !arabicData.data || !arabicData.data.ayahs) {
      if (surahNumber === 1) return { ...meta, ayahs: FATIHAH_AYAHS };
      if (surahNumber === 112) return { ...meta, ayahs: IKHLAS_AYAHS };
      throw new Error("تعذر تحميل بيانات السورة");
    }

    const translationsMap = new Map<number, string>();
    if (transData && transData.data && transData.data.ayahs) {
      for (const a of transData.data.ayahs) {
        translationsMap.set(a.numberInSurah, a.text);
      }
    } else if (editionId !== "en.sahih") {
      // Try fallback to en.sahih
      try {
        const enFallback = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`);
        if (enFallback.ok) {
          const enJson = await enFallback.json();
          if (enJson?.data?.ayahs) {
            for (const a of enJson.data.ayahs) {
              translationsMap.set(a.numberInSurah, a.text);
            }
          }
        }
      } catch (err) {}
    }

    const ayahs: Ayah[] = arabicData.data.ayahs.map((a: any) => {
      let text = a.text;
      // In surah 1 or if basmalah is prefixed awkwardly on ayah 1 except Tawbah
      if (surahNumber !== 1 && surahNumber !== 9 && a.numberInSurah === 1) {
        text = text.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, "");
      }
      const rawTrans = translationsMap.get(a.numberInSurah) || "";
      const validTrans = isValidTranslationText(rawTrans, text, translationEdition) ? rawTrans : "";

      return {
        number: a.number,
        numberInSurah: a.numberInSurah,
        text: text || a.text,
        translation: validTrans,
        juz: a.juz,
        page: a.page,
        hizbQuarter: a.hizbQuarter,
        sajda: a.sajda
      };
    });

    const surahDetail: SurahDetail = {
      ...meta,
      ayahs
    };

    // Cache in localStorage for fast re-reading
    try {
      localStorage.setItem(cacheKey, JSON.stringify(surahDetail));
    } catch (e) {
      // Quota exceeded or private mode, safe to ignore
    }

    return surahDetail;
  } catch (error) {
    console.error("fetchSurah error:", error);
    if (surahNumber === 1) return { ...meta, ayahs: FATIHAH_AYAHS };
    if (surahNumber === 112) return { ...meta, ayahs: IKHLAS_AYAHS };
    throw error;
  }
}

export async function fetchTafseer(surahNumber: number, ayahNumberInSurah: number, tafseerId = "ar.muyassar"): Promise<string> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumberInSurah}/${tafseerId}`);
    if (response.ok) {
      const data = await response.json();
      return data?.data?.text || "لا يتوفر تفسير لهذه الآية حالياً.";
    }
  } catch (e) {
    console.warn("fetchTafseer error:", e);
  }
  return "التفسير غير متوفر حالياً. يمكنك استخدام زر «تدبر بالذكاء الاصطناعي» للحصول على تحليل وتفسير فوري.";
}

export interface SearchResult {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
}

export async function searchQuranText(keyword: string): Promise<{ results: SearchResult[]; total: number }> {
  try {
    const encoded = encodeURIComponent(keyword.trim());
    const res = await fetch(`https://api.alquran.cloud/v1/search/${encoded}/all/ar`);
    if (res.ok) {
      const data = await res.json();
      const matches = data?.data?.matches || [];
      const results: SearchResult[] = matches.map((m: any) => ({
        surahNumber: m.surah.number,
        surahName: m.surah.name,
        ayahNumber: m.numberInSurah,
        text: m.text
      }));
      return {
        results: results.slice(0, 50),
        total: data?.data?.count || results.length
      };
    }
  } catch (err) {
    console.warn("searchQuranText error:", err);
  }
  return { results: [], total: 0 };
}

export async function fetchMushafPage(pageNumber: number): Promise<{ pageNumber: number; ayahs: Ayah[]; surahsInPage: number[] }> {
  const cacheKey = `${PAGE_CACHE_PREFIX}${pageNumber}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // Ignore
  }

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
    if (res.ok) {
      const json = await res.json();
      const rawAyahs = json?.data?.ayahs || [];
      const surahsSet = new Set<number>();
      const ayahs: Ayah[] = rawAyahs.map((a: any) => {
        if (a.surah && a.surah.number) {
          surahsSet.add(a.surah.number);
        }
        return {
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text,
          juz: a.juz,
          page: a.page,
          hizbQuarter: a.hizbQuarter,
          sajda: a.sajda
        };
      });

      const pageData = {
        pageNumber,
        ayahs,
        surahsInPage: Array.from(surahsSet)
      };

      try {
        localStorage.setItem(cacheKey, JSON.stringify(pageData));
      } catch (e) {}

      return pageData;
    }
  } catch (e) {
    console.error("fetchMushafPage error:", e);
  }

  return {
    pageNumber,
    ayahs: [],
    surahsInPage: []
  };
}


