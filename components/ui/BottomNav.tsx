'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, Apple, CalendarDays, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const tabs = [
  { key: 'home', label: 'Início', href: '/dashboard', icon: Home },
  { key: 'medir', label: 'Medir', href: '/medir', icon: Activity },
  { key: 'alimentos', label: 'Alimentos', href: '/alimentos', icon: Apple },
  { key: 'plano', label: 'Plano', href: '/plano-semanal', icon: CalendarDays },
  { key: 'perfil', label: 'Perfil', href: '/perfil', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [optimisticPath, setOptimisticPath] = useState(pathname);

  // Sync with actual pathname when navigation completes
  useEffect(() => {
    setOptimisticPath(pathname);
  }, [pathname]);

  // Don't show on root (Quiz), Login, Recovery, Thank You or Quiz pages
  if (['/', '/login', '/recuperar-senha', '/redefinir-senha', '/obrigado', '/quiz'].includes(pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none flex justify-center md:sticky md:bottom-0 md:left-auto md:right-auto md:p-3">
      <nav className="glass-panel pointer-events-auto rounded-3xl px-6 py-3 flex items-center justify-between shadow-lg shadow-emerald-500/10 max-w-sm w-full transition-all duration-300 md:max-w-none md:rounded-2xl md:shadow-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // Check match against OPTIMISTIC path for instant feedback
          const isActive = optimisticPath === tab.href || (tab.href !== '/dashboard' && optimisticPath.startsWith(tab.href));

          return (
            <Link
              key={tab.key}
              href={tab.href}
              prefetch={true} // Pre-load routes in background for faster navigation
              onClick={() => setOptimisticPath(tab.href)} // Instant visual update
              className={`group flex flex-col items-center transition-all duration-300 px-2 relative ${isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'
                } ${isActive ? '-translate-y-1' : ''}`}
            >
              {/* Active Indicator Dot - Animated */}
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-bounce" />
              )}

              <Icon
                className={`h-6 w-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-105'
                  }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[9px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
