import { useEffect, useState } from 'react';
import loadingLogo from '@/assets/buddyfinder-loading-logo.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[hsl(25_100%_55%)] to-[hsl(25_100%_65%)] flex flex-col items-center justify-center z-50">
      <div className="animate-scale-in">
        <img 
          src={loadingLogo} 
          alt="BuddyFinder Logo" 
          className="w-48 h-48 object-contain animate-pulse"
        />
      </div>
      
      <div className="mt-8 w-64">
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white text-center mt-4 font-medium">
          Carregando... {progress}%
        </p>
      </div>
    </div>
  );
};