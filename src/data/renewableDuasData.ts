import { Dhikr, RenewableDua } from "../types";
export type { RenewableDua };

export const RENEWABLE_DUAS: RenewableDua[] = [
  {
    id: "dua_1",
    category: "relief",
    categoryName: "تفريج الهم والكرب",
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    source: "سورة الأنبياء: 87 (دعاء ذي النون - يونس عليه السلام)",
    reward: "لم يدع بها رجل مسلم في شيء قط إلا استجاب الله له.",
    virtue: "دعاء كاشف الكربات والضوائق"
  },
  {
    id: "dua_2",
    category: "sustenance",
    categoryName: "طلب الرزق والبركة والتيسير",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    translation: "O Allah, I ask You for beneficial knowledge, good provision, and acceptable deeds.",
    source: "سنن ابن ماجه - دعاء النبي ﷺ بعد صلاة الصبح",
    reward: "جامع لخيرات الدنيا والآخرة",
    virtue: "يُسن الدعاء به كل صباح ومساء"
  },
  {
    id: "dua_3",
    category: "healing",
    categoryName: "الشفاء والعافية والمعافاة",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    translation: "O Allah, Lord of mankind, remove the harm and heal; You are the Healer, there is no cure except Your cure, a cure that leaves behind no disease.",
    source: "صحيح البخاري وصحيح مسلم",
    reward: "من أعظم أدعية الرقية النبوية للمريض والمعافاة",
    virtue: "دعاء الشفاء التام بإذن الله"
  },
  {
    id: "dua_4",
    category: "guidance",
    categoryName: "الهداية والثبات وصلاح القلب",
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ، وَيَا مُصَرِّفَ الْقُلُوبِ صَرِّفْ قَلْبِي عَلَى طَاعَتِكَ",
    translation: "O Controller of the hearts, make my heart steadfast upon Your religion.",
    source: "جامع الترمذي وصحيح مسلم",
    reward: "كان أكثر دعاء النبي ﷺ",
    virtue: "حفظ الإيمان والثبات عند الفتن"
  },
  {
    id: "dua_5",
    category: "parents",
    categoryName: "بر الوالدين والرحمة لهما",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا ۝ رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    translation: "My Lord, have mercy upon them as they brought me up when I was small. Our Lord, forgive me and my parents and the believers the Day the account is established.",
    source: "سورة الإسراء: 24 وسورة إبراهيم: 41",
    reward: "ينفع الوالدين في حياتهما وبعد مماتهما ويرفع درجاتهما في الجنة",
    virtue: "من أعظم حقوق الوالدين على الأبناء"
  },
  {
    id: "dua_6",
    category: "forgiveness",
    categoryName: "مغفرة الذنوب والتوبة النصوح",
    arabic: "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ ۝ رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    translation: "Our Lord, indeed we have believed, so forgive us our sins and protect us from the punishment of the Fire. Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    source: "سورة آل عمران: 16 وسورة الأعراف: 23 (دعاء آدم وحواء)",
    reward: "محو الخطايا وتكفير السيئات",
    virtue: "دعاء الاستغفار والتضرع"
  },
  {
    id: "dua_7",
    category: "debt_worry",
    categoryName: "قضاء الدين وزوال الغم",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
    translation: "O Allah, I seek refuge in You from worry and grief, incapacity and laziness, miserliness and cowardice, the burden of debt, and being overpowered by men.",
    source: "صحيح البخاري",
    reward: "أذهب الله همه وقضى عنه دينه",
    virtue: "حصن يومي من الشدائد والديون"
  },
  {
    id: "dua_8",
    category: "family_children",
    categoryName: "صلاح الذرية والأسرة والزوجة",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا ۝ رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ",
    translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.",
    source: "سورة الفرقان: 74 وسورة الصافات: 100",
    reward: "صلاح الأهل والبركة في الذرية وسعادة البيت",
    virtue: "دعاء عباد الرحمن"
  },
  {
    id: "dua_9",
    category: "paradise",
    categoryName: "طلب الفردوس الأعلى والنجاة من النار",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ",
    translation: "O Allah, I ask You for Paradise and whatever brings one closer to it in word or deed, and I seek refuge in You from the Fire and whatever brings one closer to it in word or deed.",
    source: "مسند الإمام أحمد وسنن ابن ماجه",
    reward: "إذا سأل العبد الجنة ثلاثاً قالت الجنة: اللهم أدخله الجنة",
    virtue: "غاية كل مؤمن ومطلبه الأسمى"
  },
  {
    id: "dua_10",
    category: "comprehensive",
    categoryName: "جوامع الخير والدعاء المستجاب",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
    source: "سورة البقرة: 201",
    reward: "أكثر دعاء كان يدعو به رسول الله ﷺ",
    virtue: "جامع لكل خير في المعاش والمعاد"
  },
  {
    id: "dua_11",
    category: "knowledge_wisdom",
    categoryName: "طلب العلم والفهم والحكمة",
    arabic: "رَّبِّ زِدْنِي عِلْمًا ۝ رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي",
    translation: "My Lord, increase me in knowledge. My Lord, expand for me my breast, and ease for me my task, and untie the knot from my tongue, that they may understand my speech.",
    source: "سورة طه: 25-28 وسورة طه: 114 (دعاء موسى والنبي ﷺ)",
    reward: "شرح الصدر، الفصاحة، تيسير الامتحانات ومجالس العلم",
    virtue: "دعاء التوفيق في الدراسة والتبيان"
  },
  {
    id: "dua_12",
    category: "protection_evil",
    categoryName: "الحفظ والاستعاذة من الشرور والحسد",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
    translation: "I seek refuge in the perfect words of Allah from every devil and poisonous reptile and from every evil eye.",
    source: "صحيح البخاري - تعويذ إبراهيم لإسماعيل وإسحاق",
    reward: "حفظ الأبناء والنفس من العين والحسد والمس",
    virtue: "رقية نبوية محكمة"
  },
  {
    id: "dua_13",
    category: "gratitude",
    categoryName: "شكر النعمة وتثبيتها",
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ",
    translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents and to do righteousness of which You will approve and admit me by Your mercy into the rows of Your righteous servants.",
    source: "سورة النمل: 19 (دعاء سليمان عليه السلام)",
    reward: "استدامة النعم وزيادتها بالحمد والشكر",
    virtue: "دعاء شكر النعم والتوفيق للطاعات"
  },
  {
    id: "dua_14",
    category: "travel_need",
    categoryName: "السفر والاستخارة وقضاء الحاجات",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ۝ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ ۝ اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ",
    translation: "Exalted is He who has subjected this to us, and we could not have otherwise subdued it. And indeed we, to our Lord, will return. O Allah, we ask You in this journey of ours for righteousness and piety and deeds pleasing to You.",
    source: "صحيح مسلم وسورة الزخرف: 13-14",
    reward: "حفظ المسافر وتيسير دربه ورجوعه سالماً غانماً",
    virtue: "دعاء ركوب الدابة والسفر"
  },
  {
    id: "dua_15",
    category: "khatm",
    categoryName: "دعاء ختم القرآن الشريف",
    arabic: "اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ، وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ، وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ.",
    translation: "O Allah, have mercy on me through the Quran, and make it for me a leader, a light, guidance, and mercy. O Allah, remind me of what I have forgotten of it, teach me what I do not know of it, and grant me its recitation throughout the hours of night and at the edges of the day, and make it a proof for me, O Lord of the worlds.",
    source: "مأثور ختم القرآن الكريم",
    reward: "استجابة الدعوات ونيل شفاعة القرآن يوم القيامة",
    virtue: "دعاء الختم المبارك"
  }
];

// Function to get today's renewed Dua deterministically based on date
export function getDailyRenewedDua(): RenewableDua {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear) % RENEWABLE_DUAS.length;
  return RENEWABLE_DUAS[index];
}

export const getDailyDua = getDailyRenewedDua;

// Function to get a random renewable Dua
export function getRandomRenewedDua(currentIndex?: number): { dua: RenewableDua; index: number } {
  let nextIndex = Math.floor(Math.random() * RENEWABLE_DUAS.length);
  if (currentIndex !== undefined && RENEWABLE_DUAS.length > 1 && nextIndex === currentIndex) {
    nextIndex = (nextIndex + 1) % RENEWABLE_DUAS.length;
  }
  return { dua: RENEWABLE_DUAS[nextIndex], index: nextIndex };
}

export const getRandomDua = (): RenewableDua => getRandomRenewedDua().dua;
export const RENEWABLE_DUAS_LIST = RENEWABLE_DUAS;
