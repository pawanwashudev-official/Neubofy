
import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const GAS_API = "https://script.google.com/macros/s/AKfycbzGxTnCPckmyq1a8NkM-XOUtVSszv3BH1eThoDrcVLD-SYyI50ugVih_NLYep_xDyg/exec";
const thresholds = [120, 180, 240, 300], colors = ["#34d399", "#38bdf8", "#c084fc", "#f472b6"];
function pad(n: number) { return n < 10 ? "0" + n : n; }
function formatTime(sec: number) { let m = Math.floor(sec / 60), s = sec % 60; return `${pad(m)}:${pad(s)}`; }
async function gasFetch(action: string, extra?: any) {
  let url = `${GAS_API}?action=${action}`;
  if (action === "addManual" && extra) { url += `&minutes=${encodeURIComponent(extra)}`; }
  try {
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) throw new Error(`API error: ${resp.status}`);
    return await resp.json();
  } catch (err: any) {
    throw new Error(err?.message || 'Network/API error');
  }
}

const Modal = ({ open, onClose, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 modal-bg" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">{children}</div>
    </div>
  );
};

const TodaySessionModal = ({ open, sessions, onClose }: any) => {
  const pastel = colors;
  const tot = sessions.reduce((a: number, s: any) => a + Number(s.minutes), 0);
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl mb-2 font-bold text-teal-300">Today's Sessions</h2>
      <ul className="mb-3 text-cyan-100 font-mono">
        {sessions.length
          ? sessions.map((s: any, i: number) => (
            <li key={i}>
              <span style={{ color: pastel[i % pastel.length] }}>{s.minutes} min</span>
              {i > 0 && <span className="text-zinc-300"> +</span>}
            </li>
          ))
          : <li className="italic">No sessions yet</li>}
      </ul>
      <div className="font-black text-lg mt-1">Total: {tot} min</div>
    </Modal>
  );
};

const Last7GraphModal = ({ open, history, onClose }: any) => {
  const pastel = colors;
  const chartRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (open && history.length && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if ((chartRef.current as any)._myChart) (chartRef.current as any)._myChart.destroy();
      (chartRef.current as any)._myChart = new Chart(ctx!, {
        type: 'bar',
        data: {
          labels: history.map((d: any) => d.date.slice(5)),
          datasets: [{
            data: history.map((d: any) => d.total),
            backgroundColor: history.map((_: any, i: number) => pastel[i % pastel.length % 4]),
            borderRadius: 10, borderSkipped: false, barPercentage: .91
          }]
        },
        options: {
          responsive: true, animation: { duration: 900 },
          plugins: { legend: { display: false }, title: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { color: "#bae6fd", font: { weight: 'bold' } } },
            x: { ticks: { color: "#3b82f6", font: { weight: 'bold' } } }
          }
        }
      });
    }
  }, [open, history]);
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-3 text-indigo-300">Last 7 Days Study Graph</h2>
      <canvas ref={chartRef} width={540} height={208} style={{ background: '#1e293b22', borderRadius: 13 }} />
    </Modal>
  );
};

const Spinner = ({ show }: { show: boolean }) => show ? (
  <div className="fixed inset-0 z-50 flex justify-center items-center" style={{ background: "rgba(38,38,48,0.23)" }}>
    <div className="spinner border-t-sky-300" />
  </div>
) : null;

