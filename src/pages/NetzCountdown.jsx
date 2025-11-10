import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-between p-8 relative overflow-hidden" dir="rtl">
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
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-between min-h-full py-12">
        {/* כותרת עליונה */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl font-light text-slate-300/70 tracking-[0.3em] mb-2">
            מושב רווחה
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent mx-auto" />
        </motion.div>

        {/* שעון הספירה */}
        <div className="flex-1 flex items-center justify-center w-full">
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
                {/* הספירה היורדת - שניות מימין, שעות משמאל */}
                <div className="flex items-center justify-center gap-2 md:gap-6 mb-8 md:mb-12">
                  {/* שניות */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="font-mono text-7xl md:text-[12rem] lg:text-[16rem] font-thin text-white tracking-tight leading-none"
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
                    <span className="text-sm md:text-xl text-slate-400/60 font-light tracking-widest mt-2 md:mt-4">
                      שניות
                    </span>
                  </div>

                  <span className="text-5xl md:text-8xl text-slate-500/50 font-thin mb-8 md:mb-16">
                    :
                  </span>

                  {/* דקות */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="font-mono text-7xl md:text-[12rem] lg:text-[16rem] font-thin text-white tracking-tight leading-none"
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
                    <span className="text-sm md:text-xl text-slate-400/60 font-light tracking-widest mt-2 md:mt-4">
                      דקות
                    </span>
                  </div>

                  <span className="text-5xl md:text-8xl text-slate-500/50 font-thin mb-8 md:mb-16">
                    :
                  </span>

                  {/* שעות */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="font-mono text-7xl md:text-[12rem] lg:text-[16rem] font-thin text-white tracking-tight leading-none"
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
                    <span className="text-sm md:text-xl text-slate-400/60 font-light tracking-widest mt-2 md:mt-4">
                      שעות
                    </span>
                  </div>
                </div>

                {/* מאיות שנייה - קטנות יותר */}
                <motion.div
                  className="text-center mb-8"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="font-mono text-3xl md:text-5xl text-slate-400/70 font-thin">
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
          className="text-center"
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent mx-auto mb-4" />
          <p className="text-lg md:text-2xl text-slate-300/60 font-light tracking-wide">
            הנץ החמה היום
          </p>
          <motion.p
            className="text-3xl md:text-4xl text-amber-200/90 font-light mt-3"
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