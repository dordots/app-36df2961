import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hebrewDate from "hebrew-date";

// טבלת זמני הנץ החמה המישורי (לוח "צלותיה דאברהם") לשנת תשפ"ו למושב רווחה
const NETZ_TIMES_5786 = {
  // תשרי (חודש 1)
  1: {
    1: "06:30:15", 2: "06:30:50", 3: "06:31:25", 4: "06:32:05", 5: "06:32:40",
    6: "06:33:20", 7: "06:33:55", 8: "06:34:35", 9: "06:35:10", 10: "06:35:45",
    11: "06:36:25", 12: "06:37:05", 13: "06:37:45", 14: "06:38:25", 15: "06:39:05",
    16: "06:39:45", 17: "06:40:25", 18: "06:41:05", 19: "06:41:45", 20: "06:42:25",
    21: "06:43:10", 22: "06:43:50", 23: "06:44:30", 24: "06:45:15", 25: "06:46:00",
    26: "06:46:40", 27: "06:47:25", 28: "06:48:10", 29: "06:48:55", 30: "06:49:40"
  },
  // מרחשון (חודש 2)
  2: {
    1: "06:50:25", 2: "06:51:10", 3: "06:52:00", 4: "05:52:30", 5: "05:53:15",
    6: "05:54:05", 7: "05:54:55", 8: "05:55:40", 9: "05:56:30", 10: "05:57:15",
    11: "05:58:05", 12: "05:58:55", 13: "05:59:45", 14: "06:00:35", 15: "06:01:25",
    16: "06:02:15", 17: "06:03:05", 18: "06:04:00", 19: "06:04:50", 20: "06:05:40",
    21: "06:06:35", 22: "06:07:25", 23: "06:08:20", 24: "06:09:10", 25: "06:10:05",
    26: "06:10:55", 27: "06:11:50", 28: "06:12:40", 29: "06:13:35"
  },
  // כסלו (חודש 3)
  3: {
    1: "06:14:25", 2: "06:15:20", 3: "06:16:10", 4: "06:17:05", 5: "06:17:55",
    6: "06:18:45", 7: "06:19:40", 8: "06:20:30", 9: "06:21:20", 10: "06:22:10",
    11: "06:22:55", 12: "06:23:45", 13: "06:24:30", 14: "06:25:20", 15: "06:26:05",
    16: "06:26:55", 17: "06:27:40", 18: "06:28:25", 19: "06:29:10", 20: "06:29:50",
    21: "06:30:35", 22: "06:31:15", 23: "06:31:55", 24: "06:32:35", 25: "06:33:15",
    26: "06:33:50", 27: "06:34:30", 28: "06:35:05", 29: "06:35:35", 30: "06:36:10"
  },
  // טבת (חודש 4)
  4: {
    1: "06:36:40", 2: "06:37:10", 3: "06:37:40", 4: "06:38:05", 5: "06:38:30",
    6: "06:38:55", 7: "06:39:15", 8: "06:39:40", 9: "06:39:55", 10: "06:40:15",
    11: "06:40:30", 12: "06:40:45", 13: "06:40:55", 14: "06:41:10", 15: "06:41:20",
    16: "06:41:25", 17: "06:41:30", 18: "06:41:35", 19: "06:41:40", 20: "06:41:40",
    21: "06:41:40", 22: "06:41:35", 23: "06:41:30", 24: "06:41:25", 25: "06:41:15",
    26: "06:41:05", 27: "06:40:55", 28: "06:40:40", 29: "06:40:25"
  },
  // שבט (חודש 5)
  5: {
    1: "06:40:10", 2: "06:39:50", 3: "06:39:30", 4: "06:39:10", 5: "06:38:45",
    6: "06:38:20", 7: "06:37:55", 8: "06:37:25", 9: "06:36:55", 10: "06:36:25",
    11: "06:35:50", 12: "06:35:20", 13: "06:34:40", 14: "06:34:05", 15: "06:33:25",
    16: "06:32:45", 17: "06:32:05", 18: "06:31:20", 19: "06:30:35", 20: "06:29:50",
    21: "06:29:00", 22: "06:28:15", 23: "06:27:25", 24: "06:26:30", 25: "06:25:40",
    26: "06:24:45", 27: "06:23:50", 28: "06:22:55", 29: "06:22:15", 30: "06:21:15"
  },
  // אדר (חודש 6)
  6: {
    1: "06:20:15", 2: "06:19:15", 3: "06:18:15", 4: "06:17:15", 5: "06:16:10",
    6: "06:15:05", 7: "06:14:00", 8: "06:12:55", 9: "06:11:50", 10: "06:10:45",
    11: "06:09:35", 12: "06:08:30", 13: "06:07:20", 14: "06:06:10", 15: "06:05:00",
    16: "06:03:50", 17: "06:02:40", 18: "06:01:25", 19: "06:00:15", 20: "05:59:00",
    21: "05:57:45", 22: "05:56:35", 23: "05:55:20", 24: "05:54:05", 25: "05:52:50",
    26: "05:51:35", 27: "05:50:20", 28: "05:49:05", 29: "05:47:50"
  },
  // ניסן (חודש 7)
  7: {
    1: "05:46:35", 2: "05:45:15", 3: "05:44:00", 4: "05:42:45", 5: "05:41:30",
    6: "05:40:10", 7: "05:38:55", 8: "05:37:40", 9: "06:36:20", 10: "06:35:05",
    11: "06:33:50", 12: "06:32:35", 13: "06:31:20", 14: "06:30:10", 15: "06:28:50",
    16: "06:27:35", 17: "06:26:25", 18: "06:25:10", 19: "06:23:55", 20: "06:22:40",
    21: "06:21:25", 22: "06:20:15", 23: "06:19:00", 24: "06:17:50", 25: "06:16:40",
    26: "06:15:25", 27: "06:14:15", 28: "06:13:05", 29: "06:11:55", 30: "06:10:50"
  },
  // אייר (חודש 8)
  8: {
    1: "06:09:40", 2: "06:08:35", 3: "06:07:25", 4: "06:06:20", 5: "06:05:15",
    6: "06:04:10", 7: "06:03:10", 8: "06:02:05", 9: "06:01:05", 10: "06:00:05",
    11: "05:59:05", 12: "05:58:05", 13: "05:57:10", 14: "05:56:15", 15: "05:55:20",
    16: "05:54:25", 17: "05:53:30", 18: "05:52:40", 19: "05:51:45", 20: "05:50:55",
    21: "05:50:05", 22: "05:49:20", 23: "05:48:30", 24: "05:47:45", 25: "05:47:05",
    26: "05:46:20", 27: "05:45:40", 28: "05:45:00", 29: "05:44:20"
  },
  // סיון (חודש 9)
  9: {
    1: "05:43:40", 2: "05:43:05", 3: "05:42:30", 4: "05:41:55", 5: "05:41:25",
    6: "05:40:55", 7: "05:40:25", 8: "05:39:55", 9: "05:39:30", 10: "05:39:05",
    11: "05:38:40", 12: "05:38:20", 13: "05:38:00", 14: "05:37:40", 15: "05:37:25",
    16: "05:37:10", 17: "05:36:55", 18: "05:36:40", 19: "05:36:30", 20: "05:36:20",
    21: "05:36:10", 22: "05:36:05", 23: "05:36:00", 24: "05:35:55", 25: "05:35:50",
    26: "05:35:50", 27: "05:35:50", 28: "05:35:50", 29: "05:35:55", 30: "05:36:00"
  },
  // תמוז (חודש 10)
  10: {
    1: "05:36:05", 2: "05:36:10", 3: "05:36:20", 4: "05:36:30", 5: "05:36:40",
    6: "05:36:50", 7: "05:37:05", 8: "05:37:20", 9: "05:37:35", 10: "05:37:55",
    11: "05:38:10", 12: "05:38:30", 13: "05:38:50", 14: "05:39:10", 15: "05:39:35",
    16: "05:40:00", 17: "05:40:25", 18: "05:40:50", 19: "05:41:15", 20: "05:41:40",
    21: "05:42:10", 22: "05:42:40", 23: "05:43:10", 24: "05:43:40", 25: "05:44:10",
    26: "05:44:40", 27: "05:45:15", 28: "05:45:45", 29: "05:46:20"
  },
  // אב (חודש 11)
  11: {
    1: "05:46:55", 2: "05:47:25", 3: "05:48:00", 4: "05:48:40", 5: "05:49:15",
    6: "05:49:50", 7: "05:50:25", 8: "05:51:05", 9: "05:51:40", 10: "05:52:15",
    11: "05:52:55", 12: "05:53:30", 13: "05:54:10", 14: "05:54:50", 15: "05:55:25",
    16: "05:56:05", 17: "05:56:45", 18: "05:57:25", 19: "05:58:00", 20: "05:58:40",
    21: "05:59:20", 22: "06:00:00", 23: "06:00:35", 24: "06:01:15", 25: "06:01:55",
    26: "06:02:35", 27: "06:03:10", 28: "06:03:50", 29: "06:04:30", 30: "06:05:05"
  },
  // אלול (חודש 12)
  12: {
    1: "06:05:45", 2: "06:06:25", 3: "06:07:00", 4: "06:07:40", 5: "06:08:20",
    6: "06:08:55", 7: "06:09:35", 8: "06:10:10", 9: "06:10:50", 10: "06:11:25",
    11: "06:12:05", 12: "06:12:40", 13: "06:13:15", 14: "06:13:55", 15: "06:14:30",
    16: "06:15:05", 17: "06:15:45", 18: "06:16:20", 19: "06:16:55", 20: "06:17:30",
    21: "06:18:05", 22: "06:18:45", 23: "06:19:20", 24: "06:19:55", 25: "06:20:30",
    26: "06:21:05", 27: "06:21:40", 28: "06:22:20", 29: "06:22:55"
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

  // אפקט להצגת הודעת נץ ברגע שהזמן מגיע לאפס
  useEffect(() => {
    if (!showNetzMessage && hours === 0 && minutes === 0 && seconds === 0) {
      setShowNetzMessage(true);
    }
  }, [hours, minutes, seconds, showNetzMessage]);

  // אפקט לסגירת הודעת הנץ אחרי 10 שניות
  useEffect(() => {
    if (!showNetzMessage) return;

    const timeout = setTimeout(() => {
      setShowNetzMessage(false);
    }, 10000); // 10 שניות אחרי הצגת ההודעה נסגור אותה

    return () => clearTimeout(timeout);
  }, [showNetzMessage]);

  const numberSizeClasses =
    "text-[min(32vw,25vh,16rem)] md:text-[min(18vw,18vh,14rem)] font-semibold drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]";

  const colonSizeClasses = "text-[clamp(3.5rem,12vw,8rem)] text-slate-100/80";

  const labelSizeClasses =
    "text-[clamp(1rem,3.2vw,2rem)] md:text-[clamp(1.1rem,2.4vw,2.3rem)] tracking-[0.12em]";

  const millisecondsSizeClasses =
    "text-[min(14vw,12vh,6.5rem)] md:text-[min(10vw,10vh,5.2rem)]";

  const millisecondsLabelClasses =
    "text-[clamp(1rem,2vw,1.8rem)] text-slate-200/80";

  const countdownGapClasses =
    "gap-[clamp(0.8rem,6vw,2.8rem)] sm:gap-[clamp(1rem,7vw,3.2rem)] mb-[clamp(0.6rem,4vw,2.4rem)]";

  return (
    <div
      className="min-h-[100dvh] w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-3 sm:px-6 py-4 md:py-6 relative"
    >
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
      <div className="relative z-10 w-full max-w-[min(98vw,1400px)] mx-auto flex flex-col items-center justify-center gap-[clamp(0.5rem,3.2vw,1.5rem)] text-balance px-1 sm:px-2 py-2 sm:py-3 overflow-y-auto">
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
                  <h2 className="text-[clamp(3.5rem,10vw,7rem)] md:text-[clamp(4.5rem,12vw,9rem)] font-semibold text-amber-200 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] mb-8 tracking-wide">
                    ✨ הנץ החמה הגיע! ✨
                  </h2>
                  <p className="text-[clamp(1.6rem,5vw,3.2rem)] md:text-[clamp(2rem,6vw,4rem)] text-slate-100/90 font-light tracking-[0.12em]">
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
                <div
                  dir="ltr"
                  className={`flex items-center justify-center ${countdownGapClasses}`}
                >
                  {/* שעות */}
                  <div className="flex flex-col items-center gap-[clamp(0.25rem,1.6vw,0.6rem)]">
                    <motion.div
                      dir="ltr"
                      className={`font-mono text-white tracking-tight leading-none ${numberSizeClasses}`}
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
                    <span
                      className={`${labelSizeClasses} text-slate-200/80 font-light uppercase`}
                    >
                      שעות
                    </span>
                  </div>

                  <span className={`${colonSizeClasses} font-semibold`}>
                    :
                  </span>

                  {/* דקות */}
                  <div className="flex flex-col items-center gap-[clamp(0.25rem,1.6vw,0.6rem)]">
                    <motion.div
                      dir="ltr"
                      className={`font-mono text-white tracking-tight leading-none ${numberSizeClasses}`}
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
                    <span
                      className={`${labelSizeClasses} text-slate-200/80 font-light uppercase`}
                    >
                      דקות
                    </span>
                  </div>

                  <span className={`${colonSizeClasses} font-semibold`}>
                    :
                  </span>

                  {/* שניות */}
                  <div className="flex flex-col items-center gap-[clamp(0.25rem,1.6vw,0.6rem)]">
                    <motion.div
                      dir="ltr"
                      className={`font-mono text-white tracking-tight leading-none ${numberSizeClasses}`}
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
                    <span
                      className={`${labelSizeClasses} text-slate-200/80 font-light uppercase`}
                    >
                      שניות
                    </span>
                  </div>
                </div>

                {/* מאיות שנייה - קטנות יותר */}
                <motion.div
                  dir="ltr"
                  className="text-center mt-[clamp(0.15rem,1.2vw,0.5rem)]"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span
                    className={`font-mono text-slate-200/80 font-semibold ${millisecondsSizeClasses}`}
                  >
                    {formatNumber(milliseconds)}
                  </span>
                  <span className={`${millisecondsLabelClasses} mr-3 font-light uppercase`}>
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