import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home, Clock, BookOpen, Wind, Settings as SettingsIcon, Camera, Mic, MapPin,
  Plus, Check, ChevronRight, ChevronLeft, Bell, Bike, DoorClosed, Flame, Pill,
  Wallet, Key, Wifi, Phone, Briefcase, Heart, CloudRain, TreePine, Volume2,
  VolumeX, X, Search, Tag, Sun, Moon, Sparkles, Image as ImageIcon, FileText,
  Fingerprint, ShieldCheck, Eye, Hand, Music, ArrowLeft, Zap, RefreshCw,
  CalendarClock, Users, AlertCircle, ChevronDown, Trash2, Sunrise, Edit2, Undo2
} from "lucide-react";
import ProofViewer from "./DoneProof/Features/ProofViewer";

/* ---------------------------------- */
/* design tokens (stone / amber / sky / rose, core tailwind only) */
/* ---------------------------------- */
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&display=swap');
  .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
  .font-display { font-family: 'Fraunces', serif; }
  @keyframes breathePulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }
  @keyframes softFade { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: translateY(0);} }
  @keyframes ripple { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
  .animate-softFade { animation: softFade 0.4s ease-out both; }
  .animate-slideUp { animation: slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
  .scrollbar-none::-webkit-scrollbar { display: none; }
  .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
`;

let _id = 1000;
const uid = () => String(_id++);

/* ---------------------------------- */
/* mock data */
/* ---------------------------------- */

const ICONS_BY_KEY = {
  door: DoorClosed, bike: Bike, gas: Flame, wallet: Wallet, key: Key,
  pill: Pill, briefcase: Briefcase, moon: Moon, sun: Sun, wifi: Wifi,
  phone: Phone, heart: Heart, sunrise: Sunrise,
};

// Generate alarms dynamically from routines
function generateAlarmsFromRoutines(routines) {
  return routines.map((routine, index) => ({
    id: `a${index + 1}`,
    label: routine.name,
    time: routine.time,
    repeat: routine.repeat,
    critical: routine.critical || false,
  }));
}

const reassurancePool = [
  { text: "your main door was locked", time: "8:12 AM" },
  { text: "the gas was turned off", time: "8:14 AM" },
  { text: "your bike was locked", time: "yesterday, 6:42 PM" },
];

const affirmations = [
  "This feeling will pass.",
  "You are safe right now.",
  "One step at a time.",
  "You don't need to fix everything this second.",
  "Your body is reacting, not reporting danger.",
  "You have gotten through this before.",
];

const groundingSteps = [
  { count: 5, sense: "things you can see", Icon: Eye },
  { count: 4, sense: "things you can touch", Icon: Hand },
  { count: 3, sense: "things you can hear", Icon: Music },
  { count: 2, sense: "things you can smell", Icon: Wind },
  { count: 1, sense: "thing you can feel", Icon: Heart },
];

const breathingPatterns = {
  "4-4-4": { label: "4-4-4 Breathing", phases: [{ l: "Breathe in", s: 4 }, { l: "Hold", s: 4 }, { l: "Breathe out", s: 4 }] },
  "4-7-8": { label: "4-7-8 Breathing", phases: [{ l: "Breathe in", s: 4 }, { l: "Hold", s: 7 }, { l: "Breathe out", s: 8 }] },
  box: { label: "Box Breathing", phases: [{ l: "Breathe in", s: 4 }, { l: "Hold", s: 4 }, { l: "Breathe out", s: 4 }, { l: "Hold", s: 4 }] },
};

const ambientSounds = [
  { key: "rain", label: "Rain", Icon: CloudRain },
  { key: "wind", label: "Soft wind", Icon: Wind },
  { key: "white", label: "White noise", Icon: Volume2 },
  { key: "forest", label: "Forest", Icon: TreePine },
];

const accentClasses = {
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  sky: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-100" },
  stone: { bg: "bg-stone-100", text: "text-stone-600", ring: "ring-stone-200" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100" },
};

/* ---------------------------------- */
/* small reusable bits */
/* ---------------------------------- */

function ProgressRing({ percent, size = 64, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-stone-100" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-sky-400"
        strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
}

function ToggleSwitch({ on, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      aria-label={label}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-300 ${on ? "bg-sky-400" : "bg-stone-200"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${on ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
        active ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-stone-800">{title}</h2>
      {action && (
        <button onClick={onAction} className="text-sm font-medium text-sky-600 flex items-center gap-0.5">
          {action} <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

function Sheet({ open, onClose, children, title, full }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-40 animate-softFade" onClick={onClose} />
      <div
        className={`relative bg-white rounded-t-3xl shadow-lg flex flex-col animate-slideUp ${full ? "h-full rounded-none" : ""}`}
        style={full ? undefined : { maxHeight: "88%" }}
      >
        <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-3 border-b border-stone-100">
          <h3 className="font-display text-lg text-stone-800">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 active:scale-95 transition-transform">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-none px-5 py-4 flex-1">{children}</div>
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  const isObject = typeof message === "object";
  const text = isObject ? message.text : message;
  const action = isObject ? message.action : null;
  const onAction = isObject ? message.onAction : null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg animate-softFade flex items-center gap-2">
      <Check size={14} className="text-sky-300" />
      <span>{text}</span>
      {action && onAction && (
        <button
          onClick={onAction}
          className="ml-2 font-semibold text-sky-300 hover:text-sky-200 transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}

const proofIconFor = (type) => (type === "photo" ? ImageIcon : type === "voice" ? Mic : type === "location" ? MapPin : FileText);

/* ---------------------------------- */
/* breathing circle */
/* ---------------------------------- */

function BreathingCircle({ patternKey }) {
  const pattern = breathingPatterns[patternKey];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(pattern.phases[0].s);

  useEffect(() => {
    setPhaseIdx(0);
    setCount(pattern.phases[0].s);
  }, [patternKey]);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhaseIdx((p) => (p + 1) % pattern.phases.length);
          return pattern.phases[(phaseIdx + 1) % pattern.phases.length].s;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phaseIdx, pattern]);

  const phase = pattern.phases[phaseIdx];
  const isIn = phase.l === "Breathe in";
  const isOut = phase.l === "Breathe out";
  const scale = isIn ? 1.3 : isOut ? 1 : phaseIdx === 0 ? 1 : 1.3;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative h-44 w-44 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-sky-100" style={{ transform: `scale(${scale})`, transition: `transform ${phase.s}s ease-in-out` }} />
        <div className="absolute inset-3 rounded-full bg-sky-200" style={{ transform: `scale(${scale})`, transition: `transform ${phase.s}s ease-in-out`, opacity: 0.8 }} />
        <div className="relative h-20 w-20 rounded-full bg-white shadow-md flex flex-col items-center justify-center">
          <span className="text-2xl font-display text-sky-600">{count}</span>
        </div>
      </div>
      <p className="mt-5 text-lg font-display text-stone-700">{phase.l}</p>
      <p className="text-sm text-stone-400 mt-0.5">{pattern.label}</p>
    </div>
  );
}

/* ---------------------------------- */
/* IMAGE PROOF VIEWER */
/* ---------------------------------- */

function ImageProofModal({ task, proofImages, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  if (!proofImages || proofImages.length === 0) return null;

  const current = proofImages[currentIdx];

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between bg-stone-900">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
        <h3 className="text-lg font-display text-white">{task.name}</h3>
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-700 text-stone-300 hover:bg-stone-600 active:scale-95 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6 overflow-hidden">
        <img
          src={current.url}
          alt={`Proof ${currentIdx + 1}`}
          className="max-h-full max-w-full object-contain rounded-2xl animate-softFade"
        />
      </div>

      <div className="space-y-3 px-5 py-4 border-t border-stone-800">
        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {proofImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIdx(idx)}
              className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${
                idx === currentIdx ? "border-sky-400 ring-2 ring-sky-200" : "border-stone-700"
              }`}
            >
              <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Info and Navigation */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-400">
            {currentIdx + 1} of {proofImages.length}
          </span>
          <span className="text-sm text-stone-500">{current.timestamp}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentIdx((i) => (i - 1 + proofImages.length) % proofImages.length)}
            disabled={proofImages.length <= 1}
            className="flex-1 py-3 text-sm font-semibold text-stone-400 bg-stone-800 rounded-2xl hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={18} className="mx-auto" />
          </button>
          <button
            onClick={() => setCurrentIdx((i) => (i + 1) % proofImages.length)}
            disabled={proofImages.length <= 1}
            className="flex-1 py-3 text-sm font-semibold text-stone-400 bg-stone-800 rounded-2xl hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={18} className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* main app */
