import { PrayerTimesData } from "../types";

export interface CityLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number;
  ianaTimezone?: string;
  recommendedMethod?: CalculationMethodCode;
}

export type CalculationMethodCode =
  | "MWL" // Muslim World League
  | "MAKKAH" // Umm Al-Qura (Makkah)
  | "EGYPT" // Egyptian General Authority of Survey
  | "FRANCE" // UOIF / Grande Mosquée de Paris (12°)
  | "ISNA" // Islamic Society of North America (15°)
  | "DIYANET" // Turkey Diyanet
  | "KARACHI" // University of Islamic Sciences, Karachi
  | "TEHRAN" // Institute of Geophysics, Univ of Tehran
  | "GULF"; // Gulf Region

export type JuristicMethodCode = "STANDARD" | "HANAFI";

export interface CalculationMethodConfig {
  code: CalculationMethodCode;
  name: string;
  fajrAngle: number;
  ishaAngle: number;
  ishaIntervalMinutes?: number; // E.g. 90 minutes for Makkah
  maghribAngle?: number;
}

export const CALCULATION_METHODS: Record<CalculationMethodCode, CalculationMethodConfig> = {
  MWL: {
    code: "MWL",
    name: "رابطة العالم الإسلامي (MWL)",
    fajrAngle: 18.0,
    ishaAngle: 17.0
  },
  MAKKAH: {
    code: "MAKKAH",
    name: "أم القرى - مكة المكرمة",
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaIntervalMinutes: 90
  },
  EGYPT: {
    code: "EGYPT",
    name: "الهيئة المصرية العامة للمساحة",
    fajrAngle: 19.5,
    ishaAngle: 17.5
  },
  FRANCE: {
    code: "FRANCE",
    name: "فرنسا وأوروبا (اتحاد مساجد فرنسا UOIF - 12°)",
    fajrAngle: 12.0,
    ishaAngle: 12.0
  },
  ISNA: {
    code: "ISNA",
    name: "الجمعية الإسلامية لأمريكا الشمالية (ISNA - 15°)",
    fajrAngle: 15.0,
    ishaAngle: 15.0
  },
  DIYANET: {
    code: "DIYANET",
    name: "رئاسة الشؤون الدينية التركية (Diyanet)",
    fajrAngle: 18.0,
    ishaAngle: 17.0
  },
  KARACHI: {
    code: "KARACHI",
    name: "جامعة العلوم الإسلامية بكراتشي",
    fajrAngle: 18.0,
    ishaAngle: 18.0
  },
  TEHRAN: {
    code: "TEHRAN",
    name: "معهد الجيوفيزياء بجامعة طهران",
    fajrAngle: 17.7,
    ishaAngle: 14.0,
    maghribAngle: 4.5
  },
  GULF: {
    code: "GULF",
    name: "دول الخليج العربي",
    fajrAngle: 19.5,
    ishaAngle: 0,
    ishaIntervalMinutes: 90
  }
};

