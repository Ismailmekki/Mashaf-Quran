export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
  revelationOrder: number;
  page: number; // Start page in standard Madinah Mushaf (1-604)
  juz: number;
}

export interface Ayah {
  number: number; // Global ayah number (1 to 6236)
  numberInSurah: number;
  text: string;
  translation?: string;
  tafseer?: string;
  audio?: string;
  juz: number;
  page: number;
  hizbQuarter?: number;
  sajda?: boolean | object;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  serverFolder: string;
  bitrate: string;
  format: "ayah" | "surah";
  surahAudioServer?: string;
  islamicNetworkId?: string;
  style?: "murattal" | "mujawwad" | "teacher" | "haramain";
  riwayah?: string;
  location?: string;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  createdAt: string | number;
  note?: string;
}

export interface KhatmahPlan {
  id: string;
  name: string;
  targetDays: number;
  startDate: string;
  currentPage: number;
  totalPages: number;
  completedDays: number[];
  isFinished: boolean;
}

export interface GroupKhatmahJuz {
  juzNumber: number;
  juzName: string;
  surahRange: string;
  startPage: number;
  assignedTo: string;
  status: "unassigned" | "reading" | "completed";
  completedAt?: string;
  notes?: string;
}

export interface GroupKhatmah {
  id: string;
  title: string;
  intention?: string;
  createdAt: string;
  targetDate?: string;
  participants: string[];
  juzAssignments: GroupKhatmahJuz[];
  isCompleted: boolean;
}

export type QuranTheme = "dark" | "emerald" | "sapphire" | "sepia" | "amber" | "classic";

export type ArabicFont = "amiri" | "quran" | "scheherazade" | "cairo" | "tajawal";

export type TranslationLanguage =
  | "en"
  | "en.khattab"
  | "en.yusufali"
  | "fr"
  | "ur"
  | "tr"
  | "id"
  | "ru"
  | "de"
  | "es"
  | "fa"
  | "bn"
  | "zh"
  | "hi"
  | "ku"
  | "it"
  | "pt"
  | "bs"
  | "ms"
  | "sv";

export type TafseerSource =
  | "muyassar"
  | "saadi"
  | "ibnkathir"
  | "tabari"
  | "qurtubi"
  | "baghawi"
  | "jalalayn"
  | "waseet"
  | "tanweer"
  | "eerab";

export interface ReaderSettings {
  fontSize: number;
  fontFamily: ArabicFont;
  theme: QuranTheme;
  showTranslation: boolean;
  showTajweed?: boolean;
  showTajweedGuide?: boolean;
  translationLang: TranslationLanguage;
  selectedTafseer: TafseerSource;
  autoScroll: boolean;
  audioSpeed?: number;
  repeatAyahTimes?: number;
  playbackSpeed?: number;
  hifzMode?: boolean;
  hifzHideText?: boolean;
  hifzRepeatCount?: number;
}

export interface WordMeaning {
  word: string;
  meaning: string;
  root?: string;
  grammar?: string;
  details?: string;
}

export interface RenewableDua {
  id: string;
  category: string;
  categoryName?: string;
  title?: string;
  text?: string;
  arabic: string;
  translation?: string;
  source?: string;
  reference?: string;
  reward?: string;
  virtue?: string;
}

export interface AdhanVoice {
  id: string;
  name: string;
  muadhin: string;
  location: string;
  url: string;
  isFajr?: boolean;
}

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate: string;
  cityName: string;
  nextPrayerName: string;
  timeRemaining: string;
}

export interface Dhikr {
  id: string;
  category: "morning" | "evening" | "sleep" | "waking" | "post_prayer" | "quran_duas" | "khatmah_dua" | "renewable_duas";
  title: string;
  arabic: string;
  translation?: string;
  repeatCount: number;
  currentCount: number;
  reward?: string;
  reference?: string;
  categoryLabel?: string;
}
