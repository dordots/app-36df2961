import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hebrewDate from "hebrew-date";

// טבלת זמני הנץ החמה לשנת תשפ"ו לפי לוח "בכורי יוסף" למושב רווחה
const NETZ_TIMES_5786 = {
  // תשרי (חודש 1)
  1: {
    1: "06:37:00", 2: "06:37:45", 3: "06:38:15", 4: "06:38:50", 5: "06:39:30",
    6: "06:40:00", 7: "06:40:45", 8: "06:41:20", 9: "06:41:55", 10: "06:42:45",
    11: "06:43:25", 12: "06:44:00", 13: "06:44:35", 14: "06:45:25", 15: "06:45:55",
    16: "06:46:40", 17: "06:47:25", 18: "06:48:00", 19: "06:48:40", 20: "06:49:25",
    21: "06:50:10", 22: "06:50:55", 23: "06:51:50", 24: "06:52:30", 25: "06:53:20",
    26: "06:54:10", 27: "06:54:50", 28: "06:55:30", 29: "06:56:25", 30: "06:57:05"
  },
  // מרחשון (חודש 2)
  2: {
    1: "06:57:50", 2: "06:58:30", 3: "06:59:15", 4: "06:00:10", 5: "06:00:50",
    6: "06:01:35", 7: "06:02:30", 8: "06:03:25", 9: "06:04:20", 10: "06:05:00",
    11: "06:05:50", 12: "06:06:40", 13: "06:07:25", 14: "06:08:10", 15: "06:09:00",
    16: "06:09:40", 17: "06:10:40", 18: "06:11:35", 19: "06:12:20", 20: "06:13:25",
    21: "06:14:15", 22: "06:15:15", 23: "06:16:00", 24: "06:16:55", 25: "06:17:45",
    26: "06:18:30", 27: "06:19:25", 28: "06:20:15", 29: "06:21:10"
  },
  // כסלו (חודש 3)
  3: {
    1: "06:21:55", 2: "06:22:45", 3: "06:23:45", 4: "06:24:35", 5: "06:25:20",
    6: "06:26:10", 7: "06:27:05", 8: "06:28:00", 9: "06:29:05", 10: "06:30:05",
    11: "06:30:45", 12: "06:31:30", 13: "06:32:30", 14: "06:33:15", 15: "06:34:10",
    16: "06:35:00", 17: "06:35:50", 18: "06:36:40", 19: "06:37:25", 20: "06:38:10",
    21: "06:38:55", 22: "06:39:30", 23: "06:40:05", 24: "06:40:45", 25: "06:41:25",
    26: "06:42:00", 27: "06:42:35", 28: "06:43:10", 29: "06:43:45", 30: "06:44:15"
  },
  // טבת (חודש 4)
  4: {
    1: "06:44:50", 2: "06:45:20", 3: "06:45:45", 4: "06:46:15", 5: "06:46:40",
    6: "06:47:05", 7: "06:47:25", 8: "06:47:45", 9: "06:48:05", 10: "06:48:25",
    11: "06:48:45", 12: "06:49:05", 13: "06:49:15", 14: "06:49:25", 15: "06:49:30",
    16: "06:49:35", 17: "06:49:40", 18: "06:49:40", 19: "06:49:35", 20: "06:49:35",
    21: "06:49:25", 22: "06:49:30", 23: "06:49:30", 24: "06:49:05", 25: "06:48:50",
    26: "06:48:35", 27: "06:48:20", 28: "06:48:10", 29: "06:48:05"
  },
  // שבט (חודש 5)
  5: {
    1: "06:47:45", 2: "06:47:20", 3: "06:47:05", 4: "06:46:50", 5: "06:46:25",
    6: "06:46:00", 7: "06:45:35", 8: "06:45:15", 9: "06:44:40", 10: "06:44:15",
    11: "06:43:40", 12: "06:43:05", 13: "06:42:25", 14: "06:41:40", 15: "06:41:05",
    16: "06:40:25", 17: "06:39:40", 18: "06:38:50", 19: "06:38:15", 20: "06:37:35",
    21: "06:36:50", 22: "06:36:00", 23: "06:35:20", 24: "06:34:25", 25: "06:33:30",
    26: "06:32:25", 27: "06:31:25", 28: "06:30:35", 29: "06:29:35", 30: "06:28:35"
  },
  // אדר (חודש 6)
  6: {
    1: "06:27:50", 2: "06:26:40", 3: "06:25:50", 4: "06:24:45", 5: "06:23:40",
    6: "06:22:40", 7: "06:21:30", 8: "06:20:20", 9: "06:19:10", 10: "06:18:00",
    11: "06:16:45", 12: "06:15:35", 13: "06:14:20", 14: "06:13:10", 15: "06:12:05",
    16: "06:10:50", 17: "06:09:35", 18: "06:08:30", 19: "06:07:15", 20: "06:06:05",
    21: "06:04:55", 22: "06:03:35", 23: "06:02:15", 24: "06:00:50", 25: "05:59:45",
    26: "05:58:25", 27: "05:57:15", 28: "05:56:00", 29: "05:54:45"
  },
  // ניסן (חודש 7)
  7: {
    1: "05:53:35", 2: "05:52:10", 3: "05:50:45", 4: "05:49:35", 5: "05:48:10",
    6: "05:46:55", 7: "05:45:30", 8: "05:44:15", 9: "06:42:55", 10: "06:41:30",
    11: "06:40:05", 12: "06:38:55", 13: "06:37:30", 14: "06:36:30", 15: "06:35:20",
    16: "06:34:00", 17: "06:32:35", 18: "06:31:20", 19: "06:30:00", 20: "06:28:40",
    21: "06:27:25", 22: "06:26:00", 23: "06:24:40", 24: "06:23:20", 25: "06:22:00",
    26: "06:20:50", 27: "06:19:40", 28: "06:18:35", 29: "06:17:25", 30: "06:16:10"
  },
  // אייר (חודש 8)
  8: {
    1: "06:15:05", 2: "06:14:00", 3: "06:12:45", 4: "06:11:35", 5: "06:10:35",
    6: "06:09:30", 7: "06:08:20", 8: "06:07:25", 9: "06:06:30", 10: "06:05:25",
    11: "06:04:25", 12: "06:03:25", 13: "06:02:30", 14: "06:01:35", 15: "06:00:35",
    16: "05:59:40", 17: "05:58:55", 18: "05:58:05", 19: "05:57:05", 20: "05:56:15",
    21: "05:55:25", 22: "05:54:35", 23: "05:53:55", 24: "05:53:00", 25: "05:52:20",
    26: "05:51:45", 27: "05:51:05", 28: "05:50:20", 29: "05:49:45"
  },
  // סיוון (חודש 9)
  9: {
    1: "05:49:20", 2: "05:48:35", 3: "05:48:00", 4: "05:47:25", 5: "05:46:45",
    6: "05:46:05", 7: "05:45:35", 8: "05:44:50", 9: "05:44:20", 10: "05:44:00",
    11: "05:43:45", 12: "05:43:30", 13: "05:42:55", 14: "05:42:35", 15: "05:42:15",
    16: "05:42:05", 17: "05:42:00", 18: "05:41:50", 19: "05:41:45", 20: "05:41:35",
    21: "05:41:25", 22: "05:41:20", 23: "05:41:20", 24: "05:41:15", 25: "05:41:10",
    26: "05:41:10", 27: "05:41:10", 28: "05:41:15", 29: "05:41:15", 30: "05:41:20"
  },
  // תמוז (חודש 10)
  10: {
    1: "05:41:25", 2: "05:41:30", 3: "05:41:40", 4: "05:41:50", 5: "05:42:00",
    6: "05:42:10", 7: "05:42:25", 8: "05:42:40", 9: "05:42:55", 10: "05:43:10",
    11: "05:43:30", 12: "05:43:50", 13: "05:44:10", 14: "05:44:35", 15: "05:44:55",
    16: "05:45:20", 17: "05:45:45", 18: "05:46:10", 19: "05:46:35", 20: "05:47:00",
    21: "05:47:25", 22: "05:47:50", 23: "05:48:20", 24: "05:48:50", 25: "05:49:15",
    26: "05:49:40", 27: "05:50:05", 28: "05:50:45", 29: "05:51:15"
  },
  // אב (חודש 11)
  11: {
    1: "05:51:55", 2: "05:52:35", 3: "05:53:00", 4: "05:53:30", 5: "05:54:05",
    6: "05:54:50", 7: "05:55:35", 8: "05:56:10", 9: "05:57:00", 10: "05:57:45",
    11: "05:58:20", 12: "05:59:05", 13: "05:59:40", 14: "06:00:10", 15: "06:00:50",
    16: "06:01:30", 17: "06:02:05", 18: "06:02:40", 19: "06:03:15", 20: "06:03:55",
    21: "06:04:45", 22: "06:05:15", 23: "06:05:50", 24: "06:06:35", 25: "06:07:15",
    26: "06:07:50", 27: "06:08:30", 28: "06:09:05", 29: "06:09:50", 30: "06:10:25"
  },
  // אלול (חודש 12)
  12: {
    1: "06:11:00", 2: "06:11:40", 3: "06:12:20", 4: "06:13:00", 5: "06:13:35",
    6: "06:14:05", 7: "06:14:45", 8: "06:15:25", 9: "06:15:55", 10: "06:16:40",
    11: "06:17:25", 12: "06:17:55", 13: "06:18:35", 14: "06:19:15", 15: "06:19:50",
    16: "06:20:25", 17: "06:21:05", 18: "06:21:35", 19: "06:22:25", 20: "06:23:05",
    21: "06:23:50", 22: "06:24:35", 23: "06:25:15", 24: "06:26:00", 25: "06:26:35",
    26: "06:27:15", 27: "06:28:00", 28: "06:28:40", 29: "06:29:15"
  }
};

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

  // קבלת זמן הנץ מהטבלה לפי תאריך עברי
  const getNetzTimeFromTable = (date) => {
    try {
      const hDate = hebrewDate(date);
      // בדיקה אם השנה היא תשפ"ו (5786)
      if (hDate.year === 5786 && NETZ_TIMES_5786[hDate.month] && NETZ_TIMES_5786[hDate.month][hDate.date]) {
        const timeStr = NETZ_TIMES_5786[hDate.month][hDate.date];
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        const netz = new Date(date);
        netz.setHours(hours, minutes, seconds || 0, 0);
        return netz;
      }
    } catch (error) {
      console.error("שגיאה בחישוב זמן הנץ מהטבלה:", error);
    }
    // ברירת מחדל: 06:00
    const netz = new Date(date);
    netz.setHours(6, 0, 0, 0);
    return netz;
  };

  // חישוב זמן הנץ הבא לפי הטבלה
  const getNetzTime = () => {
    const now = new Date();
    const todayNetz = getNetzTimeFromTable(now);
    
    // אם כבר עברנו את הנץ של היום, נחזיר את הנץ של מחר
    if (now >= todayNetz) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return getNetzTimeFromTable(tomorrow);
    }
    
    return todayNetz;
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

  // קבלת זמן הנץ הנוכחי לפורמט תצוגה (מדויק מהטבלה)
  const getCurrentNetzTimeDisplay = () => {
    try {
      const now = new Date();
      const hDate = hebrewDate(now);
      
      // בדיקה אם השנה היא תשפ"ו (5786) ויש זמן בטבלה
      if (hDate.year === 5786 && NETZ_TIMES_5786[hDate.month] && NETZ_TIMES_5786[hDate.month][hDate.date]) {
        const timeStr = NETZ_TIMES_5786[hDate.month][hDate.date];
        // אם כבר עברנו את הנץ של היום, נציג את הנץ של מחר
        const todayNetz = getNetzTimeFromTable(now);
        if (now >= todayNetz) {
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowHDate = hebrewDate(tomorrow);
          if (tomorrowHDate.year === 5786 && NETZ_TIMES_5786[tomorrowHDate.month] && NETZ_TIMES_5786[tomorrowHDate.month][tomorrowHDate.date]) {
            return NETZ_TIMES_5786[tomorrowHDate.month][tomorrowHDate.date];
          }
        }
        return timeStr;
      }
    } catch (error) {
      console.error("שגיאה בקבלת זמן הנץ מהטבלה:", error);
    }
    // ברירת מחדל: 06:00:00
    return "06:00:00";
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
                <div dir="ltr" className="flex items-center justify-center gap-[clamp(0.35rem,3vw,1.1rem)] sm:gap-[clamp(0.7rem,4vw,1.8rem)] mb-[clamp(0.45rem,3.5vw,1.6rem)]">
                  {/* שעות */}
                  <div className="flex flex-col items-center gap-[clamp(0.25rem,1.6vw,0.6rem)]">
                    <motion.div
                      dir="ltr"
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
                      dir="ltr"
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
                      dir="ltr"
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
                  dir="ltr"
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
            dir="ltr"
            className="font-mono text-[min(4.3vw,3.8vh,2.2rem)] md:text-[min(4.5vw,4vh,3rem)] text-amber-200/90 font-light"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {getCurrentNetzTimeDisplay()}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}