export const POPULAR_CITIES: CityLocation[] = [
  { name: "مكة المكرمة", country: "السعودية", lat: 21.4225, lng: 39.8262, timezone: 3, ianaTimezone: "Asia/Riyadh", recommendedMethod: "MAKKAH" },
  { name: "المدينة المنورة", country: "السعودية", lat: 24.5247, lng: 39.5692, timezone: 3, ianaTimezone: "Asia/Riyadh", recommendedMethod: "MAKKAH" },
  { name: "القدس الشريف", country: "فلسطين", lat: 31.7683, lng: 35.2137, timezone: 2, ianaTimezone: "Asia/Jerusalem", recommendedMethod: "MWL" },
  { name: "الرياض", country: "السعودية", lat: 24.7136, lng: 46.6753, timezone: 3, ianaTimezone: "Asia/Riyadh", recommendedMethod: "MAKKAH" },
  { name: "جدة", country: "السعودية", lat: 21.5433, lng: 39.1728, timezone: 3, ianaTimezone: "Asia/Riyadh", recommendedMethod: "MAKKAH" },
  { name: "القاهرة", country: "مصر", lat: 30.0444, lng: 31.2357, timezone: 2, ianaTimezone: "Africa/Cairo", recommendedMethod: "EGYPT" },
  { name: "الإسكندرية", country: "مصر", lat: 31.2001, lng: 29.9187, timezone: 2, ianaTimezone: "Africa/Cairo", recommendedMethod: "EGYPT" },
  { name: "باريس", country: "فرنسا", lat: 48.8566, lng: 2.3522, timezone: 1, ianaTimezone: "Europe/Paris", recommendedMethod: "FRANCE" },
  { name: "مرسيليا", country: "فرنسا", lat: 43.2965, lng: 5.3698, timezone: 1, ianaTimezone: "Europe/Paris", recommendedMethod: "FRANCE" },
  { name: "ليون", country: "فرنسا", lat: 45.7640, lng: 4.8357, timezone: 1, ianaTimezone: "Europe/Paris", recommendedMethod: "FRANCE" },
  { name: "دبي", country: "الإمارات", lat: 25.2048, lng: 55.2708, timezone: 4, ianaTimezone: "Asia/Dubai", recommendedMethod: "GULF" },
  { name: "أبو ظبي", country: "الإمارات", lat: 24.4539, lng: 54.3773, timezone: 4, ianaTimezone: "Asia/Dubai", recommendedMethod: "GULF" },
  { name: "الدوحة", country: "قطر", lat: 25.2854, lng: 51.531, timezone: 3, ianaTimezone: "Asia/Qatar", recommendedMethod: "GULF" },
  { name: "الكويت", country: "الكويت", lat: 29.3759, lng: 47.9774, timezone: 3, ianaTimezone: "Asia/Kuwait", recommendedMethod: "GULF" },
  { name: "المنامة", country: "البحرين", lat: 26.2285, lng: 50.586, timezone: 3, ianaTimezone: "Asia/Bahrain", recommendedMethod: "GULF" },
  { name: "مسقط", country: "عمان", lat: 23.588, lng: 58.3829, timezone: 4, ianaTimezone: "Asia/Muscat", recommendedMethod: "GULF" },
  { name: "عمان", country: "الأردن", lat: 31.9522, lng: 35.2332, timezone: 3, ianaTimezone: "Asia/Amman", recommendedMethod: "MWL" },
  { name: "دمشق", country: "سوريا", lat: 33.5138, lng: 36.2765, timezone: 3, ianaTimezone: "Asia/Damascus", recommendedMethod: "MWL" },
  { name: "بيروت", country: "لبنان", lat: 33.8938, lng: 35.5018, timezone: 2, ianaTimezone: "Asia/Beirut", recommendedMethod: "MWL" },
  { name: "بغداد", country: "العراق", lat: 33.3152, lng: 44.3661, timezone: 3, ianaTimezone: "Asia/Baghdad", recommendedMethod: "MWL" },
  { name: "صنعاء", country: "اليمن", lat: 15.3694, lng: 44.191, timezone: 3, ianaTimezone: "Asia/Aden", recommendedMethod: "MAKKAH" },
  { name: "الخرطوم", country: "السودان", lat: 15.5007, lng: 32.5599, timezone: 2, ianaTimezone: "Africa/Khartoum", recommendedMethod: "EGYPT" },
  { name: "طرابلس", country: "ليبيا", lat: 32.8872, lng: 13.1913, timezone: 2, ianaTimezone: "Africa/Tripoli", recommendedMethod: "MWL" },
  { name: "تونس", country: "تونس", lat: 36.8065, lng: 10.1815, timezone: 1, ianaTimezone: "Africa/Tunis", recommendedMethod: "MWL" },
  { name: "الجزائر العاصمة", country: "الجزائر", lat: 36.7538, lng: 3.0588, timezone: 1, ianaTimezone: "Africa/Algiers", recommendedMethod: "MWL" },
  { name: "الرباط", country: "المغرب", lat: 34.0209, lng: -6.8416, timezone: 1, ianaTimezone: "Africa/Casablanca", recommendedMethod: "MWL" },
  { name: "الدار البيضاء", country: "المغرب", lat: 33.5731, lng: -7.5898, timezone: 1, ianaTimezone: "Africa/Casablanca", recommendedMethod: "MWL" },
  { name: "نواكشوط", country: "موريتانيا", lat: 18.0735, lng: -15.9582, timezone: 0, ianaTimezone: "Africa/Nouakchott", recommendedMethod: "MWL" },
  { name: "إسطنبول", country: "تركيا", lat: 41.0082, lng: 28.9784, timezone: 3, ianaTimezone: "Europe/Istanbul", recommendedMethod: "DIYANET" },
  { name: "أنقرة", country: "تركيا", lat: 39.9334, lng: 32.8597, timezone: 3, ianaTimezone: "Europe/Istanbul", recommendedMethod: "DIYANET" },
  { name: "لندن", country: "بريطانيا", lat: 51.5074, lng: -0.1278, timezone: 0, ianaTimezone: "Europe/London", recommendedMethod: "FRANCE" },
  { name: "برلين", country: "ألمانيا", lat: 52.52, lng: 13.405, timezone: 1, ianaTimezone: "Europe/Berlin", recommendedMethod: "FRANCE" },
  { name: "بروكسل", country: "بلجيكا", lat: 50.8503, lng: 4.3517, timezone: 1, ianaTimezone: "Europe/Brussels", recommendedMethod: "FRANCE" },
  { name: "أمستردام", country: "هولندا", lat: 52.3676, lng: 4.9041, timezone: 1, ianaTimezone: "Europe/Amsterdam", recommendedMethod: "FRANCE" },
  { name: "مدريد", country: "إسبانيا", lat: 40.4168, lng: -3.7038, timezone: 1, ianaTimezone: "Europe/Madrid", recommendedMethod: "MWL" },
  { name: "روما", country: "إيطاليا", lat: 41.9028, lng: 12.4964, timezone: 1, ianaTimezone: "Europe/Rome", recommendedMethod: "MWL" },
  { name: "نيويورك", country: "أمريكا", lat: 40.7128, lng: -74.006, timezone: -5, ianaTimezone: "America/New_York", recommendedMethod: "ISNA" },
  { name: "شيكاغو", country: "أمريكا", lat: 41.8781, lng: -87.6298, timezone: -6, ianaTimezone: "America/Chicago", recommendedMethod: "ISNA" },
  { name: "لوس أنجلوس", country: "أمريكا", lat: 34.0522, lng: -118.2437, timezone: -8, ianaTimezone: "America/Los_Angeles", recommendedMethod: "ISNA" },
  { name: "تورونتو", country: "كندا", lat: 43.6532, lng: -79.3832, timezone: -5, ianaTimezone: "America/Toronto", recommendedMethod: "ISNA" },
  { name: "مونتريال", country: "كندا", lat: 45.5017, lng: -73.5673, timezone: -5, ianaTimezone: "America/Toronto", recommendedMethod: "ISNA" },
  { name: "جاكرتا", country: "إندونيسيا", lat: -6.2088, lng: 106.8456, timezone: 7, ianaTimezone: "Asia/Jakarta", recommendedMethod: "MWL" },
  { name: "كوالالمبور", country: "ماليزيا", lat: 3.139, lng: 101.6869, timezone: 8, ianaTimezone: "Asia/Kuala_Lumpur", recommendedMethod: "MWL" },
  { name: "إسلام آباد", country: "باكستان", lat: 33.6844, lng: 73.0479, timezone: 5, ianaTimezone: "Asia/Karachi", recommendedMethod: "KARACHI" },
  { name: "كراتشي", country: "باكستان", lat: 24.8607, lng: 67.0011, timezone: 5, ianaTimezone: "Asia/Karachi", recommendedMethod: "KARACHI" },
  { name: "دكا", country: "بنغلاديش", lat: 23.8103, lng: 90.4125, timezone: 6, ianaTimezone: "Asia/Dhaka", recommendedMethod: "KARACHI" },
  { name: "طهران", country: "إيران", lat: 35.6892, lng: 51.389, timezone: 3.5, ianaTimezone: "Asia/Tehran", recommendedMethod: "TEHRAN" },
  { name: "سيدني", country: "أستراليا", lat: -33.8688, lng: 151.2093, timezone: 10, ianaTimezone: "Australia/Sydney", recommendedMethod: "MWL" }
];

