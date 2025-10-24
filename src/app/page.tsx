'use client';

import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import DreamCanvas from '@/components/DreamCanvas';
import DreamLoader from '@/components/DreamLoader';
import DreamGallery from '@/components/DreamGallery';

interface DreamArtwork {
  id: string;
  imageUrl: string;
  dreamText: string;
  timestamp: string;
}

export default function Home() {
  const [dreamText, setDreamText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [artworks, setArtworks] = useState<DreamArtwork[]>([]);

  const handleGenerateDream = async () => {
    if (!dreamText.trim()) {
      setError('Please describe your dream');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate dream painting');
      }

      const newArtwork: DreamArtwork = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        dreamText: data.dreamText,
        timestamp: data.timestamp,
      };

      setArtworks([newArtwork, ...artworks]);
      setDreamText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dream-gradient relative overflow-hidden">
      <DreamCanvas />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-white animate-pulse" />
            <h1 className="text-6xl md:text-7xl font-bold text-white title-font">
              DreamLens
            </h1>
            <Sparkles className="h-10 w-10 text-white animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
            Transform your dreams into stunning visual art
          </p>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto">
            Describe your dream, and watch as AI brings your imagination to life
          </p>
        </div>

        {/* Dream Input Card */}
        <Card className="max-w-3xl mx-auto p-8 bg-white/10 backdrop-blur-xl border-white/20 ethereal-glow mb-12">
          <div className="space-y-4">
            <label htmlFor="dream-input" className="block text-white font-medium text-lg">
              Describe your dream
            </label>
            <Textarea
              id="dream-input"
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Last night, I dreamed I was floating through a garden of crystalline flowers, where butterflies made of light danced around glowing trees..."
              className="min-h-[150px] bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-purple-400 transition-all resize-none text-base"
              disabled={loading}
            />
            {error && (
              <p className="text-red-300 text-sm bg-red-500/20 px-4 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button
              onClick={handleGenerateDream}
              disabled={loading || !dreamText.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {loading ? (
                <>Generating...</>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Paint My Dream
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-xl border-white/20 ethereal-glow">
            <DreamLoader />
          </Card>
        )}

        {/* Gallery */}
        <DreamGallery artworks={artworks} />
      </div>
    </div>
  );
}