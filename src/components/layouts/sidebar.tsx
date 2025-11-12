import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  BarChart3,
  UserCircle,
  FolderOpen,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  titleKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    titleKey: 'common.navigation.dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    titleKey: 'common.navigation.posting',
    href: '/posting',
    icon: PenSquare,
  },
  {
    titleKey: 'common.navigation.scheduling',
    href: '/scheduling',
    icon: Calendar,
  },
  {
    titleKey: 'common.navigation.analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    titleKey: 'common.navigation.accounts',
    href: '/accounts',
    icon: UserCircle,
  },
  {
    titleKey: 'common.navigation.contentLibrary',
    href: '/content-library',
    icon: FolderOpen,
  },
  {
    titleKey: 'common.navigation.settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Social Flood</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.titleKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