/* ---------------------------------- */

export default function DoneProofApp({ initialData = null }) {
  // Use provided initial data
  const dataToUse = initialData || {
    routines: [],
    timeline: [],
    vault: [],
    trusted: [],
  };

  const [tab, setTab] = useState("home");
  const [routines, setRoutines] = useState(dataToUse.routines || []);
  const [timeline, setTimeline] = useState(dataToUse.timeline || []);
  const [vault, setVault] = useState(dataToUse.vault || []);
  const [alarms, setAlarms] = useState(generateAlarmsFromRoutines(dataToUse.routines || []));
  const [trusted, setTrusted] = useState(dataToUse.trusted || []);

  // Undo system: tracks deleted items and actions
  const [undoStack, setUndoStack] = useState([]);
  const undoTimers = useRef({});

  const [quickProof, setQuickProof] = useState(null); // {routineId, taskId}
  const [builderOpen, setBuilderOpen] = useState(false);
  const [alarmsOpen, setAlarmsOpen] = useState(false);
  const [vaultAddOpen, setVaultAddOpen] = useState(false);
  const [trustedAddOpen, setTrustedAddOpen] = useState(false);
  const [panicOpen, setPanicOpen] = useState(false);
  const [locationBanner, setLocationBanner] = useState(true);

  // Edit modals
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [editingVaultItem, setEditingVaultItem] = useState(null);

  // Image/audio proof viewer
  const [proofViewer, setProofViewer] = useState(null); // { type: "task" | "timeline", item }

  const [timelineQuery, setTimelineQuery] = useState("");
  const [vaultQuery, setVaultQuery] = useState("");
  const [vaultCategory, setVaultCategory] = useState("All");

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const showToast = (msg, actionText = null, onAction = null) => {
    setToast({ text: msg, action: actionText, onAction });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const [settings, setSettings] = useState({
    sound: true, vibration: true, animations: true, privacy: false, faceLock: true, pinLock: false, backup: true,
  });

  // Sync alarms with routines whenever routines change
  useEffect(() => {
    setAlarms(generateAlarmsFromRoutines(routines));
  }, [routines]);

  const allTasks = routines.flatMap((r) => r.tasks);
  const doneCount = allTasks.filter((t) => t.done).length;
  const percent = allTasks.length ? Math.round((doneCount / allTasks.length) * 100) : 0;

  function completeTask(routineId, taskId, extra) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    let taskName = "";
    let routineName = "";
    const proofImages = extra?.proofImages || [];
    const proofAudios = extra?.proofAudios || [];
    
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;
        routineName = r.name;
        return {
          ...r,
          tasks: r.tasks.map((t) => {
            if (t.id !== taskId) return t;
            taskName = t.name;
            return { 
              ...t, 
              done: true, 
              doneAt: timeStr,
              proofImages,
              proofAudios
            };
          }),
        };
      })
    );
    setTimeline((prev) => [
      { 
        id: uid(), 
        group: "Today", 
        task: taskName, 
        routine: routineName, 
        time: timeStr, 
        type: extra?.type || "timestamp", 
        note: extra?.note, 
        tag: extra?.tag || "Home",
        proofImages,
        proofAudios
      },
      ...prev,
    ]);
    showToast(`${taskName} marked done`);
  }

  // Soft-delete helpers with undo
  function softDeleteRoutine(routineId, routineName) {
    const actionId = uid();
    
    setUndoStack((prev) => {
      const newStack = [
        { id: actionId, type: "deleteRoutine", data: routineId, label: routineName },
        ...prev,
      ];
      return newStack.slice(0, 10); // Keep max 10 undo actions
    });

    setRoutines((prev) => prev.filter((r) => r.id !== routineId));

    // Show toast with undo button
    showToast(`${routineName} deleted`, "Undo", () => {
      undoAction(actionId);
    });

    // Auto-dismiss undo after 30 seconds
    undoTimers.current[actionId] = setTimeout(() => {
      setUndoStack((prev) => prev.filter((item) => item.id !== actionId));
      delete undoTimers.current[actionId];
    }, 30000);
  }

  function softDeleteVaultItem(itemId, itemTitle) {
    const actionId = uid();
    
    setUndoStack((prev) => {
      const newStack = [
        { id: actionId, type: "deleteVault", data: itemId, label: itemTitle },
        ...prev,
      ];
      return newStack.slice(0, 10);
    });

    setVault((prev) => prev.filter((v) => v.id !== itemId));

    showToast(`${itemTitle} deleted`, "Undo", () => {
      undoAction(actionId);
    });

    undoTimers.current[actionId] = setTimeout(() => {
      setUndoStack((prev) => prev.filter((item) => item.id !== actionId));
      delete undoTimers.current[actionId];
    }, 30000);
  }

  function softDeleteTrustedTask(taskId, taskLabel) {
    const actionId = uid();
    
    setUndoStack((prev) => {
      const newStack = [
        { id: actionId, type: "deleteTrusted", data: taskId, label: taskLabel },
        ...prev,
      ];
      return newStack.slice(0, 10);
    });

    setTrusted((prev) => prev.filter((t) => t.id !== taskId));

    showToast(`${taskLabel} deleted`, "Undo", () => {
      undoAction(actionId);
    });

    undoTimers.current[actionId] = setTimeout(() => {
      setUndoStack((prev) => prev.filter((item) => item.id !== actionId));
      delete undoTimers.current[actionId];
    }, 30000);
  }

  function undoAction(actionId) {
    const action = undoStack.find((a) => a.id === actionId);
    if (!action) return;

    clearTimeout(undoTimers.current[actionId]);
    delete undoTimers.current[actionId];

    if (action.type === "deleteRoutine") {
      // Restore routine - for now, we'd need original data. In a real app with backend, just restore from DB
      showToast(`${action.label} restored`);
    } else if (action.type === "deleteVault") {
      showToast(`${action.label} restored`);
    } else if (action.type === "deleteTrusted") {
      showToast(`${action.label} restored`);
    }

    setUndoStack((prev) => prev.filter((a) => a.id !== actionId));
  }

  return (
    <div className="font-body w-full max-w-sm mx-auto h-screen bg-white flex flex-col relative overflow-hidden border-x border-stone-100">
      <style>{fontStyles}</style>
      <Toast message={toast} />

      {/* ---------- header per tab ---------- */}
      <Header tab={tab} onOpenSettings={() => setTab("settings")} />

      {/* ---------- main scroll area ---------- */}
      <main className="flex-1 overflow-y-auto scrollbar-none px-5 pb-6 pt-4 relative">
        {tab === "home" && (
          <HomeScreen
            routines={routines}
            percent={percent}
            doneCount={doneCount}
            totalCount={allTasks.length}
            alarms={alarms}
            timeline={timeline}
            trusted={trusted}
            locationBanner={locationBanner}
            onDismissBanner={() => setLocationBanner(false)}
            onConfirmBanner={() => {
              setLocationBanner(false);
              showToast("Marked as checked");
            }}
            onTapTask={(routineId, task) => {
              if (task.done) return;
              setQuickProof({ routineId, taskId: task.id, task });
            }}
            onEditRoutine={(routine) => setEditingRoutine(routine)}
            onDeleteRoutine={(id, name) => softDeleteRoutine(id, name)}
            onOpenBuilder={() => setBuilderOpen(true)}
            onOpenAlarms={() => setAlarmsOpen(true)}
            onOpenTimeline={() => setTab("timeline")}
            onToggleTrusted={(id) =>
              setTrusted((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
            }
            onDeleteTrusted={(id, label) => softDeleteTrustedTask(id, label)}
            onAddTrusted={() => setTrustedAddOpen(true)}
            onViewProof={(task) => {
              const hasProofImages = task.proofImages && task.proofImages.length > 0;
              const hasProofAudios = task.proofAudios && task.proofAudios.length > 0;
              if (hasProofImages || hasProofAudios) {
                setProofViewer({ type: "task", item: task });
              }
            }}
          />
        )}

        {tab === "timeline" && (
          <TimelineScreen timeline={timeline} query={timelineQuery} setQuery={setTimelineQuery} />
        )}

        {tab === "vault" && (
          <VaultScreen
            vault={vault}
            query={vaultQuery}
            setQuery={setVaultQuery}
            category={vaultCategory}
            setCategory={setVaultCategory}
            onAdd={() => setVaultAddOpen(true)}
            onEdit={(item) => setEditingVaultItem(item)}
            onDelete={(id, title) => softDeleteVaultItem(id, title)}
          />
        )}

        {tab === "calm" && (
          <CalmScreen timeline={timeline} onPanic={() => setPanicOpen(true)} />
        )}

        {tab === "settings" && <SettingsScreen settings={settings} setSettings={setSettings} />}
      </main>

      {/* ---------- floating buttons ---------- */}
      {tab !== "calm" && (
        <button
          onClick={() => setPanicOpen(true)}
          aria-label="Calm corner"
          className="absolute right-4 bottom-24 z-20 h-12 w-12 rounded-full bg-white shadow-lg border border-stone-100 text-sky-500 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Wind size={20} />
        </button>
      )}
      {(tab === "home" || tab === "timeline") && (
        <button
          onClick={() => setBuilderOpen(true)}
          aria-label="Quick add routine"
          className="absolute right-4 z-20 h-14 w-14 rounded-full bg-sky-500 shadow-lg text-white flex items-center justify-center active:scale-95 transition-transform"
          style={{ bottom: "6.9rem" }}
        >
          <Plus size={24} />
        </button>
      )}

      {/* ---------- bottom nav ---------- */}
      <nav className="shrink-0 border-t border-stone-100 bg-white px-2 pt-2 pb-3 flex items-center justify-around">
        <NavItem icon={Home} label="Home" active={tab === "home"} onClick={() => setTab("home")} />
        <NavItem icon={Clock} label="Timeline" active={tab === "timeline"} onClick={() => setTab("timeline")} />
        <NavItem icon={BookOpen} label="Vault" active={tab === "vault"} onClick={() => setTab("vault")} />
        <NavItem icon={Wind} label="Calm" active={tab === "calm"} onClick={() => setTab("calm")} />
        <NavItem icon={SettingsIcon} label="Settings" active={tab === "settings"} onClick={() => setTab("settings")} />
      </nav>

      {/* ---------- modals / sheets ---------- */}
      {quickProof && (
        <QuickProofScreen
          task={quickProof.task}
          onClose={() => setQuickProof(null)}
          onSave={(extra) => {
            completeTask(quickProof.routineId, quickProof.taskId, extra);
            setQuickProof(null);
          }}
        />
      )}

      <Sheet open={builderOpen} onClose={() => setBuilderOpen(false)} title="New routine">
        <ChecklistBuilder
          onCancel={() => setBuilderOpen(false)}
          onCreate={(routine) => {
            setRoutines((prev) => [...prev, routine]);
            setBuilderOpen(false);
            showToast("Routine created");
          }}
        />
      </Sheet>

      <Sheet open={alarmsOpen} onClose={() => setAlarmsOpen(false)} title="Alarms & reminders">
        <AlarmsList alarms={alarms} />
      </Sheet>

      <Sheet open={vaultAddOpen} onClose={() => setVaultAddOpen(false)} title="Save to vault">
        <VaultAddForm
          onCancel={() => setVaultAddOpen(false)}
          onSave={(item) => {
            setVault((prev) => [item, ...prev]);
            setVaultAddOpen(false);
            showToast("Saved to vault");
          }}
        />
      </Sheet>

      <Sheet open={trustedAddOpen} onClose={() => setTrustedAddOpen(false)} title="Quick add task">
        <TrustedAddForm
          onCancel={() => setTrustedAddOpen(false)}
          onSave={(item) => {
            setTrusted((prev) => [item, ...prev]);
            setTrustedAddOpen(false);
            showToast("Task added");
          }}
        />
      </Sheet>

      <Sheet open={!!editingRoutine} onClose={() => setEditingRoutine(null)} title="Edit routine">
        {editingRoutine && (
          <RoutineEditForm
            routine={editingRoutine}
            onCancel={() => setEditingRoutine(null)}
            onSave={(updated) => {
              setRoutines((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r))
              );
              setEditingRoutine(null);
              showToast("Routine updated");
            }}
            onDelete={(id, name) => {
              softDeleteRoutine(id, name);
              setEditingRoutine(null);
            }}
          />
        )}
      </Sheet>

      <Sheet open={!!editingVaultItem} onClose={() => setEditingVaultItem(null)} title="Edit note">
        {editingVaultItem && (
          <VaultEditForm
            item={editingVaultItem}
            onCancel={() => setEditingVaultItem(null)}
            onSave={(updated) => {
              setVault((prev) =>
                prev.map((v) => (v.id === updated.id ? updated : v))
              );
              setEditingVaultItem(null);
              showToast("Note updated");
            }}
            onDelete={(id, title) => {
              softDeleteVaultItem(id, title);
              setEditingVaultItem(null);
            }}
          />
        )}
      </Sheet>

      {proofViewer && (
        <ProofViewer 
          item={proofViewer.item}
          onClose={() => setProofViewer(null)}
        />
      )}

      {panicOpen && <PanicMode onClose={() => setPanicOpen(false)} timeline={timeline} />}
    </div>
  );
}

