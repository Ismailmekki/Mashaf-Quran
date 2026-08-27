import { Reciter } from "../types";

export const RECITERS_LIST: Reciter[] = [
  {
    id: "Alafasy_128kbps",
    name: "مشاري بن راشد العفاسي",
    englishName: "Mishary Rashid Alafasy",
    serverFolder: "Alafasy_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "حفص عن عاصم",
    location: "الكويت",
    surahAudioServer: "https://server8.mp3quran.net/afs/"
  },
  {
    id: "Abdul_Basit_Murattal_192kbps",
    name: "عبد الباسط عبد الصمد (مرتل)",
    englishName: "Abdul Basit (Murattal)",
    serverFolder: "Abdul_Basit_Murattal_192kbps",
    bitrate: "192kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "حفص عن عاصم",
    location: "مصر",
    surahAudioServer: "https://server7.mp3quran.net/basit/"
  },
  {
    id: "Abdul_Basit_Mujawwad_128kbps",
    name: "عبد الباسط عبد الصمد (مجود خاشع)",
    englishName: "Abdul Basit (Mujawwad)",
    serverFolder: "Abdul_Basit_Mujawwad_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "mujawwad",
    riwayah: "حفص عن عاصم",
    location: "مصر",
    surahAudioServer: "https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/"
  },
  {
    id: "Minshawy_Murattal_128kbps",
    name: "محمد صديق المنشاوي (مرتل)",
    englishName: "Mohamed Siddiq Al-Minshawi (Murattal)",
    serverFolder: "Minshawy_Murattal_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "حفص عن عاصم",
    location: "مصر",
    surahAudioServer: "https://server10.mp3quran.net/minsh/"
  },
  {
    id: "Minshawy_Teacher_128kbps",
    name: "محمد صديق المنشاوي (المصحف المعلم)",
    englishName: "Al-Minshawi (Teacher Mode / Hifz)",
    serverFolder: "Minshawy_Teacher_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "teacher",
    riwayah: "المصحف المعلم للحفظ",
    location: "مصر",
    surahAudioServer: "https://server10.mp3quran.net/minsh/Almusshaf-Al-Moallim/"
  },
  {
    id: "Minshawy_Mujawwad_192kbps",
    name: "محمد صديق المنشاوي (مجود)",
    englishName: "Mohamed Siddiq Al-Minshawi (Mujawwad)",
    serverFolder: "Minshawy_Mujawwad_192kbps",
    bitrate: "192kbps",
    format: "ayah",
    style: "mujawwad",
    riwayah: "حفص عن عاصم",
    location: "مصر",
    surahAudioServer: "https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/"
  },
  {
    id: "Husary_128kbps",
    name: "محمود خليل الحصري (مرتل)",
    englishName: "Mahmoud Khalil Al-Husary",
    serverFolder: "Husary_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "حفص عن عاصم (دقة الأحكام)",
    location: "مصر",
    surahAudioServer: "https://server13.mp3quran.net/husr/"
  },
  {
    id: "Husary_Muallim_128kbps",
    name: "محمود خليل الحصري (المصحف المعلم)",
    englishName: "Al-Husary (Muallim / Educational)",
    serverFolder: "Husary_Muallim_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "teacher",
    riwayah: "المصحف المعلم مع الترديد",
    location: "مصر",
    surahAudioServer: "https://server13.mp3quran.net/husr/Almusshaf-Al-Moallim/"
  },
  {
    id: "Maher_AlMuaiqly_64kbps",
    name: "ماهر المعيقلي",
    englishName: "Maher Al-Muaiqly",
    serverFolder: "Maher_AlMuaiqly_64kbps",
    bitrate: "64kbps",
    format: "ayah",
    style: "haramain",
    riwayah: "إمام الحرم المكي الشريف",
    location: "مكة المكرمة",
    surahAudioServer: "https://server12.mp3quran.net/maher/"
  },
  {
    id: "Abdurrahmaan_As-Sudais_192kbps",
    name: "عبد الرحمن السديس",
    englishName: "Abdul Rahman Al-Sudais",
    serverFolder: "Abdurrahmaan_As-Sudais_192kbps",
    bitrate: "192kbps",
    format: "ayah",
    style: "haramain",
    riwayah: "إمام الحرم المكي الشريف",
    location: "مكة المكرمة",
    surahAudioServer: "https://server11.mp3quran.net/sds/"
  },
  {
    id: "Saud_Al-Shuraim_128kbps",
    name: "سعود الشريم",
    englishName: "Saud Al-Shuraim",
    serverFolder: "Saood_ash-Shuraym_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "haramain",
    riwayah: "إمام الحرم المكي الشريف",
    location: "مكة المكرمة",
    surahAudioServer: "https://server7.mp3quran.net/shur/"
  },
  {
    id: "Yasser_Ad-Dussary_128kbps",
    name: "ياسر الدوسري",
    englishName: "Yasser Al-Dossari",
    serverFolder: "Yasser_Ad-Dussary_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "haramain",
    riwayah: "إمام الحرم المكي الشريف",
    location: "مكة المكرمة",
    surahAudioServer: "https://server11.mp3quran.net/yasser/"
  },
  {
    id: "Nasser_Alqatami_128kbps",
    name: "ناصر القطامي",
    englishName: "Nasser Al-Qatami",
    serverFolder: "Nasser_Alqatami_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "تلاوة خاشعة",
    location: "الرياض",
    surahAudioServer: "https://server6.mp3quran.net/qtm/"
  },
  {
    id: "Ghamadi_40kbps",
    name: "سعد الغامدي",
    englishName: "Saad Al-Ghamdi",
    serverFolder: "Ghamadi_40kbps",
    bitrate: "40kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "حفص عن عاصم",
    location: "الدمام",
    surahAudioServer: "https://server7.mp3quran.net/s_gmd/"
  },
  {
    id: "Ahmed_ibn_Ali_al-Ajamy_128kbps",
    name: "أحمد بن علي العجمي",
    englishName: "Ahmed Al-Ajmi",
    serverFolder: "Ahmed_ibn_Ali_al-Ajamy_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "تلاوة مؤثرة",
    location: "الخبر",
    surahAudioServer: "https://server10.mp3quran.net/ajm/"
  },
  {
    id: "Abu_Bakr_Ash-Shaatree_128kbps",
    name: "أبو بكر الشاطري",
    englishName: "Abu Bakr Al-Shatri",
    serverFolder: "Abu_Bakr_Ash-Shaatree_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "حفص عن عاصم",
    location: "جدة",
    surahAudioServer: "https://server11.mp3quran.net/shatri/"
  },
  {
    id: "Fares_Abbad_64kbps",
    name: "فارس عباد",
    englishName: "Fares Abbad",
    serverFolder: "Fares_Abbad_64kbps",
    bitrate: "64kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "تلاوة شجية",
    location: "اليمن",
    surahAudioServer: "https://server8.mp3quran.net/frs_a/"
  },
  {
    id: "Ali_Jaber_64kbps",
    name: "علي عبد الله جابر",
    englishName: "Ali Jaber",
    serverFolder: "Ali_Jaber_64kbps",
    bitrate: "64kbps",
    format: "ayah",
    style: "haramain",
    riwayah: "إمام الحرم المكي الأسبق رحمه الله",
    location: "مكة المكرمة",
    surahAudioServer: "https://server11.mp3quran.net/jbr/"
  },
  {
    id: "Idrees_Abkar_128kbps",
    name: "إدريس أبكر",
    englishName: "Idrees Abkar",
    serverFolder: "Idrees_Abkar_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "تلاوة خاشعة جداً",
    location: "أبوظبي",
    surahAudioServer: "https://server6.mp3quran.net/abkr/"
  },
  {
    id: "Hazza_AlBalushi_128kbps",
    name: "هزاع البلوشي",
    englishName: "Hazza Al-Balushi",
    serverFolder: "Hazza_AlBalushi_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "تلاوة هادئة وندية",
    location: "عمان",
    surahAudioServer: "https://server11.mp3quran.net/hazza/"
  },
  {
    id: "Khalid_AlJaleel_128kbps",
    name: "خالد الجليل",
    englishName: "Khalid Al-Jalil",
    serverFolder: "Khalid_AlJaleel_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "تلاوة خاشعة",
    location: "الرياض",
    surahAudioServer: "https://server10.mp3quran.net/jleel/"
  },
  {
    id: "Wadee_AlYamani_128kbps",
    name: "وديع اليمني",
    englishName: "Wadee Al-Yamani",
    serverFolder: "Wadee_AlYamani_128kbps",
    bitrate: "128kbps",
    format: "ayah",
    style: "murattal",
    riwayah: "تلاوة عذبة",
    location: "الكويت",
    surahAudioServer: "https://server6.mp3quran.net/wd3/"
  }
];

export function getAyahAudioUrl(reciterServerFolder: string, surahNumber: number, ayahNumberInSurah: number): string {
  const surahFormatted = String(surahNumber).padStart(3, "0");
  const ayahFormatted = String(ayahNumberInSurah).padStart(3, "0");
  return `https://everyayah.com/data/${reciterServerFolder}/${surahFormatted}${ayahFormatted}.mp3`;
}

export function getSurahAudioUrl(surahNumber: number, reciter: Reciter): string {
  const surahFormatted = String(surahNumber).padStart(3, "0");
  if (reciter.surahAudioServer) {
    return `${reciter.surahAudioServer}${surahFormatted}.mp3`;
  }
  return `https://server8.mp3quran.net/afs/${surahFormatted}.mp3`;
}
