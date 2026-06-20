import { ImageIcon, Mic, MapPin, FileText } from 'lucide-react'

// Unique ID generator
let _id = 1000
export const uid = () => String(_id++)

// Get icon for proof type
export const proofIconFor = (type) => {
  if (type === "photo") return ImageIcon
  if (type === "voice") return Mic
  if (type === "location") return MapPin
  return FileText
}

// Format date for display
export const formatDate = (date) => {
  if (!date) return "Today"
  const d = new Date(date)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return "Today"
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Get random item from array
export const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]
