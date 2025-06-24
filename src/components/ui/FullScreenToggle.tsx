"use client";

import { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FullScreenToggle() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    function onFullScreenChange() {
      setIsFullScreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  const handleToggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleToggleFullScreen}
      className={cn(
        "neumorphic-topbar-button",
        "relative overflow-hidden"
      )}
    >
      {isFullScreen ? (
        <Minimize className="h-5 w-5 transition-all duration-300" />
      ) : (
        <Maximize className="h-5 w-5 transition-all duration-300" />
      )}
      <span className="sr-only">{isFullScreen ? 'Exit full screen' : 'Enter full screen'}</span>
    </Button>
  );
} 