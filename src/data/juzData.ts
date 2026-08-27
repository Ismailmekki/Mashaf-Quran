import { GroupKhatmahJuz } from "../types";

export interface JuzMeta {
  juzNumber: number;
  juzName: string;
  surahRange: string;
  startPage: number;
  endPage: number;
}

export const ALL_30_JUZ: JuzMeta[] = [
  { juzNumber: 1, juzName: "الجزء الأول", surahRange: "الفاتحة 1 - البقرة 141", startPage: 1, endPage: 21 },
  { juzNumber: 2, juzName: "الجزء الثاني (سيقول)", surahRange: "البقرة 142 - البقرة 252", startPage: 22, endPage: 41 },
  { juzNumber: 3, juzName: "الجزء الثالث (تلك الرسل)", surahRange: "البقرة 253 - آل عمران 92", startPage: 42, endPage: 61 },
  { juzNumber: 4, juzName: "الجزء الرابع (لن تنالوا)", surahRange: "آل عمران 93 - النساء 23", startPage: 62, endPage: 81 },
  { juzNumber: 5, juzName: "الجزء الخامس (والمحصنات)", surahRange: "النساء 24 - النساء 147", startPage: 82, endPage: 101 },
  { juzNumber: 6, juzName: "الجزء السادس (لا يحب الله)", surahRange: "النساء 148 - المائدة 81", startPage: 102, endPage: 120 },
  { juzNumber: 7, juzName: "الجزء السابع (وإذا سمعوا)", surahRange: "المائدة 82 - الأنعام 110", startPage: 121, endPage: 141 },
  { juzNumber: 8, juzName: "الجزء الثامن (ولو أننا)", surahRange: "الأنعام 111 - الأعراف 87", startPage: 142, endPage: 161 },
  { juzNumber: 9, juzName: "الجزء التاسع (قال الملأ)", surahRange: "الأعراف 88 - الأنفال 40", startPage: 162, endPage: 181 },
  { juzNumber: 10, juzName: "الجزء العاشر (واعلموا)", surahRange: "الأنفال 41 - التوبة 92", startPage: 182, endPage: 200 },
  { juzNumber: 11, juzName: "الجزء الحادي عشر (يعتذرون)", surahRange: "التوبة 93 - هود 5", startPage: 201, endPage: 221 },
  { juzNumber: 12, juzName: "الجزء الثاني عشر (وما من دابة)", surahRange: "هود 6 - يوسف 52", startPage: 222, endPage: 241 },
  { juzNumber: 13, juzName: "الجزء الثالث عشر (وما أبرئ)", surahRange: "يوسف 53 - إبراهيم 52", startPage: 242, endPage: 261 },
  { juzNumber: 14, juzName: "الجزء الرابع عشر (ربما)", surahRange: "الحجر 1 - النحل 128", startPage: 262, endPage: 281 },
  { juzNumber: 15, juzName: "الجزء الخامس عشر (سبحان)", surahRange: "الإسراء 1 - الكهف 74", startPage: 282, endPage: 301 },
  { juzNumber: 16, juzName: "الجزء السادس عشر (قال ألم)", surahRange: "الكهف 75 - طه 135", startPage: 302, endPage: 321 },
  { juzNumber: 17, juzName: "الجزء السابع عشر (اقترب)", surahRange: "الأنبياء 1 - الحج 78", startPage: 322, endPage: 341 },
  { juzNumber: 18, juzName: "الجزء الثامن عشر (قد أفلح)", surahRange: "المؤمنون 1 - الفرقان 20", startPage: 342, endPage: 361 },
  { juzNumber: 19, juzName: "الجزء التاسع عشر (وقال الذين)", surahRange: "الفرقان 21 - النمل 55", startPage: 362, endPage: 381 },
  { juzNumber: 20, juzName: "الجزء العشرون (فما كان)", surahRange: "النمل 56 - العنكبوت 45", startPage: 382, endPage: 401 },
  { juzNumber: 21, juzName: "الجزء الحادي والعشرون (اتل ما أوحي)", surahRange: "العنكبوت 46 - الأحزاب 30", startPage: 402, endPage: 421 },
  { juzNumber: 22, juzName: "الجزء الثاني والعشرون (ومن يقنت)", surahRange: "الأحزاب 31 - يس 27", startPage: 422, endPage: 441 },
  { juzNumber: 23, juzName: "الجزء الثالث والعشرون (وما أنزلنا)", surahRange: "يس 28 - الزمر 31", startPage: 442, endPage: 461 },
  { juzNumber: 24, juzName: "الجزء الرابع والعشرون (فمن أظلم)", surahRange: "الزمر 32 - فصلت 46", startPage: 462, endPage: 481 },
  { juzNumber: 25, juzName: "الجزء الخامس والعشرون (إليه يرد)", surahRange: "فصلت 47 - الجاثية 37", startPage: 482, endPage: 501 },
  { juzNumber: 26, juzName: "الجزء السادس والعشرون (حم)", surahRange: "الأحقاف 1 - الذاريات 30", startPage: 502, endPage: 521 },
  { juzNumber: 27, juzName: "الجزء السابع والعشرون (قال فما خطبكم)", surahRange: "الذاريات 31 - الحديد 29", startPage: 522, endPage: 541 },
  { juzNumber: 28, juzName: "الجزء الثامن والعشرون (قد سمع)", surahRange: "المجادلة 1 - التحريم 12", startPage: 542, endPage: 561 },
  { juzNumber: 29, juzName: "الجزء التاسع والعشرون (تبارك)", surahRange: "الملك 1 - المرسلات 50", startPage: 562, endPage: 581 },
  { juzNumber: 30, juzName: "الجزء الثلاثون (عمّ يتساءلون)", surahRange: "النبأ 1 - الناس 6", startPage: 582, endPage: 604 }
];

export function createInitialJuzAssignments(): GroupKhatmahJuz[] {
  return ALL_30_JUZ.map((j) => ({
    juzNumber: j.juzNumber,
    juzName: j.juzName,
    surahRange: j.surahRange,
    startPage: j.startPage,
    assignedTo: "",
    status: "unassigned"
  }));
}
