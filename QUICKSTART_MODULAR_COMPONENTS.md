# Quick Start - Using Modular DoneProof Components

## The Refactored Component System

The DoneProof app has been broken into smaller, maintainable modules while keeping 100% of the design and feel intact.

## File Structure

```
components/
└── DoneProof/
    ├── constants.js          ← All colors, patterns, icons
    ├── utils.js              ← Helper functions
    ├── index.js              ← Single import point
    ├── UI/                   ← Reusable UI components
    │   ├── ProgressRing.jsx
    │   ├── ToggleSwitch.jsx
    │   ├── Chip.jsx
    │   ├── SectionHeader.jsx
    │   ├── Sheet.jsx
    │   └── Toast.jsx
    └── Features/             ← Complex feature components
        ├── BreathingCircle.jsx
        └── ImageProofModal.jsx
```

## How to Import

### Option 1: Import from main index (Recommended)
```jsx
import { 
  ProgressRing, 
  Toast, 
  Sheet,
  ToggleSwitch,
  initialAlarms,
  accentClasses 
} from '@/components/DoneProof'
```

### Option 2: Import specific files
```jsx
import ProgressRing from '@/components/DoneProof/UI/ProgressRing'
import { initialAlarms } from '@/components/DoneProof/constants'
import { uid } from '@/components/DoneProof/utils'
```

### Option 3: Import main app
```jsx
import DoneProofApp from '@/components/DoneProofApp'
```

## Using Individual Components

### ProgressRing - Circular Progress
```jsx
<ProgressRing percent={75} size={64} stroke={7} />
```
- `percent` (0-100) - Progress percentage
- `size` - SVG size (default: 64px)
- `stroke` - Line width (default: 7px)

### ToggleSwitch - On/Off Toggle
```jsx
const [enabled, setEnabled] = useState(false)
<ToggleSwitch on={enabled} onChange={setEnabled} label="Enable feature" />
```

### Chip - Selection Chip
```jsx
<Chip active={isSelected} onClick={() => setSelected(!isSelected)}>
  Option 1
</Chip>
```

### SectionHeader - Section Title
```jsx
<SectionHeader 
  title="My Tasks" 
  action="See all"
  onAction={() => navigateTo('/all-tasks')}
/>
```

### Sheet - Bottom Modal
```jsx
const [open, setOpen] = useState(false)
<Sheet open={open} onClose={() => setOpen(false)} title="Options">
  <div>Modal content here</div>
</Sheet>
```

### Toast - Notification
```jsx
<Toast message="Task completed!" />
```

### BreathingCircle - Breathing Exercise
```jsx
import { BreathingCircle } from '@/components/DoneProof'
<BreathingCircle patternKey="4-4-4" />
// Patterns: "4-4-4", "4-7-8", "box"
```

### ImageProofModal - Image Viewer
```jsx
<ImageProofModal 
  task={currentTask}
  proofImages={task.proofImages}
  onClose={() => setShowProof(false)}
/>
```

## Using Constants

### Colors (Accent Classes)
```jsx
import { accentClasses } from '@/components/DoneProof'

const styles = accentClasses.sky // or 'amber', 'stone', 'rose'
<div className={`${styles.bg} ${styles.text}`}>Styled content</div>
```

### Breathing Patterns
```jsx
import { breathingPatterns } from '@/components/DoneProof'

const pattern = breathingPatterns['4-7-8']
// {label: "4-7-8 Breathing", phases: [array of phases]}
```

### Affirmations
```jsx
import { affirmations, pickRandom } from '@/components/DoneProof'

const dailyAffirmation = pickRandom(affirmations)
// "This feeling will pass.", "You are safe right now.", etc.
```

### Grounding Steps
```jsx
import { groundingSteps } from '@/components/DoneProof'

// 5-4-3-2-1 grounding technique
groundingSteps.forEach(step => {
  console.log(`${step.count} ${step.sense}`)
})
```

## Using Utilities

### Generate Unique IDs
```jsx
import { uid } from '@/components/DoneProof'

const taskId = uid() // "1000", "1001", "1002", etc.
```

### Get Proof Icons
```jsx
import { proofIconFor } from '@/components/DoneProof'

const PhotoIcon = proofIconFor('photo')
const VoiceIcon = proofIconFor('voice')
const LocationIcon = proofIconFor('location')
```

### Format Dates
```jsx
import { formatDate } from '@/components/DoneProof'

formatDate(new Date()) // "Today"
formatDate(yesterday) // "Yesterday"
formatDate(date)      // "Jan 15"
```

## Design System - Preserved

All original design elements are preserved:

**Colors**: Stone, Sky, Amber, Rose
**Fonts**: DM Sans (body) + Fraunces (display)
**Animations**: softFade, slideUp, breathePulse, ripple
**Spacing**: Standard Tailwind scale (gap-1 through gap-8)
**Sizing**: Touch-friendly (min 44px tappable areas)

## Full Example

```jsx
'use client'
import { useState } from 'react'
import { 
  Toast, 
  SectionHeader, 
  Chip, 
  ProgressRing,
  affirmations,
  pickRandom 
} from '@/components/DoneProof'

export default function Dashboard() {
  const [showToast, setShowToast] = useState('')
  const [progress, setProgress] = useState(45)
  const [selectedOption, setSelectedOption] = useState(null)

  const handleSelection = (option) => {
    setSelectedOption(option)
    setShowToast(`Selected: ${option}`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Progress Section */}
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-display">Today's Progress</h1>
        <ProgressRing percent={progress} />
        <p className="text-sm text-stone-600">{progress}% complete</p>
      </div>

      {/* Tasks Section */}
      <SectionHeader title="My Tasks" action="View all" />
      <div className="space-y-2">
        <Chip active={selectedOption === 'task1'} onClick={() => handleSelection('task1')}>
          Morning Routine
        </Chip>
        <Chip active={selectedOption === 'task2'} onClick={() => handleSelection('task2')}>
          Check Security
        </Chip>
      </div>

      {/* Daily Affirmation */}
      <div className="p-4 bg-sky-50 rounded-2xl text-center">
        <p className="text-sm text-sky-700 font-medium">
          {pickRandom(affirmations)}
        </p>
      </div>

      {/* Toast Notification */}
      <Toast message={showToast} />
    </div>
  )
}
```

## What's Different (Nothing!)

The user experience is identical. This refactoring only reorganizes code for better maintainability:

- ✅ Same design
- ✅ Same feel
- ✅ Same animations
- ✅ Same colors
- ✅ Same interactions
- ✅ Same performance

## Migration Path

You don't need to refactor the entire app at once. Use new components incrementally:

1. Start using modular components in new features
2. Gradually extract other components
3. Existing `DoneProofApp.jsx` continues to work
4. Mix and match as needed

## Support

For detailed component documentation, see: `components/DoneProof/README.md`
For refactoring details, see: `REFACTORING_SUMMARY.md`