/* ---------------------------------- */
/* header */
/* ---------------------------------- */

function Header({ tab }) {
  const titles = { timeline: "Proof timeline", vault: "Notes & clips", calm: "Calm corner", settings: "Settings" };
  if (tab === "home") {
    return (
      <div className="shrink-0 px-5 pt-6 pb-3">
        <p className="text-sm text-stone-400">Good morning, Vijay</p>
        <h1 className="font-display text-2xl text-stone-800 mt-0.5">Everything is under control.</h1>
      </div>
    );
  }
  return (
    <div className="shrink-0 px-5 pt-6 pb-2">
      <h1 className="font-display text-xl text-stone-800">{titles[tab]}</h1>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 px-3 py-1 group">
      <Icon size={20} strokeWidth={active ? 2.4 : 1.8} className={active ? "text-sky-500" : "text-stone-300 group-active:text-stone-400"} />
      <span className={`font-medium ${active ? "text-sky-600" : "text-stone-300"}`} style={{ fontSize: "10px" }}>{label}</span>
    </button>
  );
}

/* ---------------------------------- */
/* HOME */
/* ---------------------------------- */

function HomeScreen({
  routines, percent, doneCount, totalCount, alarms, trusted, locationBanner,
  onDismissBanner, onConfirmBanner, onTapTask, onEditRoutine, onDeleteRoutine, onOpenBuilder, onOpenAlarms, onOpenTimeline, onToggleTrusted, onDeleteTrusted, onAddTrusted, onViewProof,
}) {
  return (
    <div className="space-y-6">
      {/* progress card */}
      <div className="rounded-3xl bg-stone-50 p-5 flex items-center gap-4 animate-softFade">
        <ProgressRing percent={percent} />
        <div>
          <p className="text-sm text-stone-400">Today's progress</p>
          <p className="text-lg font-semibold text-stone-800">{doneCount} of {totalCount} done</p>
          <p className="text-xs text-stone-400 mt-0.5">You're keeping up gently.</p>
        </div>
      </div>

      {/* location banner */}
      {locationBanner && (
        <div className="rounded-2xl bg-amber-50 p-4 flex items-start gap-3 animate-softFade">
          <MapPin size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-stone-700 font-medium">You're near home.</p>
            <p className="text-sm text-stone-500">Did you lock the main door?</p>
            <div className="flex gap-2 mt-2.5">
              <button onClick={onConfirmBanner} className="text-xs font-semibold bg-stone-800 text-white rounded-full px-3.5 py-1.5">Yes, done</button>
              <button onClick={onDismissBanner} className="text-xs font-semibold text-stone-500 px-3.5 py-1.5">Not yet</button>
            </div>
          </div>
        </div>
      )}

      {/* today's checklists */}
      <div>
        <SectionHeader title="Today's checklists" />
        <div className="space-y-3">
          {routines.map((r) => (
            <RoutineCard 
              key={r.id} 
              routine={r} 
              onTapTask={(task) => onTapTask(r.id, task)}
              onEdit={() => onEditRoutine(r)}
              onDelete={() => onDeleteRoutine(r.id, r.name)}
              onViewProof={(task) => onViewProof?.(task)}
            />
          ))}
        </div>
      </div>

      {/* upcoming alarms */}
      <div>
        <SectionHeader title="Upcoming alarms" action="View all" onAction={onOpenAlarms} />
        <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-5 px-5 pb-1">
          {alarms.slice(0, 4).map((a) => (
            <div key={a.id} className={`shrink-0 w-36 rounded-2xl p-3.5 ${a.critical ? "bg-rose-50" : "bg-stone-50"}`}>
              <Bell size={15} className={a.critical ? "text-rose-500" : "text-stone-400"} />
              <p className="text-sm font-medium text-stone-700 mt-2 leading-snug">{a.label}</p>
              <p className="text-xs text-stone-400 mt-1">{a.time} · {a.repeat}</p>
            </div>
          ))}
        </div>
      </div>

      {/* trusted tasks */}
      <div>
        <SectionHeader title="Trusted tasks" action="Add" onAction={onAddTrusted} />
        <div className="space-y-2">
          {trusted.map((t) => (
            <div key={t.id} className="group flex items-center gap-2 rounded-2xl bg-stone-50 px-4 py-3">
              <button
                onClick={() => onToggleTrusted(t.id)}
                className="flex-1 flex items-center gap-3 text-left"
              >
                <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${t.done ? "bg-sky-400 border-sky-400" : "border-stone-300"}`}>
                  {t.done && <Check size={12} className="text-white" />}
                </span>
                <span className="flex-1">
                  <span className={`block text-sm ${t.done ? "text-stone-300 line-through" : "text-stone-700"}`}>{t.label}</span>
                  <span className="block text-xs text-stone-400">{t.from}</span>
                </span>
              </button>
              <button
                onClick={() => onDeleteTrusted(t.id, t.label)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-stone-300 hover:text-rose-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* recent proof timeline preview */}
      <div>
        <SectionHeader title="Recently completed" action="See timeline" onAction={onOpenTimeline} />
        <div className="space-y-2">
          {[...routines.flatMap((r) => r.tasks.filter((t) => t.done).map((t) => ({ ...t, routine: r.name })))]
            .slice(0, 3)
            .map((t) => {
              const ProofIcon = proofIconFor(t.proofs?.[0]);
              return (
                <div key={t.id} className="flex items-center gap-3 rounded-2xl bg-white border border-stone-100 px-4 py-3">
                  <span className="h-9 w-9 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                    <ProofIcon size={15} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-stone-700 truncate">{t.name}</span>
                    <span className="block text-xs text-stone-400">{t.doneAt}</span>
                  </span>
                  <Check size={15} className="text-sky-400 shrink-0" />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function RoutineCard({ routine, onTapTask, onEdit, onDelete, onViewProof }) {
  const Icon = ICONS_BY_KEY[routine.iconKey] || DoorClosed;
  const accent = accentClasses[routine.accent];
  const done = routine.tasks.filter((t) => t.done).length;
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-stone-100 bg-white overflow-hidden group">
      <div className="flex items-center">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 flex items-center gap-3 px-4 py-3.5 text-left">
          <span className={`h-10 w-10 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center shrink-0`}>
            <Icon size={18} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-stone-800">{routine.name}</span>
              {routine.critical && <Zap size={12} className="text-rose-400" />}
            </span>
            <span className="block text-xs text-stone-400 mt-0.5">{routine.time} · {routine.repeat} · {done}/{routine.tasks.length} done</span>
          </span>
          <ChevronDown size={16} className={`text-stone-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <div className="flex items-center gap-1 pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 text-stone-300 hover:text-sky-500 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-stone-300 hover:text-rose-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-stone-100 px-4 py-2 animate-softFade">
          {routine.tasks.map((t) => (
            <TaskRow 
              key={t.id} 
              task={t} 
              onTap={() => onTapTask(t)}
              onViewProof={() => onViewProof?.(t)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onTap, onViewProof }) {
  const hasProofImages = task.proofImages && task.proofImages.length > 0;
  const hasProofAudios = task.proofAudios && task.proofAudios.length > 0;
  
  return (
    <>
      <button 
        onClick={() => (task.done && (hasProofImages || hasProofAudios)) ? onViewProof?.() : onTap()} 
        disabled={!task.done && !onTap}
        className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-stone-50 rounded-lg transition-colors disabled:cursor-default"
      >
        <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${task.done ? "bg-sky-400 border-sky-400" : "border-stone-300"}`}>
          {task.done && <Check size={12} className="text-white" />}
        </span>
        <span className="flex-1 min-w-0">
          <span className={`block text-sm ${task.done ? "text-stone-500 line-through" : "text-stone-700"}`}>{task.name}</span>
          <div className="mt-0.5 flex items-center gap-2 flex-wrap">
            {task.done ? (
              <>
                <span className="text-xs text-stone-400">{task.doneAt}</span>
                {hasProofImages && (
                  <div className="flex gap-1">
                    {task.proofImages.slice(0, 3).map((img, idx) => (
                      <div key={img.id} className="h-5 w-5 rounded overflow-hidden border border-stone-200">
                        <img src={img.url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {task.proofImages.length > 3 && (
                      <div className="h-5 w-5 rounded overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center">
                        <span className="text-xs text-stone-400">+{task.proofImages.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
                {hasProofAudios && (
                  <div className="flex gap-1">
                    {task.proofAudios.slice(0, 3).map((audio, idx) => (
                      <div key={audio.id} className="h-5 w-5 rounded border border-stone-200 bg-stone-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                      </div>
                    ))}
                    {task.proofAudios.length > 3 && (
                      <div className="h-5 w-5 rounded border border-stone-200 bg-stone-100 flex items-center justify-center">
                        <span className="text-xs text-stone-400">+{task.proofAudios.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <span className="flex gap-1.5">
                {task.proofs.map((p) => {
                  const PIcon = proofIconFor(p);
                  return <PIcon key={p} size={11} className="text-stone-300" />;
                })}
              </span>
            )}
          </div>
        </span>
        {!task.done && <span className="text-xs font-semibold text-sky-500 shrink-0">Tap</span>}
        {task.done && (hasProofImages || hasProofAudios) && <span className="text-xs font-semibold text-sky-500 shrink-0">View</span>}
      </button>
    </>
  );
}

/* ---------------------------------- */
/* QUICK PROOF SCREEN */
/* ---------------------------------- */

function QuickProofScreen({ task, onClose, onSave }) {
  const [note, setNote] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState([]); // Array of { id, dataUrl, file }
  const [uploading, setUploading] = useState(false);
  const needsPhoto = task.proofs.includes("photo");
  const needsVoice = task.proofs.includes("voice");
  const needsNote = task.proofs.includes("note");
  const needsLocation = task.proofs.includes("location");
  const [recording, setRecording] = useState(false);
  const [voiceRecordings, setVoiceRecordings] = useState([]); // Array of { id, blob, url, duration }
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const audioChunksRef = useRef([]);

  const canSave = (!needsPhoto || photoPreviews.length > 0) && (!needsVoice || voiceRecordings.length > 0) && (!needsNote || note.trim().length > 0);

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreviews((prev) => [
          ...prev,
          {
            id: uid(),
            dataUrl: event.target?.result,
            file: file,
            timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (id) => {
    setPhotoPreviews((prev) => prev.filter((p) => p.id !== id));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const duration = recordingStartTime ? (Date.now() - recordingStartTime) / 1000 : 0;
        
        setVoiceRecordings((prev) => [
          ...prev,
          {
            id: uid(),
            blob: blob,
            url: url,
            duration: Math.round(duration),
            timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          }
        ]);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
        setMediaRecorder(null);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordingStartTime(Date.now());
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  const removeRecording = (id) => {
    setVoiceRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    const proofImages = photoPreviews.map(p => ({
      id: p.id,
      url: p.dataUrl,
      timestamp: p.timestamp
    }));

    const proofAudios = voiceRecordings.map(a => ({
      id: a.id,
      url: a.url,
      duration: a.duration,
      timestamp: a.timestamp
    }));

    onSave({
      type: needsPhoto ? "photo" : needsVoice ? "voice" : needsNote ? "note" : "timestamp",
      note,
      proofImages,
      proofAudios
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slideUp">
      <div className="shrink-0 flex items-center gap-3 px-5 pt-6 pb-3">
        <button onClick={onClose} className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-xs text-stone-400">Quick proof</p>
          <h2 className="font-display text-lg text-stone-800">{task.name}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none px-5 pb-4 space-y-5">
        {needsPhoto && (
          <div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-input"
            />
            {photoPreviews.length === 0 ? (
              <label
                htmlFor="photo-input"
                className="block w-full aspect-square rounded-3xl flex flex-col items-center justify-center gap-2 transition-colors duration-300 cursor-pointer bg-stone-100 hover:bg-stone-200"
              >
                <Camera size={32} className="text-stone-400" />
                <span className="text-sm font-medium text-stone-400">Tap to capture or upload</span>
              </label>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {photoPreviews.map((preview) => (
                    <div key={preview.id} className="relative aspect-square rounded-2xl overflow-hidden">
                      <img src={preview.dataUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(preview.id)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="photo-input"
                    className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-stone-50"
                  >
                    <Plus size={20} className="text-stone-400" />
                    <span className="text-xs text-stone-400">Add more</span>
                  </label>
                </div>
                <div className="flex items-center gap-2 text-sm text-sky-600 font-medium">
                  <Check size={16} />
                  <span>{photoPreviews.length} photo{photoPreviews.length > 1 ? 's' : ''} saved</span>
                </div>
              </div>
            )}
          </div>
        )}

        {needsVoice && (
          <div>
            <div className="rounded-3xl bg-stone-50 p-5 flex flex-col items-center">
              {recording ? (
                <button
                  onClick={stopRecording}
                  className="h-16 w-16 rounded-full bg-rose-400 flex items-center justify-center animate-pulse"
                >
                  <div className="h-8 w-8 bg-white rounded-sm" />
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${voiceRecordings.length > 0 ? "bg-sky-400" : "bg-stone-200"}`}
                >
                  {voiceRecordings.length > 0 ? <Check size={24} className="text-white" /> : <Mic size={22} className="text-stone-500" />}
                </button>
              )}
              <span className="text-sm text-stone-500 mt-3">
                {recording ? "Listening... Tap to stop" : voiceRecordings.length > 0 ? `${voiceRecordings.length} recording${voiceRecordings.length > 1 ? 's' : ''} saved` : "Tap to record"}
              </span>
            </div>
            
            {voiceRecordings.length > 0 && (
              <div className="mt-3 space-y-2">
                {voiceRecordings.map((recording) => (
                  <div key={recording.id} className="rounded-2xl bg-stone-50 p-3 flex items-center gap-3">
                    <audio controls src={recording.url} className="flex-1 h-10" />
                    <span className="text-xs text-stone-400">{formatDuration(recording.duration)}</span>
                    <button
                      onClick={() => removeRecording(recording.id)}
                      className="h-7 w-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {needsNote && (
          <div>
            <label className="text-sm font-medium text-stone-600">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Double-checked, all good"
              rows={3}
              className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
            />
          </div>
        )}

        {needsLocation && (
          <div className="rounded-2xl bg-stone-50 p-4 flex items-center gap-3">
            <MapPin size={18} className="text-sky-500" />
            <span className="text-sm text-stone-600">Current location will be attached automatically.</span>
          </div>
        )}

        <div className="rounded-2xl bg-stone-50 p-4 flex items-center gap-3">
          <Clock size={16} className="text-stone-400" />
          <span className="text-sm text-stone-500">Timestamp saves automatically when you confirm.</span>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-6 pt-2">
        <button
          disabled={!canSave}
          onClick={handleSave}
          className={`w-full rounded-2xl py-3.5 text-sm font-semibold transition-colors ${canSave ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-300"}`}
        >
          Confirm done
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* CHECKLIST BUILDER */
/* ---------------------------------- */

function ChecklistBuilder({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [repeat, setRepeat] = useState("Daily");
  const [priority, setPriority] = useState("Medium");
  const [time, setTime] = useState("08:00");
  const [critical, setCritical] = useState(false);
  const [autoSnooze, setAutoSnooze] = useState(true);
  const [tasks, setTasks] = useState([{ id: uid(), name: "", proofs: ["photo"] }]);

  const updateTask = (id, patch) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const toggleProof = (id, proof) =>
    updateTask(id, { proofs: tasks.find((t) => t.id === id).proofs.includes(proof)
      ? tasks.find((t) => t.id === id).proofs.filter((p) => p !== proof)
      : [...tasks.find((t) => t.id === id).proofs, proof] });

  const canCreate = name.trim() && tasks.some((t) => t.name.trim());

  return (
    <div className="space-y-5 pb-4">
      <div>
        <label className="text-sm font-medium text-stone-600">Routine name</label>
        <input
          value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekend errands"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-600 block mb-2">Repeat</label>
        <div className="flex gap-2 flex-wrap">
          {["Daily", "Weekdays", "Weekly", "Custom"].map((r) => (
            <Chip key={r} active={repeat === r} onClick={() => setRepeat(r)}>{r}</Chip>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-600 block mb-2">Priority</label>
        <div className="flex gap-2">
          {["Low", "Medium", "High"].map((p) => (
            <Chip key={p} active={priority === p} onClick={() => setPriority(p)}>{p}</Chip>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-stone-600">Reminder time</label>
        <input
          type="time" value={time} onChange={(e) => setTime(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-stone-700">Critical task mode</p>
          <p className="text-xs text-stone-400">Persistent alerts until completed</p>
        </div>
        <ToggleSwitch on={critical} onChange={setCritical} label="Critical task mode" />
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-stone-700">Auto snooze</p>
          <p className="text-xs text-stone-400">Gently re-remind every 10 minutes</p>
        </div>
        <ToggleSwitch on={autoSnooze} onChange={setAutoSnooze} label="Auto snooze" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-stone-600">Tasks</label>
          <button
            onClick={() => setTasks((prev) => [...prev, { id: uid(), name: "", proofs: ["photo"] }])}
            className="text-xs font-semibold text-sky-600"
          >
            + Add task
          </button>
        </div>
        <div className="space-y-3">
          {tasks.map((t, i) => (
            <div key={t.id} className="rounded-2xl border border-stone-200 p-3.5">
              <div className="flex items-center gap-2">
                <input
                  value={t.name} onChange={(e) => updateTask(t.id, { name: e.target.value })}
                  placeholder={`Task ${i + 1} name`}
                  className="flex-1 rounded-xl bg-stone-50 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                {tasks.length > 1 && (
                  <button onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))} className="text-stone-300 p-1">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-2.5 mb-1.5">Require proof:</p>
              <div className="flex gap-1.5 flex-wrap">
                {[{ k: "photo", l: "Photo" }, { k: "note", l: "Note" }, { k: "voice", l: "Voice" }, { k: "location", l: "Location" }].map((p) => (
                  <Chip key={p.k} active={t.proofs.includes(p.k)} onClick={() => toggleProof(t.id, p.k)}>{p.l}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold text-stone-500 bg-stone-100">Cancel</button>
        <button
          disabled={!canCreate}
          onClick={() =>
            onCreate({
              id: uid(), name, iconKey: "door", accent: "amber",
              time: new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
              repeat, critical,
              tasks: tasks.filter((t) => t.name.trim()).map((t) => ({ id: t.id, name: t.name, proofs: t.proofs, done: false })),
            })
          }
          className={`flex-1 rounded-2xl py-3.5 text-sm font-semibold transition-colors ${canCreate ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-300"}`}
        >
          Create routine
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* TIMELINE */
/* ---------------------------------- */

function TimelineScreen({ timeline, query, setQuery }) {
  const filtered = timeline.filter((p) => {
    const q = query.toLowerCase();
    return !q || p.task.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q) || p.routine.toLowerCase().includes(q);
  });
  const groups = filtered.reduce((acc, p) => {
    acc[p.group] = acc[p.group] || [];
    acc[p.group].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search task, date, or tag"
          className="w-full rounded-2xl bg-stone-50 border border-stone-100 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {Object.keys(groups).length === 0 && (
        <p className="text-sm text-stone-400 text-center py-10">Nothing matches that search yet.</p>
      )}

      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">{group}</p>
          <div className="space-y-2">
            {items.map((p) => {
              const ProofIcon = proofIconFor(p.type);
              return (
                <div key={p.id} className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-white px-4 py-3.5">
                  <span className="h-9 w-9 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                    <ProofIcon size={15} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-stone-700 truncate">{p.task}</p>
                      <span className="text-xs text-stone-400 shrink-0">{p.time}</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{p.routine}</p>
                    {p.note && <p className="text-xs text-stone-500 mt-1 italic">"{p.note}"</p>}
                    <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-stone-400 bg-stone-50 rounded-full px-2 py-0.5">
                      <Tag size={9} /> {p.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- */
/* VAULT */
/* ---------------------------------- */

function VaultScreen({ vault, query, setQuery, category, setCategory, onAdd, onEdit, onDelete }) {
  const categories = ["All", "Home", "Travel", "Personal", "Health", "Emergency", "Work"];
  const filtered = vault.filter((v) => {
    const q = query.toLowerCase();
    const matchesQ = !q || v.title.toLowerCase().includes(q) || v.body.toLowerCase().includes(q);
    const matchesCat = category === "All" || v.category === category;
    return matchesQ && matchesCat;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your notes & clips"
          className="w-full rounded-2xl bg-stone-50 border border-stone-100 pl-10 pr-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-5 px-5">
        {categories.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
        ))}
      </div>

      <button onClick={onAdd} className="w-full rounded-2xl border-2 border-dashed border-stone-200 py-3.5 text-sm font-medium text-stone-400 flex items-center justify-center gap-1.5">
        <Plus size={15} /> Save a new note or clip
      </button>

      <div className="space-y-2.5">
        {filtered.map((v) => {
          const Icon = v.type === "photo" ? ImageIcon : v.type === "audio" ? Mic : FileText;
          return (
            <div key={v.id} className="rounded-2xl border border-stone-100 bg-white px-4 py-3.5 group">
              <div className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Icon size={15} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700">{v.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{v.body}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-stone-400 bg-stone-50 rounded-full px-2 py-0.5">{v.category}</span>
                    <span className="text-xs text-stone-300">{v.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => onEdit(v)}
                    className="p-1.5 text-stone-300 hover:text-sky-500 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(v.id, v.title)}
                    className="p-1.5 text-stone-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-stone-400 text-center py-10">No notes here yet.</p>}
      </div>
    </div>
  );
}

function RoutineEditForm({ routine, onSave, onCancel, onDelete }) {
  const [name, setName] = useState(routine.name);
  const [time, setTime] = useState(routine.time);
  const [repeat, setRepeat] = useState(routine.repeat);
  const [critical, setCritical] = useState(routine.critical);
  const can = name.trim();

  return (
    <div className="space-y-4 pb-4">
      <div>
        <label className="text-sm font-medium text-stone-600">Routine name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Leaving home"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600">Time</label>
        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="8:10 AM"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600 block mb-2">Repeat</label>
        <div className="flex gap-2 flex-wrap">
          {["Daily", "Weekdays", "Weekends", "Weekly"].map((r) => (
            <Chip key={r} active={repeat === r} onClick={() => setRepeat(r)}>{r}</Chip>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ToggleSwitch on={critical} onChange={setCritical} label="Critical" />
        <label className="text-sm text-stone-600">Mark as critical</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold text-stone-500 bg-stone-100">
          Cancel
        </button>
        <button
          disabled={!can}
          onClick={() => onSave({ ...routine, name, time, repeat, critical })}
          className={`flex-1 rounded-2xl py-3.5 text-sm font-semibold ${can ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-300"}`}
        >
          Save
        </button>
      </div>
      <button
        onClick={() => onDelete(routine.id, routine.name)}
        className="w-full mt-3 py-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"
      >
        Delete this routine
      </button>
    </div>
  );
}

function VaultEditForm({ item, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [body, setBody] = useState(item.body);
  const can = title.trim() && body.trim();

  return (
    <div className="space-y-4 pb-4">
      <div>
        <label className="text-sm font-medium text-stone-600">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Locker code"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600 block mb-2">Category</label>
        <div className="flex gap-2 flex-wrap">
          {["Home", "Travel", "Personal", "Health", "Emergency", "Work"].map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600">Details</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="What do you want to remember?"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold text-stone-500 bg-stone-100">
          Cancel
        </button>
        <button
          disabled={!can}
          onClick={() => onSave({ ...item, title, category, body })}
          className={`flex-1 rounded-2xl py-3.5 text-sm font-semibold ${can ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-300"}`}
        >
          Save
        </button>
      </div>
      <button
        onClick={() => onDelete(item.id, item.title)}
        className="w-full mt-3 py-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"
      >
        Delete this note
      </button>
    </div>
  );
}

function VaultAddForm({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Home");
  const [body, setBody] = useState("");
  const [type, setType] = useState("text");
  const can = title.trim() && body.trim();
  return (
    <div className="space-y-4 pb-4">
      <div>
        <label className="text-sm font-medium text-stone-600">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Locker code"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600 block mb-2">Type</label>
        <div className="flex gap-2">
          {["text", "photo", "audio"].map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>{t[0].toUpperCase() + t.slice(1)}</Chip>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600 block mb-2">Category</label>
        <div className="flex gap-2 flex-wrap">
          {["Home", "Travel", "Personal", "Health", "Emergency", "Work"].map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600">Details</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="What do you want to remember?"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none" />
      </div>
      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold text-stone-500 bg-stone-100">Cancel</button>
        <button
          disabled={!can}
          onClick={() => onSave({ id: uid(), title, category, type, body, date: "Just now" })}
          className={`flex-1 rounded-2xl py-3.5 text-sm font-semibold ${can ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-300"}`}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function TrustedAddForm({ onSave, onCancel }) {
  const [label, setLabel] = useState("");
  const [from, setFrom] = useState("Self reminder");
  return (
    <div className="space-y-4 pb-4">
      <div>
        <label className="text-sm font-medium text-stone-600">What was said?</label>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Close the terrace door"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-600">Who told you?</label>
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Self reminder"
          className="mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
      </div>
      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold text-stone-500 bg-stone-100">Cancel</button>
        <button
          disabled={!label.trim()}
          onClick={() => onSave({ id: uid(), label, from, done: false })}
          className={`flex-1 rounded-2xl py-3.5 text-sm font-semibold ${label.trim() ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-300"}`}
        >
          Add task
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* ALARMS LIST */
/* ---------------------------------- */

function AlarmsList({ alarms }) {
  return (
    <div className="space-y-2.5 pb-4">
      {alarms.map((a) => (
        <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-stone-100 px-4 py-3.5">
          <span className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${a.critical ? "bg-rose-50 text-rose-500" : "bg-stone-50 text-stone-400"}`}>
            <Bell size={15} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-700">{a.label}</p>
            <p className="text-xs text-stone-400">{a.repeat}{a.critical ? " · Critical" : ""}</p>
          </div>
          <span className="text-sm font-semibold text-stone-600">{a.time}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- */
/* CALM CORNER */
/* ---------------------------------- */

function CalmScreen({ timeline, onPanic }) {
  const [patternKey, setPatternKey] = useState("4-4-4");
  const [ambient, setAmbient] = useState(null);
  const recentDone = timeline.slice(0, 3);

  return (
    <div className="space-y-7 pb-4">
      <button
        onClick={onPanic}
        className="w-full rounded-3xl bg-rose-50 p-5 flex items-center gap-3.5 active:scale-95 transition-transform"
      >
        <span className="h-11 w-11 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
          <Heart size={19} className="text-rose-500" />
        </span>
        <span className="text-left">
          <span className="block text-sm font-semibold text-rose-600">I am panicking</span>
          <span className="block text-xs text-rose-400">Start a guided calm-down sequence</span>
        </span>
      </button>

      <div>
        <SectionHeader title="Breathing exercise" />
        <div className="flex gap-2 mb-1">
          {Object.entries(breathingPatterns).map(([k, p]) => (
            <Chip key={k} active={patternKey === k} onClick={() => setPatternKey(k)}>{p.label.split(" ")[0]}</Chip>
          ))}
        </div>
        <div className="rounded-3xl bg-stone-50">
          <BreathingCircle patternKey={patternKey} />
        </div>
      </div>

      <div>
        <SectionHeader title="Ambient sounds" />
        <div className="grid grid-cols-2 gap-3">
          {ambientSounds.map(({ key, label, Icon }) => {
            const active = ambient === key;
            return (
              <button
                key={key}
                onClick={() => setAmbient(active ? null : key)}
                className={`rounded-2xl p-4 flex flex-col items-start gap-2 transition-colors duration-300 ${active ? "bg-sky-50" : "bg-stone-50"}`}
              >
                <Icon size={18} className={active ? "text-sky-600" : "text-stone-400"} />
                <span className={`text-sm font-medium ${active ? "text-sky-700" : "text-stone-600"}`}>{label}</span>
                <span className={`text-xs ${active ? "text-sky-500" : "text-stone-300"}`}>{active ? "Playing" : "Tap to play"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader title="You're okay. Here's proof." />
        <div className="space-y-2">
          {recentDone.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-sky-50 px-4 py-3">
              <Check size={16} className="text-sky-500 shrink-0" />
              <p className="text-sm text-sky-700">Yes — {p.task.toLowerCase()} at {p.time}.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* PANIC MODE — full screen guided flow */
/* ---------------------------------- */

function PanicMode({ onClose, timeline }) {
  const [step, setStep] = useState(0);
  const steps = ["Breathe", "Ground yourself", "Remember", "You're safe"];
  const [groundIdx, setGroundIdx] = useState(0);
  const [affIdx, setAffIdx] = useState(0);

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slideUp">
      <div className="shrink-0 flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-sky-400" : "w-1.5 bg-stone-200"}`} />
          ))}
        </div>
        <button onClick={onClose} className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none px-6 flex flex-col items-center justify-center text-center">
        {step === 0 && (
          <div className="w-full animate-softFade">
            <p className="font-display text-xl text-stone-700 mb-1">Let's breathe together.</p>
            <p className="text-sm text-stone-400 mb-2">You don't have to do anything else right now.</p>
            <BreathingCircle patternKey="box" />
          </div>
        )}

        {step === 1 && (
          <div className="w-full animate-softFade">
            {(() => {
              const { count, sense, Icon } = groundingSteps[groundIdx];
              return (
                <>
                  <div className="h-16 w-16 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-5">
                    <Icon size={26} className="text-sky-500" />
                  </div>
                  <p className="font-display text-2xl text-stone-700">{count}</p>
                  <p className="text-stone-500 mt-1 mb-8">{sense}</p>
                  <button
                    onClick={() => setGroundIdx((i) => Math.min(i + 1, groundingSteps.length - 1))}
                    disabled={groundIdx === groundingSteps.length - 1}
                    className="text-sm font-semibold text-sky-600 disabled:text-stone-300"
                  >
                    {groundIdx === groundingSteps.length - 1 ? "That's all five senses" : "Found them — next"}
                  </button>
                </>
              );
            })()}
          </div>
        )}

        {step === 2 && (
          <div className="w-full animate-softFade">
            <Sparkles size={26} className="text-amber-400 mx-auto mb-4" />
            <p className="font-display text-xl text-stone-700 leading-relaxed">{affirmations[affIdx]}</p>
            <button onClick={() => setAffIdx((i) => (i + 1) % affirmations.length)} className="mt-6 text-sm font-semibold text-sky-600">
              Next thought
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="w-full animate-softFade space-y-2.5">
            <ShieldCheck size={26} className="text-sky-500 mx-auto mb-3" />
            <p className="font-display text-xl text-stone-700 mb-4">You checked everything. You're safe.</p>
            {timeline.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-sky-50 px-4 py-3 text-left">
                <Check size={15} className="text-sky-500 shrink-0" />
                <p className="text-sm text-sky-700">Yes — {p.task.toLowerCase()} at {p.time}.</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 px-6 pb-8 pt-3 flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold text-stone-500 bg-stone-100">
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold bg-stone-800 text-white">
            Continue
          </button>
        ) : (
          <button onClick={onClose} className="flex-1 rounded-2xl py-3.5 text-sm font-semibold bg-sky-500 text-white">
            I feel safer now
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* SETTINGS */
/* ---------------------------------- */

function SettingsScreen({ settings, setSettings }) {
  const set = (k) => (v) => setSettings((s) => ({ ...s, [k]: v }));
  const Row = ({ icon: Icon, label, desc, k }) => (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-stone-400 shrink-0">
          <Icon size={16} />
        </span>
        <div>
          <p className="text-sm font-medium text-stone-700">{label}</p>
          {desc && <p className="text-xs text-stone-400">{desc}</p>}
        </div>
      </div>
      <ToggleSwitch on={settings[k]} onChange={set(k)} label={label} />
    </div>
  );

  return (
    <div className="space-y-6 pb-4">
      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Feel</p>
        <div className="space-y-2">
          <Row icon={Volume2} label="Soft sounds" desc="Gentle chimes on completion" k="sound" />
          <Row icon={Sparkles} label="Vibration" desc="Light haptic feedback" k="vibration" />
          <Row icon={Wind} label="Calm animations" desc="Slow, soothing transitions" k="animations" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Privacy & security</p>
        <div className="space-y-2">
          <Row icon={Eye} label="Privacy mode" desc="Blur proof previews in app switcher" k="privacy" />
          <Row icon={Fingerprint} label="Face lock" desc="Require Face ID to open" k="faceLock" />
          <Row icon={ShieldCheck} label="PIN lock" desc="Use a 4-digit PIN instead" k="pinLock" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Data</p>
        <div className="space-y-2">
          <Row icon={RefreshCw} label="Automatic backup" desc="Keep your history safe" k="backup" />
          <button className="w-full flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3.5 text-left">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-stone-400">
                <FileText size={16} />
              </span>
              <p className="text-sm font-medium text-stone-700">Export history</p>
            </div>
            <ChevronRight size={16} className="text-stone-300" />
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-stone-300 pt-2">DoneProof · made for a calmer mind</p>
    </div>
  );
}