// Helper functions for trigonometric conversions
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDegrees(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function fixAngle(angle: number): number {
  angle = angle - 360.0 * Math.floor(angle / 360.0);
  return angle < 0 ? angle + 360.0 : angle;
}

function fixHour(hour: number): number {
  hour = hour - 24.0 * Math.floor(hour / 24.0);
  return hour < 0 ? hour + 24.0 : hour;
}

/**
 * Dynamically resolves the exact UTC offset for an IANA timezone on a specific date (handles Daylight Saving Time DST).
 */
export function getDynamicTimezoneOffset(ianaTimezone?: string, defaultOffset = 3, date = new Date()): number {
  if (!ianaTimezone) return defaultOffset;
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false
    });
    const parts = formatter.formatToParts(date);
    const values: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== "literal") {
        values[p.type] = parseInt(p.value, 10);
      }
    }
    const targetUtc = Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour % 24,
      values.minute,
      values.second
    );
    const localUtc = date.getTime();
    const diffHours = (targetUtc - localUtc) / 3600000;
    return Math.round(diffHours * 100) / 100;
  } catch (e) {
    return defaultOffset;
  }
}

/**
 * Formats authentic Umm Al-Qura / Islamic Hijri date with optional manual day adjustment (±1/±2 days)
 */
export function formatHijriDate(baseDate = new Date(), offsetDays = 0): string {
  try {
    const adjustedDate = new Date(baseDate.getTime() + offsetDays * 86400000);
    const formatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    const formatted = formatter.format(adjustedDate);
    return `${formatted} هـ`;
  } catch (e) {
    const adjustedDate = new Date(baseDate.getTime() + offsetDays * 86400000);
    const hijriMonths = [
      "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
      "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
    ];
    const gy = adjustedDate.getFullYear();
    const hy = Math.round((gy - 622) * (33 / 32));
    const hm = hijriMonths[adjustedDate.getMonth() % 12];
    return `${adjustedDate.getDate()} ${hm} ${hy} هـ`;
  }
}

