import {type LucideIcon} from 'lucide-react';
import {LayoutDashboard, Users, FolderKanban, GraduationCap, Settings} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'K-Hub', href: '/k-hub', icon: GraduationCap },
  { name: 'Settings', href: '/settings', icon: Settings },
];
