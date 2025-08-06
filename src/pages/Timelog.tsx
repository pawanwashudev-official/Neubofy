import React, { useState, useRef, useEffect } from "react";

const GAS_URL = "https://script.google.com/macros/s/AKfycbwydOEN0v2MOtzSriKSG3i3SZ0awPHmYJ9tf5GGhmX_RxkfaqMoLiWx8Yx1B5d79g-KtA/exec";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${pad(m)}:${pad(s)}`;
}

async function logSession(minutes: number) {
  try {
    const response = await fetch(`${GAS_URL}?minutes=${minutes}`);
    const text = await response.text();
    return text;
  } catch (error) {
    return "Failed to log session: " + error;
  }
}

// --- Persistent Stopwatch ---
function usePersistentStopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [lastStart, setLastStart] = useState<number | null>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("timelog_stopwatch");
    if (saved) {
      const { seconds, running, lastStart } = JSON.parse(saved);
      setSeconds(seconds);
      setRunning(running);
      setLastStart(lastStart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "timelog_stopwatch",
      JSON.stringify({ seconds, running, lastStart })
    );
  }, [seconds, running, lastStart]);

  useEffect(() => {
    if (running) {
      if (lastStart === null) setLastStart(Date.now());
      interval.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (interval.current) {
      clearInterval(interval.current);
      if (lastStart !== null) setLastStart(null);
    }
    return () => interval.current && clearInterval(interval.current);
  }, [running]);

  useEffect(() => {
    if (running && lastStart) {
      const elapsed = Math.floor((Date.now() - lastStart) / 1000);
      setSeconds((s) => s + elapsed);
      setLastStart(Date.now());
    }
    // eslint-disable-next-line
  }, []);

  const start = () => {
    if (!running) {
      setRunning(true);
      setLastStart(Date.now());
    }
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setLastStart(null);
  };

  return { seconds, running, start, pause, reset, setSeconds };
}

// --- Persistent Pomodoro ---
function usePersistentPomodoro() {
  const WORK = 25 * 60;
  const BREAK = 5 * 60;
  const [mode, setMode] = useState<"work" | "break">("work");
  const [seconds, setSeconds] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [lastStart, setLastStart] = useState<number | null>(null);
  const [cycles, setCycles] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("timelog_pomodoro");
    if (saved) {
      const { mode, seconds, running, lastStart, cycles } = JSON.parse(saved);
      setMode(mode);
      setSeconds(seconds);
      setRunning(running);
      setLastStart(lastStart);
      setCycles(cycles);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "timelog_pomodoro",
      JSON.stringify({ mode, seconds, running, lastStart, cycles })
    );
  }, [mode, seconds, running, lastStart, cycles]);

  useEffect(() => {
    if (running) {
      if (lastStart === null) setLastStart(Date.now());
      interval.current = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (interval.current) {
      clearInterval(interval.current);
      if (lastStart !== null) setLastStart(null);
    }
    return () => interval.current && clearInterval(interval.current);
  }, [running]);

  useEffect(() => {
    if (running && lastStart) {
      const elapsed = Math.floor((Date.now() - lastStart) / 1000);
      setSeconds((s) => Math.max(s - elapsed, 0));
      setLastStart(Date.now());
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (running && seconds === 0) {
      if (mode === "work") {
        setMode("break");
        setSeconds(BREAK);
        setCycles((c) => c + 1);
      } else {
        setMode("work");
        setSeconds(WORK);
      }
    }
    // eslint-disable-next-line
  }, [seconds, running, mode]);

  const start = () => {
    if (!running) {
      setRunning(true);
      setLastStart(Date.now());
    }
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setMode("work");
    setSeconds(WORK);
    setLastStart(null);
    setCycles(0);
  };

  return { mode, seconds, running, start, pause, reset, setSeconds, setMode, cycles };
}

function CircularClock({ seconds, totalSeconds, color, children }: { seconds: number; totalSeconds?: number; color: string; children?: React.ReactNode }) {
  // If totalSeconds is not provided, show a full ring (for stopwatch)
  const progress = totalSeconds ? Math.min(seconds / totalSeconds, 1) : 1;
  const size = 200;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - progress);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute top-0 left-0">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e7ef"
          strokeWidth={stroke}
          fill="url(#clockBg)"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(.4,2,.6,1)' }}
          filter="url(#glow)"
        />
        <defs>
          <radialGradient id="clockBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e0e7ef" stopOpacity="0.7" />
          </radialGradient>
          <filter id="glow">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.4" />
          </filter>
        </defs>
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center select-none">
        {children}
      </div>
    </div>
  );
}

function Stopwatch({ onSubmit }: { onSubmit: (minutes: number) => void }) {
  const { seconds, running, start, pause, reset } = usePersistentStopwatch();

  const handleSubmit = () => {
    if (seconds < 60) {
      alert("Please record at least 1 minute.");
      return;
    }
    onSubmit(Math.floor(seconds / 60));
    reset();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <CircularClock seconds={seconds} color="#6366f1">
        <div className="text-6xl sm:text-7xl font-mono text-indigo-600 dark:text-indigo-300 drop-shadow-lg" style={{ letterSpacing: '0.05em' }}>{formatTime(seconds)}</div>
        <div className="text-xs text-gray-500 mt-1">Stopwatch</div>
      </CircularClock>
      <div className="flex gap-3 w-full justify-center">
        {running ? (
          <button className="btn-timer bg-yellow-400 hover:bg-yellow-500" onClick={pause}>Pause</button>
        ) : (
          <button className="btn-timer bg-green-500 hover:bg-green-600" onClick={start}>{seconds === 0 ? "Start" : "Resume"}</button>
        )}
        <button className="btn-timer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={reset} disabled={seconds === 0}>Reset</button>
        <button className="btn-timer bg-indigo-500 hover:bg-indigo-600" onClick={handleSubmit} disabled={seconds < 60}>Submit</button>
      </div>
      <div className="text-xs text-gray-500 mt-2">* Only full minutes are logged</div>
    </div>
  );
}

function Pomodoro({ onSubmit }: { onSubmit: (minutes: number) => void }) {
  const WORK = 25 * 60;
  const { mode, seconds, running, start, pause, reset, setSeconds, setMode, cycles } = usePersistentPomodoro();

  const handleManualSubmit = () => {
    if (mode === "work" && seconds < WORK) {
      const mins = Math.floor((WORK - seconds) / 60);
      if (mins > 0) onSubmit(mins);
    }
    reset();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <CircularClock
        seconds={mode === "work" ? WORK - seconds : 5 * 60 - seconds}
        totalSeconds={mode === "work" ? WORK : 5 * 60}
        color={mode === "work" ? "#ef4444" : "#22c55e"}
      >
        <div className={`text-6xl sm:text-7xl font-mono drop-shadow-lg ${mode === "work" ? "text-red-500" : "text-green-500"}`} style={{ letterSpacing: '0.05em' }}>{formatTime(seconds)}</div>
        <div className="text-xs text-gray-500 mt-1">{mode === "work" ? "Work" : "Break"} Session</div>
      </CircularClock>
      <div className="flex gap-3 w-full justify-center">
        {running ? (
          <button className="btn-timer bg-yellow-400 hover:bg-yellow-500" onClick={pause}>Pause</button>
        ) : (
          <button className="btn-timer bg-green-500 hover:bg-green-600" onClick={start}>{seconds === (mode === "work" ? WORK : 5 * 60) ? "Start" : "Resume"}</button>
        )}
        <button className="btn-timer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={reset}>Reset</button>
        <button className="btn-timer bg-indigo-500 hover:bg-indigo-600" onClick={handleManualSubmit} disabled={mode !== "work" || seconds === WORK}>Submit</button>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">* Work session auto-logs 25 min on finish. You can submit partial work minutes manually.</div>
      <div className="mt-2 text-sm text-gray-400">Completed Pomodoros: <span className="font-bold text-indigo-600">{cycles}</span></div>
    </div>
  );
}

export default function Timelog() {
  const [tab, setTab] = useState<"stopwatch" | "pomodoro">("stopwatch");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (minutes: number) => {
    setMessage("Logging...");
    const res = await logSession(minutes);
    setMessage(res);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-2 sm:p-4 relative">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col items-center">
        <div className="flex justify-center mb-8 w-full">
          <button
            className={`tab-btn rounded-l-xl ${tab === "stopwatch" ? "tab-btn-active" : ""}`}
            onClick={() => setTab("stopwatch")}
          >
            Stopwatch
          </button>
          <button
            className={`tab-btn rounded-r-xl ${tab === "pomodoro" ? "tab-btn-active" : ""}`}
            onClick={() => setTab("pomodoro")}
          >
            Pomodoro
          </button>
        </div>
        <div className="w-full">
          {tab === "stopwatch" ? (
            <Stopwatch onSubmit={handleSubmit} />
          ) : (
            <Pomodoro onSubmit={handleSubmit} />
          )}
        </div>
        {message && (
          <div className="mt-6 text-center text-sm font-medium text-indigo-700 dark:text-indigo-300 animate-pulse">{message}</div>
        )}
      </div>
      {/* Tailwind custom styles for buttons */}
      <style>{`
        .btn-timer {
          @apply px-4 py-2 rounded-lg font-semibold shadow transition w-24 text-center text-white;
        }
        .tab-btn {
          @apply px-6 py-2 font-semibold transition border border-indigo-300 dark:border-indigo-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-1/2;
        }
        .tab-btn-active {
          @apply bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg;
        }
      `}</style>
    </div>
  );
} 