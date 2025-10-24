'use client';

export default function DreamLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-purple-200 opacity-20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '2s' }}></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-purple-600 dark:text-purple-400 animate-pulse">
          Painting your dream...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Transforming thoughts into art
        </p>
      </div>
    </div>
  );
}