/**
 * Core Astronomical Sun Ephemeris calculations
 */
function getSunEphemeris(julianDay: number) {
  const d = julianDay - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const L = fixAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g)));
  const e = 23.439 - 0.00000036 * d;

  const sinL = Math.sin(toRadians(L));
  const cosL = Math.cos(toRadians(L));
  const cosE = Math.cos(toRadians(e));
  const sinE = Math.sin(toRadians(e));

  let RA = toDegrees(Math.atan2(cosE * sinL, cosL)) / 15.0;
  RA = fixHour(RA);

  const declination = toDegrees(Math.asin(sinE * sinL));
  const eqTime = q / 15.0 - RA;

  return { declination, eqTime };
}

/**
 * Calculates celestial hour angle H for a given sun altitude (alt) in degrees.
 * If sun is above horizon, alt is POSITIVE (e.g. +30° for Asr).
 * If sun is below horizon, alt is NEGATIVE (e.g. -18° for Fajr, -0.833° for Sunrise).
 */
function getSunHourAngle(alt: number, lat: number, declination: number): number {
  const sinAlt = Math.sin(toRadians(alt));
  const sinLat = Math.sin(toRadians(lat));
  const sinDec = Math.sin(toRadians(declination));
  const cosLat = Math.cos(toRadians(lat));
  const cosDec = Math.cos(toRadians(declination));

  const cosH = (sinAlt - sinLat * sinDec) / (cosLat * cosDec);

  if (cosH > 1) return 0; // Polar condition: sun never reaches this altitude (always below)
  if (cosH < -1) return 12; // Polar condition: sun never goes below this altitude (always above)
  return toDegrees(Math.acos(cosH)) / 15.0;
}

/**
 * Calculates High Latitude Night Portion adjustment for extreme northern/southern locations in summer.
 */
function adjustHighLatitude(time: number, base: number, angle: number, night: number, direction: "ccw" | "cw"): number {
  const portion = (angle / 60.0) * night;
  let diff = direction === "ccw" ? base - time : time - base;
  diff = fixHour(diff);
  if (isNaN(time) || diff > portion) {
    time = direction === "ccw" ? base - portion : base + portion;
  }
  return time;
}

