import {
  DoorClosed, Bike, Flame, Wallet, Key, Pill, Briefcase, Moon, Sun, Wifi,
  Phone, Heart, Sunrise, Eye, Hand, Music, Wind, Volume2, CloudRain, TreePine
} from 'lucide-react'

// Design tokens and styles
export const fontStyles = `
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

// Icon mapping
export const ICONS_BY_KEY = {
  door: DoorClosed, bike: Bike, gas: Flame, wallet: Wallet, key: Key,
  pill: Pill, briefcase: Briefcase, moon: Moon, sun: Sun, wifi: Wifi,
  phone: Phone, heart: Heart, sunrise: Sunrise,
};

// Default alarms
export const initialAlarms = [
  { id: "a1", label: "Morning medicine", time: "8:00 AM", repeat: "Daily", critical: true },
  { id: "a2", label: "Leaving home check", time: "8:10 AM", repeat: "Weekdays", critical: false },
  { id: "a3", label: "Office shutdown", time: "6:30 PM", repeat: "Weekdays", critical: false },
  { id: "a4", label: "Night medicine", time: "9:00 PM", repeat: "Daily", critical: true },
  { id: "a5", label: "Night lock check", time: "10:30 PM", repeat: "Daily", critical: true },
];

// Reassurance messages
export const reassurancePool = [
  { text: "your main door was locked", time: "8:12 AM" },
  { text: "the gas was turned off", time: "8:14 AM" },
  { text: "your bike was locked", time: "yesterday, 6:42 PM" },
];

// Affirmations
export const affirmations = [
  "This feeling will pass.",
  "You are safe right now.",
  "One step at a time.",
  "You don't need to fix everything this second.",
  "Your body is reacting, not reporting danger.",
  "You have gotten through this before.",
];

// Grounding technique steps
export const groundingSteps = [
  { count: 5, sense: "things you can see", Icon: Eye },
  { count: 4, sense: "things you can touch", Icon: Hand },
  { count: 3, sense: "things you can hear", Icon: Music },
  { count: 2, sense: "things you can smell", Icon: Wind },
  { count: 1, sense: "thing you can feel", Icon: Heart },
];

// Breathing patterns
export const breathingPatterns = {
  "4-4-4": { label: "4-4-4 Breathing", phases: [{ l: "Breathe in", s: 4 }, { l: "Hold", s: 4 }, { l: "Breathe out", s: 4 }] },
  "4-7-8": { label: "4-7-8 Breathing", phases: [{ l: "Breathe in", s: 4 }, { l: "Hold", s: 7 }, { l: "Breathe out", s: 8 }] },
  box: { label: "Box Breathing", phases: [{ l: "Breathe in", s: 4 }, { l: "Hold", s: 4 }, { l: "Breathe out", s: 4 }, { l: "Hold", s: 4 }] },
};

// Ambient sounds
export const ambientSounds = [
  { key: "rain", label: "Rain", Icon: CloudRain },
  { key: "wind", label: "Soft wind", Icon: Wind },
  { key: "white", label: "White noise", Icon: Volume2 },
  { key: "forest", label: "Forest", Icon: TreePine },
];

// Accent color classes
export const accentClasses = {
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  sky: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-100" },
  stone: { bg: "bg-stone-100", text: "text-stone-600", ring: "ring-stone-200" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100" },
};
