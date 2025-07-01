'use client';
import { useSidebar } from '@/contexts/SidebarContext';

export default function MainContent({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <main className={`${
      isCollapsed ? 'lg:ml-16' : 'lg:ml-72'
    } flex-1 min-h-screen overflow-y-auto transition-all duration-300 pt-16 lg:pt-0`}>
      <div className="p-4 sm:p-6 lg:p-8 min-h-full">
        {children}
      </div>
    </main>
  );
}