export function calculatePrayerTimes(
  lat: number,
  lng: number,
  timezoneOffsetHours: number,
  date = new Date(),
  cityName = "الموقع الحالي",
  hijriOffsetDays = 0,
  methodCode: CalculationMethodCode = "MWL",
  juristicCode: JuristicMethodCode = "STANDARD"
): PrayerTimesData {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();

  // Julian date calculation
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;

  const { declination, eqTime } = getSunEphemeris(jd);

  // Solar Noon (Zawal / Midday)
  const solarNoon = fixHour(12 + timezoneOffsetHours - lng / 15.0 - eqTime);
  // Dhuhr is slightly after solar noon (+1 minute for ihtiyat/safety)
  const dhuhrHours = fixHour(solarNoon + 1 / 60);

  // Method configuration
  const method = CALCULATION_METHODS[methodCode] || CALCULATION_METHODS.MWL;

  // 1. Sunrise & Sunset (accounting for atmospheric refraction 34' and sun semidiameter 16' = -0.8333°)
  const sunAltRiseSet = -0.8333;
  const sunriseHourAngle = getSunHourAngle(sunAltRiseSet, lat, declination);
  const sunriseHours = fixHour(solarNoon - sunriseHourAngle);
  const sunsetHours = fixHour(solarNoon + sunriseHourAngle);

  // Maghrib time (sunset or angle-based for Tehran)
  let maghribHours = sunsetHours;
  if (method.maghribAngle) {
    const maghribHourAngle = getSunHourAngle(-method.maghribAngle, lat, declination);
    maghribHours = fixHour(solarNoon + maghribHourAngle);
  } else {
    // 1-2 minutes after astronomical sunset for visibility
    maghribHours = fixHour(sunsetHours + 2 / 60);
  }

  // 2. Fajr (Sun is below horizon by fajrAngle, so altitude is -fajrAngle)
  const fajrHourAngle = getSunHourAngle(-method.fajrAngle, lat, declination);
  let fajrHours = fixHour(solarNoon - fajrHourAngle);

  // 3. Isha
  let ishaHours: number;
  if (method.ishaIntervalMinutes && method.ishaIntervalMinutes > 0) {
    ishaHours = fixHour(maghribHours + method.ishaIntervalMinutes / 60);
  } else {
    const ishaHourAngle = getSunHourAngle(-method.ishaAngle, lat, declination);
    ishaHours = fixHour(solarNoon + ishaHourAngle);
  }

  // 4. Asr: Sun is ABOVE horizon!
  // Shadow formula: S = shadowFactor + tan(|lat - declination|)
  // shadowFactor: 1 for Standard (Shafi'i, Maliki, Hanbali), 2 for Hanafi
  const shadowFactor = juristicCode === "HANAFI" ? 2 : 1;
  const shadowLength = shadowFactor + Math.tan(toRadians(Math.abs(lat - declination)));
  // Altitude at Asr is POSITIVE: alt = arctan(1 / shadowLength)
  const asrAltitude = toDegrees(Math.atan(1.0 / shadowLength));
  const asrHourAngle = getSunHourAngle(asrAltitude, lat, declination);
  const asrHours = fixHour(solarNoon + asrHourAngle);

  // 5. High Latitude Adjustment for European / High-latitude locations in summer
  // Night length in hours:
  const nightLength = fixHour(sunriseHours - sunsetHours);
  if (Math.abs(lat) > 45) {
    fajrHours = adjustHighLatitude(fajrHours, sunriseHours, method.fajrAngle, nightLength, "ccw");
    if (!method.ishaIntervalMinutes) {
      ishaHours = adjustHighLatitude(ishaHours, sunsetHours, method.ishaAngle, nightLength, "cw");
    }
  }

  // Time formatter with Arabic period indicators (ص / م)
  const formatTime = (h: number): string => {
    const totalMinutes = Math.round(h * 60);
    const normalizedMinutes = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
    const hours24 = Math.floor(normalizedMinutes / 60);
    const minutes = normalizedMinutes % 60;
    const period = hours24 >= 12 ? "م" : "ص";
    const displayHours = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Convert current time to hours for Next Prayer countdown
  const nowHours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  const prayers = [
    { name: "الفجر", hours: fajrHours },
    { name: "الشروق", hours: sunriseHours },
    { name: "الظهر", hours: dhuhrHours },
    { name: "العصر", hours: asrHours },
    { name: "المغرب", hours: maghribHours },
    { name: "العشاء", hours: ishaHours }
  ];

  let nextPrayer = prayers[0];
  let timeDiff = 0;

  for (const p of prayers) {
    if (p.hours > nowHours) {
      nextPrayer = p;
      timeDiff = p.hours - nowHours;
      break;
    }
  }

  if (timeDiff === 0) {
    // Next prayer is tomorrow's Fajr
    nextPrayer = prayers[0];
    timeDiff = 24 - nowHours + prayers[0].hours;
  }

  const remHours = Math.floor(timeDiff);
  const remMinutes = Math.floor((timeDiff - remHours) * 60);
  const timeRemaining = `متبقي ${remHours} س و ${remMinutes} د`;

  const hijriDate = formatHijriDate(date, hijriOffsetDays);

  return {
    fajr: formatTime(fajrHours),
    sunrise: formatTime(sunriseHours),
    dhuhr: formatTime(dhuhrHours),
    asr: formatTime(asrHours),
    maghrib: formatTime(maghribHours),
    isha: formatTime(ishaHours),
    date: date.toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    hijriDate,
    cityName,
    nextPrayerName: nextPrayer.name,
    timeRemaining
  };
}

// Calculate Qibla bearing towards Kaaba in Makkah (21.4224779, 39.8262063)
export function calculateQiblaBearing(lat: number, lng: number): number {
  const makkahLat = toRadians(21.4224779);
  const makkahLng = toRadians(39.8262063);
  const userLat = toRadians(lat);
  const userLng = toRadians(lng);

  const deltaLng = makkahLng - userLng;
  const y = Math.sin(deltaLng);
  const x = Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(deltaLng);

  let qibla = toDegrees(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;
  return Math.round(qibla);
}
