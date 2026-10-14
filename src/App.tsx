import { useState, useEffect, useCallback } from 'react';
import { BirthdayConfig } from './types/birthday';
import { loadBirthdayConfig } from './utils/storage';
import { FireworksCanvas } from './components/FireworksCanvas';
import { CelebrationCard } from './components/CelebrationCard';
import { AdminPanel } from './components/AdminPanel';

type PageRoute = 'card' | 'admin';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(() => loadBirthdayConfig());
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('card');

  // Helper to determine route from current window location
  const checkRouteFromLocation = useCallback((): PageRoute => {
    if (typeof window === 'undefined') return 'card';

    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search);

    if (
      path.endsWith('/admin') ||
      path.endsWith('/admin/') ||
      hash === '#admin' ||
      hash === '#/admin' ||
      search.get('page') === 'admin' ||
      search.get('view') === 'admin' ||
      search.has('admin')
    ) {
      return 'admin';
    }

    return 'card';
  }, []);

  // Sync route on mount and when popstate/hashchange triggers
  useEffect(() => {
    setCurrentRoute(checkRouteFromLocation());

    const handleLocationChange = () => {
      setCurrentRoute(checkRouteFromLocation());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [checkRouteFromLocation]);

  // Navigate to admin
  const handleNavigateToAdmin = () => {
    setCurrentRoute('admin');
    try {
      const url = new URL(window.location.href);
      url.pathname = '/admin';
      // If running in restricted iframe or sandbox where pushState pathname might differ, fallback cleanly
      window.history.pushState({ page: 'admin' }, '', url.pathname + url.search);
    } catch {
      window.location.hash = '#admin';
    }
  };

  // Navigate to card (utama)
  const handleNavigateToCard = () => {
    setCurrentRoute('card');
    try {
      const url = new URL(window.location.href);
      url.pathname = '/';
      url.hash = '';
      window.history.pushState({ page: 'card' }, '', url.pathname + url.search);
    } catch {
      window.location.hash = '';
    }
  };

  const handleSaveConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 overflow-x-hidden select-text">
      {/* Background Interactive Fireworks Canvas (Active on card page or when enabled) */}
      <FireworksCanvas
        active={currentRoute === 'card' && config.showFireworks}
        soundEnabled={true}
      />

      {/* Dynamic Route View */}
      {currentRoute === 'admin' ? (
        <AdminPanel
          initialConfig={config}
          onSave={handleSaveConfig}
          onNavigateToCard={handleNavigateToCard}
        />
      ) : (
        <CelebrationCard
          config={config}
          onNavigateToAdmin={handleNavigateToAdmin}
        />
      )}
    </div>
  );
}
