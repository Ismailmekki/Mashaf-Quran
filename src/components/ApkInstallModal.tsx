import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Download,
  Check,
  X,
  Shield,
  Zap,
  WifiOff,
  Star,
  ExternalLink,
  QrCode,
  Share2,
  Copy,
  Info,
  CheckCircle2,
  Apple,
  Layers,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeOsTab, setActiveOsTab] = useState<"auto" | "ios" | "android" | "qr">("auto");
  const [detectedOs, setDetectedOs] = useState<"ios" | "android" | "desktop">("desktop");
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIos) {
      setDetectedOs("ios");
      setActiveOsTab("ios");
    } else if (isAndroid) {
      setDetectedOs("android");
      setActiveOsTab("android");
    } else {
      setDetectedOs("desktop");
      setActiveOsTab("qr");
    }

    // Detect if inside iframe
    try {
      setIsIframe(window.self !== window.top);
    } catch (e) {
      setIsIframe(true);
    }

    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Listen for Chrome/Android beforeinstallprompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (detectedOs === "ios") {
      setActiveOsTab("ios");
    } else if (detectedOs === "android") {
      setActiveOsTab("android");
    } else {
      setActiveOsTab("qr");
    }
  };

  const appDirectUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appDirectUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleOpenDirect = () => {
    window.open(appDirectUrl, "_blank");
  };

  const handleShareToWhatsApp = () => {
    const text = `📖 *تطبيق القرآن الكريم الإلكتروني الشامل (تثبيت مجاني على الهاتف)*\n\nتلاوة، تفسير، أذكار، مواقيت الصلاة، تدبر بالذكاء الاصطناعي، واستماع لكبار القراء.\n\n📲 *رابط تثبيت التطبيق على هاتفك مباشرة:* \n${appDirectUrl}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#1A202C] border border-[#C5A059]/60 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D3748] flex items-center justify-between bg-[#12161F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A059] flex items-center justify-center text-[#1A202C] shadow-md border border-[#8B6E3D] rotate-45 shrink-0">
              <Smartphone className="-rotate-45 w-5 h-5 text-[#1A202C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#C5A059] uppercase font-mono tracking-widest block">
                  PWA & WebAPK Standalone
                </span>
                <span className="px-1.5 py-0.2 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-600 font-mono">
                  يعمل بدون متصفح
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white font-tajawal">
                تثبيت القرآن الكريم على هاتفك (آيفون وأندرويد)
              </h3>
            </div>
          </div>
          <button
            id="btn-close-apk-modal"
            onClick={onClose}
            className="p-2 bg-[#1A202C] border border-[#2D3748] text-stone-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice for Iframe Preview environment */}
        {isIframe && (
          <div className="px-4 py-2.5 bg-[#C5A059]/15 border-b border-[#C5A059]/40 flex items-center justify-between gap-2 text-xs text-[#E2C785]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>لتثبيت التطبيق على هاتفك، افتح الرابط المباشر في متصفحك:</span>
            </div>
            <button
              onClick={handleOpenDirect}
              className="px-2.5 py-1 bg-[#C5A059] text-[#1A202C] font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow"
            >
              <span>فتح الرابط المباشر</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tabs for OS Selection */}
        <div className="flex border-b border-[#2D3748] bg-[#12161F] text-xs font-mono">
          <button
            onClick={() => setActiveOsTab("ios")}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeOsTab === "ios"
                ? "border-[#C5A059] text-[#C5A059] font-bold bg-[#1A202C]"
                : "border-transparent text-stone-400 hover:text-white"
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>هواتف آيفون (iOS)</span>
          </button>

          <button
            onClick={() => setActiveOsTab("android")}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeOsTab === "android"
                ? "border-[#C5A059] text-[#C5A059] font-bold bg-[#1A202C]"
                : "border-transparent text-stone-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>هواتف أندرويد (APK)</span>
          </button>

          <button
            onClick={() => setActiveOsTab("qr")}
            className={`py-3 px-4 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeOsTab === "qr"
                ? "border-[#C5A059] text-[#C5A059] font-bold bg-[#1A202C]"
                : "border-transparent text-stone-400 hover:text-white"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>رمز الاستجابة (QR)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-stone-200">
          
          {/* Main Action Banner */}
          {isInstalled ? (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500 flex items-center gap-3 text-emerald-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">التطبيق مثبت الآن ويعمل كنافذة مستقلة</h4>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  يمكنك فتحه مباشرة من الشاشة الرئيسية في أي وقت وبدون الحاجة لفتح المتصفح.
                </p>
              </div>
            </div>
          ) : deferredPrompt ? (
            <button
              id="btn-trigger-native-install"
              onClick={handleInstallClick}
              className="w-full py-3.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#1A202C] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-98 transition-all border border-[#8B6E3D]"
            >
              <Download className="w-5 h-5" />
              <span>تثبيت التطبيق الآن على هاتفك بضغطة زر 📲</span>
            </button>
          ) : null}

          {/* TAB 1: iOS iPhone & iPad Guide */}
          {activeOsTab === "ios" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-[#12161F] border border-[#C5A059]/40 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Apple className="w-4 h-4 text-[#C5A059]" />
                  <span>طريقة تشغيل التطبيق على الآيفون والآيباد بدون متصفح سفاري:</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  تتيح لك تقنية <strong className="text-[#C5A059]">PWA المستقلة</strong> فتح المصحف الشريف كأي تطبيق أصلي من متجر التطبيقات (كامل الشاشة وبدون شريط عنوان أو أدوات المتصفح).
                </p>
              </div>

              {/* 3 Step Visual Guide for iOS */}
              <div className="space-y-2.5">
                {/* Step 1 */}
                <div className="p-3 bg-[#12161F] border border-[#2D3748] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1A202C] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-xs font-bold text-white">
                      افتح التطبيق في متصفح سفاري (Safari) ثم اضغط على زر المشاركة (Share):
                    </h5>
                    <p className="text-xs text-stone-400">
                      اضغط على أيقونة المربع الذي يحتوي على سهم يشير لأعلى <span className="inline-block px-1.5 py-0.5 bg-[#1A202C] border border-[#2D3748] text-stone-200 font-mono text-[11px]">⎋ Share</span> في أسفل شاشة الآيفون.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-[#12161F] border border-[#2D3748] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1A202C] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-xs font-bold text-white">
                      مرر للأسفل واختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen):
                    </h5>
                    <p className="text-xs text-amber-300">
                      ⚠️ <strong>ملاحظة هامة:</strong> اختر <strong className="text-white">«إضافة إلى الشاشة الرئيسية ➕»</strong> وليس «إضافة إشارة مرجعية / المفضلة»!
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-[#12161F] border border-[#2D3748] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1A202C] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-xs font-bold text-white">
                      اضغط على «إضافة» (Add) في الزاوية العلوية:
                    </h5>
                    <p className="text-xs text-stone-400">
                      ستظهر أيقونة المصحف الشريف الذهبية الفاخرة فوراً على شاشة هاتفك الرئيسية بجوار التطبيقات، وتفتح بدون متصفح!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Android & APK Guide */}
          {activeOsTab === "android" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-[#12161F] border border-[#C5A059]/40 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-[#C5A059]" />
                  <span>طريقة تثبيت التطبيق على هواتف أندرويد (سامسونج، هواوي، شاومي، بكسل):</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  يتم تثبيت التطبيق كـ <strong className="text-[#C5A059]">WebAPK أصلي</strong> على نظام أندرويد ليعمل بكامل وظائفه واستقلاليته دون الحاجة لمتصفح كروم.
                </p>
              </div>

              {/* 3 Step Visual Guide for Android */}
              <div className="space-y-2.5">
                {/* Step 1 */}
                <div className="p-3 bg-[#12161F] border border-[#2D3748] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1A202C] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-xs font-bold text-white">
                      اضغط على قائمة الخيارات الثلاث نقاط (⋮):
                    </h5>
                    <p className="text-xs text-stone-400">
                      في متصفح كروم (Google Chrome) أو سامسونج للإنترنت في أعلى أو أسفل الشاشة.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-[#12161F] border border-[#2D3748] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1A202C] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-xs font-bold text-white">
                      اختر «تثبيت التطبيق» (Install App) أو «إضافة إلى الشاشة الرئيسية»:
                    </h5>
                    <p className="text-xs text-stone-400">
                      سيظهر شريط التثبيت التلقائي لتحميل أيقونة وحزمة التطبيق الكاملة على نظام الأندرويد.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-[#12161F] border border-[#2D3748] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1A202C] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-xs font-bold text-white">
                      افتح التطبيق من شاشة هاتفك أو قائمة التطبيقات:
                    </h5>
                    <p className="text-xs text-emerald-300">
                      يعمل التطبيق كنافذة أندرويد مستقلة تماماً بدون شريط متصفح وبإشعارات وسرعة استجابة فائقة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QR Code & Quick Transfer to Phone */}
          {activeOsTab === "qr" && (
            <div className="space-y-4 animate-in fade-in text-center">
              <div className="p-4 bg-[#12161F] border border-[#2D3748] flex flex-col items-center space-y-3">
                <p className="text-xs text-stone-300 font-tajawal">
                  وجّه كاميرا هاتفك (آيفون أو أندرويد) نحو الرمز التالي لفتح التطبيق وتثبيته فوراً:
                </p>

                {/* Clean QR Code Generator Display */}
                <div className="p-3 bg-white border-2 border-[#C5A059] shadow-lg rounded-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      appDirectUrl
                    )}&color=1A202C&bgcolor=FFFFFF`}
                    alt="QR Code للتثبيت على الهاتف"
                    className="w-44 h-44 object-contain"
                    onError={(e) => {
                      // Fallback if offline
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                <span className="text-[11px] font-mono text-[#C5A059] truncate max-w-full px-2">
                  {appDirectUrl}
                </span>
              </div>
            </div>
          )}

          {/* Action Sharing Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleOpenDirect}
              className="p-2.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              title="فتح الرابط في نافذة جديدة مباشرة"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>فتح بنافذة مباشرة</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2.5 bg-[#12161F] hover:bg-[#2D3748] border border-[#2D3748] text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              title="نسخ رابط التثبيت"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareToWhatsApp}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow"
              title="إرسال الرابط لهاتفك عبر الواتساب"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
              <span>إرسال لهاتفي عبر WhatsApp</span>
            </button>
          </div>

          {/* Features Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
            <div className="p-2 bg-[#12161F] border border-[#2D3748] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="text-[11px]">بدون شريط متصفح</span>
            </div>
            <div className="p-2 bg-[#12161F] border border-[#2D3748] flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="text-[11px]">يعمل بدون إنترنت</span>
            </div>
            <div className="p-2 bg-[#12161F] border border-[#2D3748] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="text-[11px]">خالٍ من الإعلانات</span>
            </div>
            <div className="p-2 bg-[#12161F] border border-[#2D3748] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="text-[11px]">تحديثات تلقائية</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#2D3748] bg-[#12161F] flex items-center justify-between">
          <span className="text-[11px] text-stone-400 font-mono">
            نظام التشغيل المكتشف: {detectedOs === "ios" ? "🍎 آيفون (iOS)" : detectedOs === "android" ? "📱 أندرويد" : "💻 كمبيوتر"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A202C] hover:bg-[#2D3748] border border-[#2D3748] text-stone-200 text-xs font-semibold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
