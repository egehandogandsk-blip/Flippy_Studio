import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { InfiniteCanvas } from './components/Canvas/InfiniteCanvas';
import { LayerTree } from './components/Sidebar/LayerTree';
import { PropertyPanel } from './components/Properties/PropertyPanel';
import { FloatingToolbar } from './components/Toolbar/FloatingToolbar';
import { TopBar } from './components/TopBar/TopBar';
import { AIModal } from './components/AI/AIModal';
import { IntegrationModal } from './components/Integration/IntegrationModal';
import { Launcher } from './components/Launcher/Launcher';
import { LoginScreen } from './components/Auth/LoginScreen';
import { SubscriptionSuccess } from './components/Subscription/SubscriptionSuccess';
import { SubscriptionCancel } from './components/Subscription/SubscriptionCancel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useUiStore } from './store/uiStore';
import { initializeTheme } from './store/themeStore';
import { clsx } from 'clsx';
import { handleExport } from './utils/ExportUtils';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function App() {
  const theme = useUiStore((state) => state.theme);
  useKeyboardShortcuts();

  useEffect(() => {
    // Initialize theme
    initializeTheme();

    // Don't create any default content - let user create their own

    const onExport = (e: any) => {
      handleExport(e.detail.nodeId, e.detail.format, e.detail.scale);
    };

    const onMultiExport = (e: any) => {
      import('./utils/ExportUtils').then(({ handleMultiExport }) => {
        handleMultiExport(e.detail.nodeIds, e.detail.format, e.detail.scale);
      });
    };

    window.addEventListener('export-node', onExport);
    window.addEventListener('multi-export', onMultiExport);
    return () => {
      window.removeEventListener('export-node', onExport);
      window.removeEventListener('multi-export', onMultiExport);
    };
  }, []);

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <div className={clsx(
        "flex flex-col w-screen h-screen overflow-hidden font-sans transition-colors duration-200",
        theme === 'dark' ? 'dark bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-zinc-900'
      )}>
        <SignedIn>
          <Routes>
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />
            <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
            <Route path="*" element={
              <>
                <TopBar />
                <FloatingToolbar />
                <AIModal />
                <IntegrationModal />
                <Launcher />

                <div className="flex flex-1 overflow-hidden">
                  <LayerTree />
                  <div className="flex-1 relative bg-transparent">
                    <InfiniteCanvas />
                  </div>
                  <div className="flex border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 w-80 transition-colors duration-200">
                    <PropertyPanel />
                  </div>
                </div>
              </>
            } />
          </Routes>
        </SignedIn>

        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </div>
    </ClerkProvider>
  );
}

export default App;
