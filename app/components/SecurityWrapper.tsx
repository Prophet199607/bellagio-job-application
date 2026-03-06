'use client';

import { useEffect } from 'react';

export default function SecurityWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      //   if (e.key === 'F12') {
      //     e.preventDefault();
      //   }

      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element selector)
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === 'I' ||
          e.key === 'J' ||
          e.key === 'C' ||
          e.key === 'i' ||
          e.key === 'j' ||
          e.key === 'c')
      ) {
        e.preventDefault();
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}
