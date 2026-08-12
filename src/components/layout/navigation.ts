import {
  Archive, BarChart3, BookOpen, Boxes, Compass, GitBranch, Home, Map, Orbit, Save,
  Settings, Sparkles, UserRound, UsersRound,
} from 'lucide-react'

export const navigation = [
  { label: 'Dashboard', short: 'Home', path: '/', icon: Home },
  { label: 'Life Save', short: 'Save', path: '/save', icon: Save },
  { label: 'People', short: 'People', path: '/people', icon: UsersRound },
  { label: 'Timeline', short: 'Time', path: '/timeline', icon: GitBranch },
  { label: 'Decision Lab', short: 'Decide', path: '/decision', icon: Compass },
  { label: 'Discover', short: 'Discover', path: '/discover', icon: Orbit },
  { label: 'Quest', short: 'Quest', path: '/quest', icon: Sparkles },
  { label: 'My World', short: 'World', path: '/world', icon: Map },
  { label: 'Statistics', short: 'Stats', path: '/stats', icon: BarChart3 },
  { label: 'Year Review', short: 'Review', path: '/review', icon: BookOpen },
  { label: 'Archive', short: 'Archive', path: '/archive', icon: Archive },
]

export const secondaryNavigation = [
  { label: 'Profile', path: '/profile', icon: UserRound },
  { label: 'Memory', path: '/memory', icon: Boxes },
  { label: 'Settings', path: '/settings', icon: Settings },
]
