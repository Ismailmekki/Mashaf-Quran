import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  MapPin,
  Volume2,
  Volume1,
  VolumeX,
  Navigation,
  RefreshCw,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Sliders,
  Check,
  AlertCircle,
  Calendar,
  Settings2,
  Pause,
  Info
} from "lucide-react";
import { PrayerTimesData, AdhanVoice } from "../types";
import {
  calculatePrayerTimes,
  calculateQiblaBearing,
  POPULAR_CITIES,
  CityLocation,
  CalculationMethodCode,
  JuristicMethodCode,
  CALCULATION_METHODS,
  getDynamicTimezoneOffset
} from "../utils/prayerTimesCalculator";
import { ADHAN_VOICES } from "../data/adhanVoicesData";

export const PrayerTimesQibla: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(() => {
    const saved = localStorage.getItem("quran_selected_city");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return POPULAR_CITIES.find((c) => c.name === "باريس") || POPULAR_CITIES[0];
  });

  const [calcMethod, setCalcMethod] = useState<CalculationMethodCode>(() => {
    const saved = localStorage.getItem("quran_calc_method") as CalculationMethodCode;
    if (saved && CALCULATION_METHODS[saved]) return saved;
    return selectedCity.recommendedMethod || "FRANCE";
  });

  const [juristicMethod, setJuristicMethod] = useState<JuristicMethodCode>(() => {
    const saved = localStorage.getItem("quran_juristic_method") as JuristicMethodCode;
    return saved === "HANAFI" ? "HANAFI" : "STANDARD";
  });

  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number>(0);
  const [usingGPS, setUsingGPS] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Hijri adjustment offset in days (-2, -1, 0, +1, +2)
  const [hijriOffset, setHijriOffset] = useState<number>(() => {
    const saved = localStorage.getItem("quran_hijri_offset");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // Adhan Voice & Volume State
  const [selectedAdhanVoice, setSelectedAdhanVoice] = useState<AdhanVoice>(() => {
    const savedId = localStorage.getItem("quran_adhan_voice_id");
    return ADHAN_VOICES.find((v) => v.id === savedId) || ADHAN_VOICES[0];
  });

  // Volume level: 0 to 100
  const [adhanVolume, setAdhanVolume] = useState<number>(() => {
    const saved = localStorage.getItem("quran_adhan_volume");
    return saved !== null ? parseInt(saved, 10) : 80;
  });

  // Adhan Notification Auto-play status
  const [autoAdhanNotification, setAutoAdhanNotification] = useState<boolean>(() => {
    const saved = localStorage.getItem("quran_auto_adhan");
    return saved !== null ? saved === "true" : true;
  });

  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [currentPlayingPrayerName, setCurrentPlayingPrayerName] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync volume with audio element
  useEffect(() => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.volume = adhanVolume / 100;
    }
    localStorage.setItem("quran_adhan_volume", adhanVolume.toString());
  }, [adhanVolume]);

  useEffect(() => {
    localStorage.setItem("quran_adhan_voice_id", selectedAdhanVoice.id);
  }, [selectedAdhanVoice]);

  useEffect(() => {
    localStorage.setItem("quran_auto_adhan", autoAdhanNotification.toString());
  }, [autoAdhanNotification]);

  useEffect(() => {
    localStorage.setItem("quran_hijri_offset", hijriOffset.toString());
  }, [hijriOffset]);

  useEffect(() => {
    localStorage.setItem("quran_calc_method", calcMethod);
  }, [calcMethod]);

  useEffect(() => {
    localStorage.setItem("quran_juristic_method", juristicMethod);
  }, [juristicMethod]);

  // Calculate prayer times
  const updateTimes = (
    lat: number,
    lng: number,
    tz: number,
    name: string,
    offset = hijriOffset,
    method = calcMethod,
    juristic = juristicMethod
  ) => {
    const data = calculatePrayerTimes(lat, lng, tz, new Date(), name, offset, method, juristic);
    setPrayerData(data);
    const qibla = calculateQiblaBearing(lat, lng);
    setQiblaAngle(qibla);
  };

  useEffect(() => {
    if (!usingGPS) {
      const accurateTz = getDynamicTimezoneOffset(selectedCity.ianaTimezone, selectedCity.timezone, new Date());
      updateTimes(
        selectedCity.lat,
        selectedCity.lng,
        accurateTz,
        `${selectedCity.name} (${selectedCity.country})`,
        hijriOffset,
        calcMethod,
        juristicMethod
      );
      localStorage.setItem("quran_selected_city", JSON.stringify(selectedCity));
    } else if (detectedCoords) {
      const tz = -new Date().getTimezoneOffset() / 60;
      updateTimes(
        detectedCoords.lat,
        detectedCoords.lng,
        tz,
        `موقعي الحالي (${detectedCoords.lat.toFixed(2)}° N, ${detectedCoords.lng.toFixed(2)}° E)`,
        hijriOffset,
        calcMethod,
        juristicMethod
      );
    }

    // Refresh every minute for countdown timer
    const interval = setInterval(() => {
      if (!usingGPS) {
        const accurateTz = getDynamicTimezoneOffset(selectedCity.ianaTimezone, selectedCity.timezone, new Date());
        updateTimes(
          selectedCity.lat,
          selectedCity.lng,
          accurateTz,
          `${selectedCity.name} (${selectedCity.country})`,
          hijriOffset,
          calcMethod,
          juristicMethod
        );
      } else if (detectedCoords) {
        const tz = -new Date().getTimezoneOffset() / 60;
        updateTimes(
          detectedCoords.lat,
          detectedCoords.lng,
          tz,
          `موقعي الحالي (${detectedCoords.lat.toFixed(2)}° N, ${detectedCoords.lng.toFixed(2)}° E)`,
          hijriOffset,
          calcMethod,
          juristicMethod
        );
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedCity, usingGPS, detectedCoords, hijriOffset, calcMethod, juristicMethod]);

  // Request GPS Geolocation with enhanced error handling & reverse geocoding
  const handleGetLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError("خاصية تحديد الموقع الجغرافي (GPS) غير مدعومة في متصفحك.");
      return;
    }

    setIsLocatingGPS(true);

    const geoSuccess = async (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const tz = -new Date().getTimezoneOffset() / 60;

      setDetectedCoords({ lat, lng });
      setUsingGPS(true);
      setIsLocatingGPS(false);
      setGpsError(null);

      // Auto-detect recommended method based on latitude/longitude (e.g. France/Europe vs Middle East)
      let detectedMethod = calcMethod;
      if (lat >= 42 && lat <= 55 && lng >= -5 && lng <= 10) {
        detectedMethod = "FRANCE";
        setCalcMethod("FRANCE");
      }

      // Attempt reverse geocode to get friendly city name in Arabic
      let locationTitle = `موقعي الحالي (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`
        );
        if (res.ok) {
          const data = await res.json();
          const city = data.city || data.locality || data.principalSubdivision;
          const country = data.countryName;
          if (city && country) {
            locationTitle = `${city}، ${country} (GPS)`;
          } else if (country) {
            locationTitle = `${country} (GPS)`;
          }
        }
      } catch (e) {
        // Fallback to coordinates
      }

      updateTimes(lat, lng, tz, locationTitle, hijriOffset, detectedMethod, juristicMethod);
    };

    const geoError = (err: GeolocationPositionError) => {
      setIsLocatingGPS(false);
      console.warn("GPS Error code:", err.code, err.message);

      if (err.code === err.PERMISSION_DENIED) {
        setGpsError(
          "تم رفض الإذن للوصول إلى الموقع. يمكنك تفعيل إذن الموقع من إعدادات المتصفح أو اختيار مدينتك من القائمة أدناه."
        );
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setGpsError("تعذر التقاط إشارة GPS حالياً. يرجى اختيار مدينتك من القائمة أدناه.");
      } else if (err.code === err.TIMEOUT) {
        setGpsError("استغرق تحديد الموقع وقتاً طويلاً. تم الرجوع للمدينة المحددة.");
      } else {
        setGpsError("حدث خطأ أثناء تحديد الموقع. يمكنك اختيار مدينتك يدوياً.");
      }
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });
  };

  const playAdhanForPrayer = (prayerName: string, customVoice?: AdhanVoice) => {
    const voiceToUse =
      customVoice ||
      (prayerName === "الفجر"
        ? ADHAN_VOICES.find((v) => v.isFajr) || selectedAdhanVoice
        : selectedAdhanVoice);

    if (adhanAudioRef.current) {
      if (isPlayingAdhan && currentPlayingPrayerName === prayerName) {
        adhanAudioRef.current.pause();
        setIsPlayingAdhan(false);
        setCurrentPlayingPrayerName(null);
        return;
      }

      adhanAudioRef.current.src = voiceToUse.url;
      adhanAudioRef.current.volume = adhanVolume / 100;
      adhanAudioRef.current
        .play()
        .then(() => {
          setIsPlayingAdhan(true);
          setCurrentPlayingPrayerName(prayerName);
        })
        .catch((e) => {
          console.warn("Audio play error:", e);
        });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (adhanAudioRef.current && adhanAudioRef.current.duration) {
      const prog = (adhanAudioRef.current.currentTime / adhanAudioRef.current.duration) * 100;
      setAudioProgress(prog || 0);
    }
  };

  const toggleGeneralAdhan = () => {
    if (!adhanAudioRef.current) return;
    if (isPlayingAdhan) {
      adhanAudioRef.current.pause();
      setIsPlayingAdhan(false);
      setCurrentPlayingPrayerName(null);
    } else {
      adhanAudioRef.current.src = selectedAdhanVoice.url;
      adhanAudioRef.current.volume = adhanVolume / 100;
      adhanAudioRef.current
        .play()
        .then(() => {
          setIsPlayingAdhan(true);
          setCurrentPlayingPrayerName("أذان كامل");
        })
        .catch(() => {});
    }
  };

  // Preset volume levels helper
  const setVolumePreset = (level: number) => {
    setAdhanVolume(level);
    if (adhanAudioRef.current) {
      adhanAudioRef.current.volume = level / 100;
    }
  };

  const getVolumeBadge = () => {
    if (adhanVolume === 0 || !autoAdhanNotification) {
      return {
        label: "كتم / غير مفعل",
        icon: VolumeX,
        color: "text-rose-400 border-rose-500/40 bg-rose-950/30"
      };
    }
    if (adhanVolume <= 35) {
      return {
        label: `منخفض (${adhanVolume}%)`,
        icon: Volume1,
        color: "text-amber-300 border-amber-500/40 bg-amber-950/30"
      };
    }
    if (adhanVolume <= 70) {
      return {
        label: `متوسط (${adhanVolume}%)`,
        icon: Volume2,
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/30"
      };
    }
    return {
      label: `عالي (${adhanVolume}%)`,
      icon: Volume2,
      color: "text-[#C5A059] border-[#C5A059]/40 bg-[#C5A059]/10"
    };
  };

  const volBadge = getVolumeBadge();
  const VolumeBadgeIcon = volBadge.icon;

  const filteredCities = citySearchQuery.trim()
    ? POPULAR_CITIES.filter(
        (c) =>
          c.name.includes(citySearchQuery.trim()) ||
          c.country.includes(citySearchQuery.trim())
      )
    : POPULAR_CITIES;

  if (!prayerData) return null;

  const prayerCards = [
    { name: "الفجر", time: prayerData.fajr, icon: Sunrise, hasAdhan: true },
    { name: "الشروق", time: prayerData.sunrise, icon: Sun, hasAdhan: false },
    { name: "الظهر", time: prayerData.dhuhr, icon: Sun, hasAdhan: true },
    { name: "العصر", time: prayerData.asr, icon: Sun, hasAdhan: true },
    { name: "المغرب", time: prayerData.maghrib, icon: Sunset, hasAdhan: true },
    { name: "العشاء", time: prayerData.isha, icon: Moon, hasAdhan: true }
  ];

  const currentMethodConfig = CALCULATION_METHODS[calcMethod] || CALCULATION_METHODS.MWL;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-6">
      {/* Hidden Audio element for Adhan playback */}
      <audio
        ref={adhanAudioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={() => {
          setIsPlayingAdhan(false);
          setCurrentPlayingPrayerName(null);
          setAudioProgress(0);
        }}
      />

      {/* GPS Error Notification if any */}
      {gpsError && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-600/40 flex items-start gap-2 text-xs text-rose-200 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">تنبيه الموقع: </span>
            <span>{gpsError}</span>
          </div>
          <button
            onClick={() => setGpsError(null)}
            className="text-stone-400 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Prayer Hero Banner with Geometric Balance styling */}
      <div className="p-6 bg-[#1A202C] border border-[#C5A059]/40 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-geometric-hatch opacity-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs text-[#C5A059] font-mono mb-1 uppercase tracking-wider">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <strong>{prayerData.cityName}</strong>
              </span>
              <span>•</span>
              <span className="text-[#E2C785] font-semibold">{prayerData.hijriDate}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-tajawal">
              الصلاة القادمة: <span className="text-[#C5A059]">{prayerData.nextPrayerName}</span>
            </h2>
            <p className="text-xs text-[#E2C785] font-mono mt-1 font-bold">
              {prayerData.timeRemaining}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* GPS Location Button */}
            <button
              id="btn-gps-location"
              onClick={handleGetLocation}
              disabled={isLocatingGPS}
              className={`px-3 py-2 text-xs flex items-center gap-1.5 cursor-pointer border transition-colors ${
                usingGPS
                  ? "bg-[#C5A059] border-[#C5A059] text-[#1A202C] font-bold shadow"
                  : "bg-[#12161F] hover:bg-[#2D3748] border-[#2D3748] text-stone-300"
              }`}
              title="تحديد الموقع الجغرافي الدقيق عبر GPS"
            >
              {isLocatingGPS ? (
                <RefreshCw className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />
              )}
              <span>{isLocatingGPS ? "جارٍ التحديد..." : usingGPS ? "موقعي الدقيق (GPS)" : "موقعي الحالي (GPS)"}</span>
            </button>

            {/* Adhan & Settings Drawer Trigger */}
            <button
              id="btn-open-prayer-settings"
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className="px-3 py-2 bg-[#12161F] hover:bg-[#2D3748] text-[#C5A059] border border-[#C5A059]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>إعدادات المواقيت والصوت</span>
            </button>

            {/* General Adhan Preview / Test Button */}
            <button
              id="btn-preview-general-adhan"
              onClick={toggleGeneralAdhan}
              className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#8B6E3D]"
            >
              {isPlayingAdhan ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingAdhan ? "إيقاف الأذان" : "سماع الأذان"}</span>
            </button>
          </div>
        </div>

        {/* Quick Status Pill Bar */}
        <div className="mt-4 pt-3 border-t border-[#2D3748] flex items-center justify-between gap-2 flex-wrap text-xs text-stone-400 font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-stone-400">طريقة الحساب:</span>
            <span className="px-2 py-0.5 border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059] text-[11px] font-semibold">
              {currentMethodConfig.name}
            </span>
            <span className="text-stone-500">•</span>
            <span className="text-[11px] text-stone-300">
              العصر: {juristicMethod === "HANAFI" ? "المذهب الحنفي (مثلين)" : "الجمهور (ظل المثل)"}
            </span>
            <span className="text-stone-500">•</span>
            <div className={`px-2 py-0.5 border text-[11px] font-bold flex items-center gap-1 ${volBadge.color}`}>
              <VolumeBadgeIcon className="w-3 h-3" />
              <span>{volBadge.label}</span>
            </div>
          </div>

          {/* Hijri Adjustment Indicator */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[11px]">
              تعديل الهجري: {hijriOffset > 0 ? `+${hijriOffset}` : hijriOffset} يوم
            </span>
          </div>
        </div>

        {/* Active Audio Bar indicator if Adhan is playing */}
        {isPlayingAdhan && (
          <div className="mt-3 pt-3 border-t border-[#2D3748] relative z-10 flex items-center gap-3 animate-in fade-in">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-[#C5A059] font-bold font-mono">
              جارٍ رفع الأذان: {currentPlayingPrayerName} ({selectedAdhanVoice.name})
            </span>
            <div className="flex-1 h-1.5 bg-[#12161F] overflow-hidden border border-[#2D3748]">
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#E2C785] transition-all duration-300"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
            <button
              onClick={toggleGeneralAdhan}
              className="text-xs px-2 py-0.5 bg-[#12161F] border border-[#2D3748] text-stone-300 hover:text-white"
            >
              إيقاف
            </button>
          </div>
        )}

        {/* Comprehensive Settings & Voice/Volume Panel */}
        {showSettingsPanel && (
          <div className="mt-4 p-5 bg-[#12161F] border border-[#C5A059]/40 space-y-5 relative z-10 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
              <h4 className="text-sm font-bold text-[#C5A059] font-tajawal flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C5A059]" />
                <span>إعدادات حساب المواقيت الدقيقة، الأذان والتاريخ الهجري</span>
              </h4>
              <button
                onClick={() => setShowSettingsPanel(false)}
                className="text-xs text-stone-400 hover:text-white px-2 py-1 bg-[#1A202C] border border-[#2D3748]"
              >
                إغلاق ✕
              </button>
            </div>

            {/* 1. Calculation Method (طريقة ومعيار حساب المواقيت) */}
            <div className="space-y-2 bg-[#1A202C] p-4 border border-[#2D3748]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white font-tajawal flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#C5A059]" />
                  <span>طريقة ومعيار حساب المواقيت:</span>
                </label>
                <span className="text-[11px] text-[#C5A059] font-mono">
                  الفجر {currentMethodConfig.fajrAngle}° / العشاء {currentMethodConfig.ishaIntervalMinutes ? `${currentMethodConfig.ishaIntervalMinutes} دقيقة` : `${currentMethodConfig.ishaAngle}°`}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                في فرنسا وأوروبا يُعتمد معيار (12°) لاتحاد مساجد فرنسا أو (15°) لتجنب تداخل الشفق الصيفي.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {Object.values(CALCULATION_METHODS).map((m) => {
                  const isSelected = calcMethod === m.code;
                  return (
                    <button
                      key={m.code}
                      onClick={() => setCalcMethod(m.code)}
                      className={`p-2.5 text-right text-xs border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#12161F] border-[#C5A059] text-[#C5A059] font-bold"
                          : "bg-[#12161F] hover:bg-[#2D3748] border-[#2D3748] text-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{m.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Asr Juristic School (مذهب صلاة العصر) */}
            <div className="space-y-2 bg-[#1A202C] p-4 border border-[#2D3748]">
              <label className="text-xs font-bold text-white font-tajawal flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#C5A059]" />
                <span>مذهب حساب وقت صلاة العصر:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setJuristicMethod("STANDARD")}
                  className={`p-2.5 text-right text-xs border transition-colors cursor-pointer ${
                    juristicMethod === "STANDARD"
                      ? "bg-[#12161F] border-[#C5A059] text-[#C5A059] font-bold"
                      : "bg-[#12161F] hover:bg-[#2D3748] border-[#2D3748] text-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">مذهب الجمهور (الشافعي، المالكي، الحنبلي)</div>
                      <div className="text-[10px] text-stone-400">عندما يصبح ظل الشيء مثله (المعتمد في أغلب العالم الإسلامي وفرنسا)</div>
                    </div>
                    {juristicMethod === "STANDARD" && <Check className="w-4 h-4 text-[#C5A059] shrink-0" />}
                  </div>
                </button>

                <button
                  onClick={() => setJuristicMethod("HANAFI")}
                  className={`p-2.5 text-right text-xs border transition-colors cursor-pointer ${
                    juristicMethod === "HANAFI"
                      ? "bg-[#12161F] border-[#C5A059] text-[#C5A059] font-bold"
                      : "bg-[#12161F] hover:bg-[#2D3748] border-[#2D3748] text-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">المذهب الحنفي</div>
                      <div className="text-[10px] text-stone-400">عندما يصبح ظل الشيء مثليه</div>
                    </div>
                    {juristicMethod === "HANAFI" && <Check className="w-4 h-4 text-[#C5A059] shrink-0" />}
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Adhan Volume Level Control */}
            <div className="space-y-3 bg-[#1A202C] p-4 border border-[#2D3748]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white font-tajawal flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#C5A059]" />
                  <span>مستوى صوت الأذان والتنبيهات:</span>
                </label>
                <span className="text-xs font-mono font-bold text-[#C5A059]">
                  {adhanVolume}% {adhanVolume === 0 && "(مكتوم)"}
                </span>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-stone-500" />
                <input
                  id="range-adhan-volume"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={adhanVolume}
                  onChange={(e) => setAdhanVolume(Number(e.target.value))}
                  className="flex-1 accent-[#C5A059] cursor-pointer h-2 bg-[#12161F]"
                />
                <Volume2 className="w-4 h-4 text-[#C5A059]" />
              </div>

              {/* Preset Buttons for Quick Volume Switching */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  onClick={() => setVolumePreset(100)}
                  className={`py-2 px-3 text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    adhanVolume === 100
                      ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059] font-bold"
                      : "bg-[#12161F] text-stone-300 border-[#2D3748] hover:bg-[#2D3748]"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>عالي (100%)</span>
                </button>

                <button
                  onClick={() => setVolumePreset(70)}
                  className={`py-2 px-3 text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    adhanVolume === 70
                      ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059] font-bold"
                      : "bg-[#12161F] text-stone-300 border-[#2D3748] hover:bg-[#2D3748]"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>متوسط (70%)</span>
                </button>

                <button
                  onClick={() => setVolumePreset(35)}
                  className={`py-2 px-3 text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    adhanVolume === 35
                      ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059] font-bold"
                      : "bg-[#12161F] text-stone-300 border-[#2D3748] hover:bg-[#2D3748]"
                  }`}
                >
                  <Volume1 className="w-3.5 h-3.5" />
                  <span>منخفض (35%)</span>
                </button>

                <button
                  onClick={() => setVolumePreset(0)}
                  className={`py-2 px-3 text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    adhanVolume === 0
                      ? "bg-rose-600 text-white border-rose-500 font-bold"
                      : "bg-[#12161F] text-rose-300 border-[#2D3748] hover:bg-[#2D3748]"
                  }`}
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>كتم (غير مفعل)</span>
                </button>
              </div>

              {/* Auto Adhan Alert Checkbox */}
              <div className="pt-2 border-t border-[#2D3748] flex items-center justify-between">
                <span className="text-xs text-stone-300">
                  التنبيه الصوتي التلقائي للأذان عند دخول وقت الصلاة:
                </span>
                <button
                  onClick={() => setAutoAdhanNotification(!autoAdhanNotification)}
                  className={`px-3 py-1 text-xs font-bold border transition-colors cursor-pointer ${
                    autoAdhanNotification
                      ? "bg-emerald-600/30 border-emerald-500 text-emerald-400"
                      : "bg-rose-950/30 border-rose-500 text-rose-400"
                  }`}
                >
                  {autoAdhanNotification ? "مفعل ✓" : "غير مفعل ✕"}
                </button>
              </div>
            </div>

            {/* 4. Hijri Date Adjustment Control */}
            <div className="space-y-3 bg-[#1A202C] p-4 border border-[#2D3748]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white font-tajawal flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>مزامنة التاريخ الهجري مع رؤية الهلال المحلية:</span>
                </label>
                <span className="text-xs font-mono font-bold text-[#C5A059]">
                  {prayerData.hijriDate}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {[-2, -1, 0, 1, 2].map((offset) => (
                  <button
                    key={offset}
                    onClick={() => setHijriOffset(offset)}
                    className={`px-3 py-1.5 text-xs font-mono border transition-colors cursor-pointer ${
                      hijriOffset === offset
                        ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                        : "bg-[#12161F] text-stone-300 border-[#2D3748] hover:bg-[#2D3748]"
                    }`}
                  >
                    {offset === 0 ? "التقويم الفعلي (0)" : offset > 0 ? `+${offset} يوم` : `${offset} يوم`}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Adhan Voice Selection */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-[#C5A059] font-tajawal">
                اختر صوت المؤذن ومصدر الأذان:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {ADHAN_VOICES.map((voice) => {
                  const isSelected = selectedAdhanVoice.id === voice.id;
                  return (
                    <button
                      key={voice.id}
                      onClick={() => {
                        setSelectedAdhanVoice(voice);
                        playAdhanForPrayer(voice.name, voice);
                      }}
                      className={`p-2.5 text-right text-xs border flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#1A202C] border-[#C5A059] text-[#C5A059] font-bold"
                          : "bg-[#1A202C] hover:bg-[#2D3748] border-[#2D3748] text-stone-300"
                      }`}
                    >
                      <div>
                        <span className="block font-medium">{voice.name}</span>
                        <span className="text-[10px] text-stone-400 block">
                          {voice.muadhin} ({voice.location})
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#C5A059]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* City Selector Search & List */}
        <div className="mt-4 pt-4 border-t border-[#2D3748] space-y-2 relative z-10">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-stone-400 font-mono">اختر المدينة أو العاصمة:</span>
            <div className="relative">
              <input
                type="text"
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                placeholder="ابحث عن مدينة (مثل باريس، مكة، القاهرة...)"
                className="px-2.5 py-1 text-xs bg-[#12161F] border border-[#2D3748] text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] w-44 sm:w-56"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filteredCities.map((c) => {
              const isSelected = selectedCity.name === c.name && !usingGPS;
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    setSelectedCity(c);
                    if (c.recommendedMethod) {
                      setCalcMethod(c.recommendedMethod);
                    }
                    setUsingGPS(false);
                    setGpsError(null);
                  }}
                  className={`px-3 py-1 text-xs whitespace-nowrap cursor-pointer transition-colors border ${
                    isSelected
                      ? "bg-[#C5A059] text-[#1A202C] font-bold border-[#C5A059]"
                      : "bg-[#12161F] hover:bg-[#2D3748] text-stone-300 border-[#2D3748]"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6 Prayer Times Cards Grid with direct Adhan listen buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayerCards.map((p) => {
          const Icon = p.icon;
          const isNext = p.name === prayerData.nextPrayerName;
          const isThisAdhanPlaying = isPlayingAdhan && currentPlayingPrayerName === p.name;

          return (
            <div
              key={p.name}
              className={`p-4 border text-center transition-all ${
                isNext
                  ? "bg-[#1A202C] border-2 border-[#C5A059] shadow-md relative"
                  : "bg-[#1A202C] border-[#2D3748]"
              }`}
            >
              <div
                className={`w-9 h-9 mx-auto mb-2 flex items-center justify-center border ${
                  isNext
                    ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059]"
                    : "bg-[#12161F] text-[#C5A059] border-[#2D3748]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-200 font-tajawal">{p.name}</h4>
              <p className="font-mono text-base font-bold text-[#C5A059] mt-1">{p.time}</p>

              {isNext && (
                <span className="inline-block text-[10px] px-2 py-0.5 mt-1 bg-[#12161F] text-[#C5A059] border border-[#C5A059]/50 font-mono">
                  الصلاة القادمة
                </span>
              )}

              {/* Direct Adhan playback button for this specific prayer */}
              {p.hasAdhan && (
                <button
                  onClick={() => playAdhanForPrayer(p.name)}
                  className={`mt-2 w-full py-1 text-[11px] font-bold flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
                    isThisAdhanPlaying
                      ? "bg-[#C5A059] text-[#1A202C] border-[#C5A059]"
                      : "bg-[#12161F] hover:bg-[#2D3748] text-[#C5A059] border-[#2D3748]"
                  }`}
                  title={`سماع أذان ${p.name}`}
                >
                  {isThisAdhanPlaying ? <Pause className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isThisAdhanPlaying ? "إيقاف" : "أذان الصلاة"}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Qibla Direction Compass with Geometric Frame */}
      <div className="p-6 bg-[#1A202C] border border-[#2D3748] shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-center gap-2">
          <Compass className="w-5 h-5 text-[#C5A059]" />
          <h3 className="font-bold text-lg text-white font-tajawal">
            اتجاه القبلة نحو الكعبة المشرفة
          </h3>
        </div>
        <p className="text-xs text-stone-400 font-mono">
          زاوية القبلة من موقعك: <strong className="text-[#C5A059] font-mono text-sm">{qiblaAngle}°</strong> من الشمال باتجاه مكة المكرمة
        </p>

        {/* Visual Compass Graphic */}
        <div className="relative w-56 h-56 mx-auto rounded-full bg-[#12161F] border-2 border-[#C5A059]/60 shadow-2xl flex items-center justify-center">
          {/* Compass cardinal directions */}
          <span className="absolute top-2 font-bold text-xs text-[#C5A059] font-mono">ش (N)</span>
          <span className="absolute bottom-2 font-bold text-xs text-stone-400 font-mono">ج (S)</span>
          <span className="absolute right-3 font-bold text-xs text-stone-400 font-mono">ش (E)</span>
          <span className="absolute left-3 font-bold text-xs text-stone-400 font-mono">غ (W)</span>

          {/* Compass Rings */}
          <div className="w-44 h-44 rounded-full border border-[#2D3748] flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-[#2D3748]/60 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#1A202C] border border-[#C5A059]/60 flex items-center justify-center shadow-inner">
                <span className="text-xl">🕋</span>
              </div>
            </div>
          </div>

          {/* Qibla Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700 ease-out"
            style={{ transform: `rotate(${qiblaAngle}deg)` }}
          >
            <div className="w-1 h-36 flex flex-col justify-between items-center">
              {/* North / Kaaba pointer arrow */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[20px] border-b-[#C5A059]" />
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[20px] border-t-rose-500" />
            </div>
          </div>
        </div>

        <div className="text-xs text-stone-400 max-w-sm mx-auto font-mono">
          وجه هاتفك بحيث تشير الإبرة الذهبية مباشرة إلى رمز الكعبة المشرفة 🕋
        </div>
      </div>
    </div>
  );
};
