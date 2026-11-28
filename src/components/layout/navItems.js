import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardCheck,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react'

export const navItems = [
  { to: '/', label: 'Overview', title: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'Users', title: 'Users', icon: Users },
  { to: '/businesses', label: 'Businesses', title: 'Businesses', icon: Building2 },
  { to: '/applications', label: 'Provider Applications', short: 'Applications', title: 'Provider Applications', icon: ClipboardCheck, badge: true },
  { to: '/opportunities', label: 'Opportunities', title: 'Opportunities', icon: Briefcase },
  { to: '/quotations', label: 'Quotations', title: 'Quotations', icon: FileText },
  { to: '/reports', label: 'Reports', title: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', title: 'Settings', icon: Settings },
]