const StopwatchCard = ({ timerState, refresh, sessions, setMsg, setLoading }: any) => {
  const [elapsed, setElapsed] = useState(0), [input, setInput] = useState(''), [pauseSec, setPauseSec] = useState(0);
  useEffect(() => {
    let t: any = null;
    if (timerState.running && !timerState.paused && timerState.startTime)
      t = setInterval(() => setElapsed(Math.floor((Date.now() - timerState.startTime) / 1000)), 1000);
    else if (timerState.running && timerState.paused && timerState.pauseStart)
      setElapsed(Math.floor((timerState.pauseStart - timerState.startTime) / 1000));
    else setElapsed(0); return () => t && clearInterval(t);
  }, [timerState]);
  useEffect(() => {
    let p: any = null;
    if (timerState.paused && timerState.pauseExpiry) {
      setPauseSec(Math.max(0, Math.floor((timerState.pauseExpiry - Date.now()) / 1000)));
      p = setInterval(() => setPauseSec(Math.max(0, Math.floor((timerState.pauseExpiry - Date.now()) / 1000))), 260);
    }
    return () => p && clearInterval(p);
  }, [timerState.paused, timerState.pauseExpiry]);
  const doAct = async (a: string) => {
    setLoading(true);
    await gasFetch(a);
    await refresh();
    setLoading(false);
    setMsg(a.charAt(0).toUpperCase() + a.slice(1));
  };
  const addManualSession = async () => {
    const minutes = parseInt(input);
    if (isNaN(minutes) || minutes < 1) return;
    setLoading(true);
    await gasFetch("addManual", minutes);
    setMsg(`Added ${minutes} min!`); setInput('');
    await refresh(); setLoading(false);
  };
  const maxTime = 300, progress = Math.max(0, Math.min(1, elapsed / (maxTime * 60)));
  let bandIdx = thresholds.findIndex((t, i) => elapsed < ((thresholds[i]) || 301) * 60);
  if (bandIdx < 0) bandIdx = thresholds.length - 1; let ringColor = colors[bandIdx];
  return (
    <div className="w-full flex flex-col items-center">
      <div className="circular-dial" style={{ marginTop: "-13px", marginBottom: "6px" }}>
        <svg width="100%" height="100%" viewBox="0 0 240 240" style={{ display: "block" }}>
          {thresholds.map((limit, i) => {
            const prevAngle = (i === 0) ? 0 : (thresholds[i - 1] / maxTime) * 360;
            const thisAngle = Math.min((Math.min(elapsed / 60, limit) / maxTime) * 360, limit / maxTime * 360);
            const radius = 96, thicc = 16;
            if (thisAngle <= prevAngle) return null;
            const angleRads = (a: number) => (a - 90) * (Math.PI / 180);
            const x1 = 120 + radius * Math.cos(angleRads(prevAngle));
            const y1 = 120 + radius * Math.sin(angleRads(prevAngle));
            const x2 = 120 + radius * Math.cos(angleRads(thisAngle));
            const y2 = 120 + radius * Math.sin(angleRads(thisAngle));
            const bigArc = (thisAngle - prevAngle) > 180 ? 1 : 0;
            return (
              <path
                key={i}
                d={`M${x1},${y1} A${radius},${radius} 0 ${bigArc} 1 ${x2},${y2}`}
                fill="none"
                stroke={colors[i]}
                strokeWidth={thicc}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={120} cy={120} r={96} fill="none" stroke="#33415536" strokeWidth={17} />
        </svg>
        <div className="needle" style={{ ['--needle' as any]: ringColor, transform: `rotate(${progress * 360}deg) translate(-50%, -100%) scale(1.062)` }} />
        <div className="dial-center w-full h-full">
          <span className="clock-time">{formatTime(elapsed)}</span>
        </div>
      </div>
      <div className="flex gap-2 justify-center mt-1 w-full flex-wrap mb-1">
        {!timerState.running ? (
          <button onClick={() => doAct('startTimer')} className="cta-btn emerald-btn btn-anim w-40 mb-1">Start</button>
        ) : timerState.paused ? ([
          <button key="resume" onClick={() => doAct('resumeTimer')} className="cta-btn emerald-btn btn-anim ml-0 w-40 animate-bounce mb-1">▶ Resume</button>,
          <span key="pause" className="font-bold text-yellow-200 text-lg animate-pulse ml-3 mb-1">{pauseSec + "s left"}</span>,
          <button key="stop" onClick={() => doAct('stopTimer')} className="cta-btn pink-btn btn-anim ml-2 w-38 mb-1">Stop & Log</button>
        ]) : ([
          <button key="pause" onClick={() => doAct('pauseTimer')} className="cta-btn yellow-btn btn-anim w-40 mb-1">⏸ Pause</button>,
          <button key="stop" onClick={() => doAct('stopTimer')} className="cta-btn pink-btn btn-anim ml-2 w-38 mb-1">Stop & Log</button>,
          <button key="reset" onClick={() => doAct('resetTimer')} className="cta-btn slate-btn btn-anim ml-2 w-34 mb-1">Reset</button>
        ])}
      </div>
      <div className="flex gap-2 items-center mt-3 mb-2 w-full">
        <input type="number" value={input} onChange={e => setInput(e.target.value)} placeholder="Add missed min" className="p-4 rounded bg-slate-50 text-black border w-full focus:outline-none focus:ring-2 ring-cyan-200 text-base" />
        <button onClick={addManualSession} className="bg-gradient-to-bl from-pink-400 to-fuchsia-400 px-5 py-3 rounded text-white font-bold btn-anim focus:ring-2 ring-pink-200 text-xl transition">+ Add</button>
      </div>
    </div>
  );
};

const TimelogWidget = () => {
  const [timerState, setTimerState] = useState<any>({ running: false, startTime: null, paused: false, pauseStart: null, pauseExpiry: null });
  const [sessions, setSessions] = useState<any[]>([]), [days, setDays] = useState<any[]>([]);
  const [showToday, setShowToday] = useState(false), [show7, setShow7] = useState(false), [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);


  const reloadAll = async () => {
    setLoading(true);
    try {
      setTimerState(await gasFetch("getTimerState"));
      const s = await gasFetch("getTodaySessions"); setSessions(s.sessions || []);
      const d = await gasFetch("getLast7Days"); setDays(d.days || []);
    } catch (err: any) {
      setMsg("Failed to load data: " + err.message);
    }
    setLoading(false);
  };
  useEffect(() => { reloadAll(); }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: 'inherit' }}>
      <style>{`
        html,body{margin:0;padding:0;width:100vw;height:100vh;}
        body{font-family:'Montserrat','Inter',sans-serif;background:linear-gradient(120deg,#2dd4bf 0%,#60a5fa 60%,#a78bfa 100%);color:#f1f5f9;width:100vw;height:100vh;overflow:hidden;}
        #root {width:100vw; height:100vh;}
        .top-icons{width:100vw;position:fixed;top:0;left:0;display:flex;justify-content:space-between;align-items:center;z-index:50;padding:2vw 2vw 0.4vw 2vw;pointer-events:none;}
        .corner-btn{pointer-events:all;width:54px;height:54px;border-radius:50%;background:rgba(24,38,54,0.98);color:#34d399;border:3px solid #67e8f9;box-shadow:0 3px 22px #38bdf888;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:2rem;font-weight:900;transition:.15s;margin:0 3px;}
        .corner-btn:hover{background:rgba(21,94,189,0.98);color:#c084fc;border-color:#f472b6;}
        .modal-bg {background:rgba(8,16,32,0.62);}
        .modal-card{background:#142446;border-radius:1.12rem;box-shadow:0 14px 40px #38bdf877;padding:2.1rem 1.68rem;min-width:312px;border:2px solid #7dd3fc44;}
        .stopwatch-full-bg{width:100vw; height:100vh; display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;padding-top:60px;}
        .circular-dial{position:relative;width:min(75vw,480px);height:min(75vw,480px);min-width:230px;min-height:230px;margin:0 auto 1.7rem auto;}
        .dial-center{position:absolute;left:0;top:0;right:0;bottom:0;display:flex;justify-content:center;align-items:center;}
        .clock-time{font-size:clamp(2.5rem,8vw,4.2rem);font-weight:900;letter-spacing:.09em;color:#fffdfa;text-shadow:0 3px 27px #0ea5e91e;font-family:'JetBrains Mono',monospace;z-index:10;background:rgba(23,84,175,0.08);padding:0.19em 1em;border-radius:22px;}
        .needle{position:absolute;left:50%;top:50%;width:5px;height:40%;transform-origin:50% 87%;background:linear-gradient(180deg,#f9fafb 13%,var(--needle) 94%);z-index:9;border-radius:8px;box-shadow:0 5px 20px #0007;}
        .btn-anim{transition:.15s;}
        .btn-anim:active{transform:scale(.97);}
        .cta-btn{padding:.93em 2.28em;font-size:1.21rem;font-weight:900;border-radius:1.75em;box-shadow:0 3px 18px #2563eb15;border:none;margin-bottom:0.5em;}
        .emerald-btn{background:linear-gradient(91deg,#34d399 15%,#38bdf8 88%);color:#134e4a;}
        .yellow-btn{background:linear-gradient(91deg,#fde68a 10%,#fbbf24 90%);color:#92400e;}
        .slate-btn{background:linear-gradient(98deg,#64748b 18%,#334155 80%);}
        .pink-btn{background:linear-gradient(93deg,#f472b6 70%,#c084fc 99%);color:#fff;}
        .spinner{border:7px solid #bae6fd;border-radius:50%;border-top:7px solid #38bdf8;width:54px;height:54px;animation:spin 1s linear infinite;}
        @keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
        @media (max-width:700px){.top-icons{padding-top:2vw;}.circular-dial{min-width:150px;min-height:150px;}.stopwatch-full-bg{padding-top:46px;}}
      `}</style>
      <div className="top-icons">
        <button className="corner-btn" onClick={() => setShowToday(true)} title="Today's Sessions"><span>📅</span></button>
        <button className="corner-btn" onClick={() => setShow7(true)} title="Last 7 Days"><span>📊</span></button>
      </div>
      <div className="stopwatch-full-bg">
        <Spinner show={loading} />
        {!loading && !msg.startsWith('Failed') && (
          <StopwatchCard timerState={timerState} refresh={reloadAll} sessions={sessions} setMsg={setMsg} setLoading={setLoading} />
        )}
        {!!msg && (
          <div className="fixed left-0 right-0 bottom-3 mx-auto w-max px-8 py-3 bg-indigo-900/88 text-white rounded-2xl font-bold shadow-md z-50 text-center glass btn-anim" onClick={() => setMsg('')}>{msg}</div>
        )}
      </div>
      <TodaySessionModal open={showToday} sessions={sessions} onClose={() => setShowToday(false)} />
      <Last7GraphModal open={show7} history={days} onClose={() => setShow7(false)} />
    </div>
  );
};

export default TimelogWidget;
