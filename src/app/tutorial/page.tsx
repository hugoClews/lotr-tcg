'use client';

import { useRouter } from 'next/navigation';
import TutorialGame from '@/components/TutorialGame';

export default function TutorialPage() {
  const router = useRouter();

  const handleComplete = () => {
    // Show completion message and redirect
    router.push('/?tutorialComplete=true');
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <TutorialGame 
      onComplete={handleComplete} 
      onExit={handleExit} 
    />
  );
}
