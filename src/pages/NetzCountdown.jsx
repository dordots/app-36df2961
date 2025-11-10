import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hebrewDate from "hebrew-date";

export default function NetzCountdown() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNetzMessage, setShowNetzMessage] = useState(false);
  const wakeLockRef = useRef(null);
  const isRequestingWakeLockRef = useRef(false);

  // עדכון השעון כל 10ms למאיות שנייה חלקות
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10);

    return () => clearInterval(interval);
  }, []);

  // חישוב זמן הנץ הבא (06:00)
  const getNetzTime = () => {
    const now = new Date();
    const netz = new Date();
    netz.setHours(6, 0, 0, 0);

    // אם עברנו את 06:00, הנץ הבא הוא מחר
    if (now >= netz) {
      netz.setDate(netz.getDate() + 1);
    }

    return netz;
  };

  const netzTime = getNetzTime();
  const timeDiff = netzTime - currentTime;

  // חישוב הרכיבים של הזמן
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  const milliseconds = Math.floor((timeDiff % 1000) / 10);

  // פורמט עם אפסים מובילים
  const formatNumber = (num) => String(num).padStart(2, "0");

  // חישוב תאריך עברי ולועזי
  const getHebrewDate = () => {
    try {
      const hDate = hebrewDate(currentTime);
      const monthNames = {
        1: "תשרי", 2: "חשוון", 3: "כסלו", 4: "טבת", 5: "שבט",
        6: "אדר", 7: "ניסן", 8: "איר", 9: "סיוון", 10: "תמוז",
        11: "אב", 12: "אלול", 13: "אדר א"
      };
      return `${hDate.date} ב${monthNames[hDate.month] || ""} ${hDate.year}`;
    } catch (error) {
      return "";
    }
  };

  const getGregorianDate = () => {
    return currentTime.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // בקשת נעילת מסך לשמירה על המסך דולק כל עוד הדף פתוח
  useEffect(() => {
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return;
    }

    const interactionEvents = ["pointerup", "touchend", "keydown"];

    function handleRelease() {
      const currentWakeLock = wakeLockRef.current;
      if (currentWakeLock) {
        currentWakeLock.removeEventListener("release", handleRelease);
      }
      wakeLockRef.current = null;
      if (document.visibilityState === "visible") {
        void requestWakeLock();
      }
    }

    async function requestWakeLock() {
      if (!("wakeLock" in navigator) || isRequestingWakeLockRef.current) {
        return;
      }
      isRequestingWakeLockRef.current = true;
      try {
        const wakeLock = await navigator.wakeLock.request("screen");
        wakeLock.addEventListener("release", handleRelease);
        wakeLockRef.current = wakeLock;
      } catch (error) {
        console.error("נכשלנו בקבלת נעילת מסך:", error);
      } finally {
        isRequestingWakeLockRef.current = false;
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) {
        void requestWakeLock();
      }
    };

    const handleUserInteraction = async () => {
      if (wakeLockRef.current || isRequestingWakeLockRef.current) {
        return;
      }
      await requestWakeLock();
      if (!wakeLockRef.current) {
        return;
      }
      interactionEvents.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };

    interactionEvents.forEach((event) => {
      window.addEventListener(event, handleUserInteraction);
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      interactionEvents.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.removeEventListener("release", handleRelease);
        wakeLockRef.current.release().catch(() => null);
        wakeLockRef.current = null;
      }
    };
  }, []);

  // אפקט להצגת הודעת נץ
  useEffect(() => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      setShowNetzMessage(true);
      const timeout = setTimeout(() => {
        setShowNetzMessage(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [hours, minutes, seconds]);

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-3 sm:px-6 py-6 md:p-8 relative">
      {/* תאריך בפינה הימנית העליונה */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-2 sm:top-4 right-2 sm:right-4 text-right z-20"
      >
        <div className="text-[clamp(0.6rem,2vw,0.85rem)] text-slate-400/70 font-light space-y-0.5">
          <div className="text-slate-300/80">{getHebrewDate()}</div>
          <div className="text-slate-400/60">{getGregorianDate()}</div>
        </div>
      </motion.div>

      {/* אלמנטים דקורטיביים ברקע */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* תוכן ראשי */}
      <div className="relative z-10 w-full max-w-[min(92vw,960px)] mx-auto flex flex-col items-center justify-center gap-[clamp(0.5rem,3.2vw,1.5rem)] text-balance px-1 sm:px-2 py-2 sm:py-3 overflow-y-auto">
        {/* כותרת עליונה */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-[clamp(0.25rem,1.8vw,0.75rem)]"
        >
          <h1 className="text-[min(5.5vw,4.5vh,2.2rem)] font-light text-slate-300/70 tracking-[0.28em]">
            מושב רווחה
          </h1>
          <div className="h-px w-[min(22vw,18vh,8rem)] bg-gradient-to-r from-transparent via-slate-400/30 to-transparent mx-auto" />
        </motion.div>

        {/* שעון הספירה */}
        <div className="w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {showNetzMessage ? (
              <motion.div
                key="netz-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <h2 className="text-4xl md:text-6xl font-light text-amber-300 mb-6">
                    ✨ הנץ החמה הגיע! ✨
                  </h2>
                  <p className="text-xl md:text-2xl text-slate-300/80">
                    בוקר של אור וברכה
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center w-full px-4"
              >
                {/* הספירה היורדת - שעות משמאל, דקות באמצע, שניות מימין */}
                <div className="flex items-center justify-center gap-[clamp(0.35rem,3vw,1.1rem)] sm:gap-[clamp(0.7rem,4vw,1.8rem)] mb-[clamp(0.45rem,3.5vw,1.6rem)]">
                  {/* שעות */}
                  <div className="flex flex-col items-center gap-[clamp(0.25rem,1.6vw,0.6rem)]">
                    <motion.div
                      className="font-mono text-[min(15vw,14vh,6rem)] md:text-[min(12vw,11vh,9rem)] font-thin text-white tracking-tight leading-none"
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(255,255,255,0.3)",
                          "0 0 40px rgba(255,255,255,0.5)",
                          "0 0 20px rgba(255,255,255,0.3)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {formatNumber(hours)}
                    </motion.div>
                    <span className="text-[clamp(0.65rem,2.4vw,1.05rem)] md:text-[clamp(0.85rem,2.1vw,1.3rem)] text-slate-400/60 font-light tracking-[0.3em]">
                      שעות
                    </span>
                  </div>

                  <span className="text-[clamp(2.1rem,9vw,3.5rem)] text-slate-500/50 font-thin">
                    :
                  </span>

                  {/* דקות */}
                  <div className="flex flex-col items-center gap-[clamp(0.25rem,1.6vw,0.6rem)]">
                    <motion.div
                      className="font-mono text-[min(15vw,14vh,6rem)] md:text-[min(12vw,11vh,9rem)] font-thin text-white tracking-tight leading-none"
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(255,255,255,0.3)",
                          "0 0 40px rgba(255,255,255,0.5)",
                          "0 0 20px rgba(255,255,255,0.3)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3,
                      }}
                    >
                      {formatNumber(minutes)}
                    </motion.div>
                    <span className="text-[clamp(0.65rem,2.4vw,1.05rem)] md:text-[clamp(0.85rem,2.1vw,1.3rem)] text-slate-400/60 font-light tracking-[0.3em]">
                      דקות
                    </span>
                  </div>

                  <span className="text-[clamp(2.1rem,9vw,3.5rem)] text-slate-500/50 font-thin">
                    :
                  </span>

                  {/* שניות */}
                  <div className="flex flex-col items-center gap-[clamp(0.25rem,1.6vw,0.6rem)]">
                    <motion.div
                      className="font-mono text-[min(15vw,14vh,6rem)] md:text-[min(12vw,11vh,9rem)] font-thin text-white tracking-tight leading-none"
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(255,255,255,0.3)",
                          "0 0 40px rgba(255,255,255,0.5)",
                          "0 0 20px rgba(255,255,255,0.3)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.6,
                      }}
                    >
                      {formatNumber(seconds)}
                    </motion.div>
                    <span className="text-[clamp(0.65rem,2.4vw,1.05rem)] md:text-[clamp(0.85rem,2.1vw,1.3rem)] text-slate-400/60 font-light tracking-[0.3em]">
                      שניות
                    </span>
                  </div>
                </div>

                {/* מאיות שנייה - קטנות יותר */}
                <motion.div
                  className="text-center mt-[clamp(0.25rem,1.8vw,0.75rem)]"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="font-mono text-[min(6.5vw,6.5vh,2.4rem)] md:text-[min(6vw,6vh,3.1rem)] text-slate-400/70 font-thin">
                    {formatNumber(milliseconds)}
                  </span>
                  <span className="text-sm md:text-lg text-slate-500/50 mr-3">
                    מאיות
                  </span>
                </motion.div>

                {/* קו דקורטיבי */}
                <motion.div
                  className="h-px w-64 md:w-96 bg-gradient-to-r from-transparent via-slate-400/20 to-transparent mx-auto"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* טקסט תחתון */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center space-y-[clamp(0.35rem,2vw,0.9rem)]"
        >
          <div className="h-px w-[min(22vw,18vh,8rem)] bg-gradient-to-r from-transparent via-slate-400/30 to-transparent mx-auto" />
          <p className="text-[min(3.5vw,3vh,1.5rem)] text-slate-300/60 font-light tracking-wide">
            הנץ החמה היום
          </p>
          <motion.p
            className="text-[min(4.3vw,3.8vh,2.2rem)] md:text-[min(4.5vw,4vh,3rem)] text-amber-200/90 font-light"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            06:00
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}