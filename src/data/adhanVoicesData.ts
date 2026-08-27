import { AdhanVoice } from "../types";

export const ADHAN_VOICES: AdhanVoice[] = [
  {
    id: "makkah_ali_mulla",
    name: "أذان الحرم المكي الشريف",
    muadhin: "الشيخ علي بن أحمد ملا (مؤذن الحرم المكي)",
    location: "مكة المكرمة",
    url: "https://media.sd.ma/assabile/adhan_34578/makkah.mp3"
  },
  {
    id: "madinah_bukhari",
    name: "أذان المسجد النبوي الشريف",
    muadhin: "الشيخ عصام بخاري",
    location: "المدينة المنورة",
    url: "https://media.sd.ma/assabile/adhan_34578/madina.mp3"
  },
  {
    id: "aqsa_jerusalem",
    name: "أذان المسجد الأقصى المبارك",
    muadhin: "مؤذنو المسجد الأقصى",
    location: "القدس الشريف",
    url: "https://media.sd.ma/assabile/adhan_34578/al_aqsa.mp3"
  },
  {
    id: "egypt_refaat",
    name: "أذان مصر التاريخي الخاشع",
    muadhin: "الشيخ محمد رفعت",
    location: "مصر",
    url: "https://media.sd.ma/assabile/adhan_34578/mohamed_refaat.mp3"
  },
  {
    id: "abdul_basit_adhan",
    name: "أذان الشيخ عبد الباسط عبد الصمد",
    muadhin: "الشيخ عبد الباسط عبد الصمد",
    location: "مصر / الحرم",
    url: "https://media.sd.ma/assabile/adhan_34578/abdelbasset.mp3"
  },
  {
    id: "fajr_adhan_complete",
    name: "أذان صلاة الفجر (الصلاة خير من النوم)",
    muadhin: "أذان الفجر الشريف",
    location: "الحرمين الشريفين",
    url: "https://media.sd.ma/assabile/adhan_34578/adhan_fajr.mp3",
    isFajr: true
  },
  {
    id: "mustafa_ismail_adhan",
    name: "أذان الشيخ مصطفى إسماعيل",
    muadhin: "الشيخ مصطفى إسماعيل",
    location: "مصر",
    url: "https://media.sd.ma/assabile/adhan_34578/mustapha_ismail.mp3"
  }
];
