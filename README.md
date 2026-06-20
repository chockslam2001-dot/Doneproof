# DoneProof - Routine & Anxiety Management PWA

A Progressive Web App built with Next.js for tracking daily routines, managing anxiety, and proving you're in control.

## Features

### Core Features
- **Daily Routines**: Create and manage routines with time-based reminders
- **Task Tracking**: Track individual tasks within routines with different proof types
- **Progress Circle**: Visual progress tracking for daily completion
- **Location-based Prompts**: Context-aware reminders when near home or specific locations

### Proof Methods
- **Photo Proof**: Capture photos as evidence of task completion
- **Voice Notes**: Record audio memos for tasks
- **Location Tags**: Automatic location attachment
- **Text Notes**: Quick notes and details
- **Timestamps**: Automatic timestamping of all actions

### Tab Navigation
1. **Home**: Dashboard with routines, progress, and quick actions
2. **Timeline**: Historical record of all completed tasks searchable by date/tag
3. **Vault**: Secure storage for important notes, codes, and information
4. **Calm Corner**: Anxiety management tools including:
   - Guided breathing exercises (4-4-4, 4-7-8, Box breathing)
   - Panic mode with grounding techniques
   - Affirmations and reassurance
   - Ambient sounds (rain, wind, white noise, forest)
5. **Settings**: Customize feel and security preferences

### Anxiety Management
- **Panic Mode**: Full-screen guided calm-down sequence
- **Breathing Exercises**: Multiple breathing patterns with visual circle
- **Grounding Techniques**: 5-4-3-2-1 sensory awareness exercise
- **Reassurance Proof**: Shows recently completed tasks to provide proof of capability

### PWA Features
- **Installable**: Works on mobile and desktop as a standalone app
- **Offline Support**: Service worker caching for offline functionality
- **App Icons**: Adaptive icons for all device types
- **Full-screen Display**: Seamless app experience without browser UI

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: Lucide React icons
- **Styling**: Tailwind CSS v4
- **Service Worker**: Custom PWA implementation with offline caching
- **Fonts**: DM Sans (body), Fraunces (display)
- **Colors**: Stone, Sky, Amber, Rose palette

## Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Install Dependencies
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
pnpm build
pnpm start
```

## PWA Installation

### Mobile (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Name the app and add

### Mobile (Android)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Select "Install app" or "Add to Home Screen"

### Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Select "Install"

## File Structure

```
/app
  ├── layout.tsx           # Root layout with PWA setup
  ├── page.tsx            # Main app page
  ├── globals.css         # Global styles and animations
  └── pwa-register.tsx    # Service worker registration

/components
  └── DoneProofApp.jsx    # Main app component (all UI)

/public
  ├── manifest.json       # PWA manifest
  ├── sw.js              # Service worker
  ├── icon-*.png         # App icons (192x192, 512x512)
  ├── icon-*-maskable.png # Maskable icons for adaptive display
  └── apple-touch-icon.png # iOS app icon

next.config.mjs           # Next.js configuration
package.json             # Dependencies
```

## Key Components

### DoneProofApp
The main component handling all app state and UI rendering:
- State management for routines, timeline, vault, alarms, trusted tasks
- Tab navigation system
- Modal/sheet overlays for forms
- Toast notifications

### BreathingCircle
Interactive breathing exercise visualization with multiple patterns.

### PanicMode
Full-screen guided anxiety management sequence.

### QuickProofScreen
Modal for capturing proof of task completion.

### ChecklistBuilder
Form for creating new routines with customizable tasks and proof methods.

## Design System

### Colors
- **Stone**: Primary neutral palette (#f5f5f4, #a1a1a1)
- **Sky**: Accent color for active states (#0ea5e9)
- **Amber**: Warning/location indicators (#b45309)
- **Rose**: Critical/emergency states (#e11d48)

### Typography
- **Headings**: Fraunces (serif, elegant)
- **Body**: DM Sans (clean, modern)

### Spacing & Radius
- Uses Tailwind spacing scale (0.25rem base unit)
- Rounded-2xl and rounded-3xl for most components

### Animations
- `breathePulse`: Pulse effect for progress ring
- `softFade`: Gentle fade-in (0.4s)
- `slideUp`: Slide up entrance (0.35s)

## Browser Support

- Modern browsers with PWA support
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+ (iOS 15+)

## Privacy & Security

The app stores all data locally in the browser. No data is sent to external servers. All sensitive information can be encrypted locally:

- Privacy Mode: Blur proof previews in app switcher
- Face Lock: Require Face ID to open (on supported devices)
- PIN Lock: Use a 4-digit PIN for security

## License

Created with ❤️ for a calmer mind.
