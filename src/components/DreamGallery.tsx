'use client';

import { Download, Calendar, Type } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface DreamArtwork {
  id: string;
  imageUrl: string;
  dreamText: string;
  timestamp: string;
}

interface DreamGalleryProps {
  artworks: DreamArtwork[];
}

export default function DreamGallery({ artworks }: DreamGalleryProps) {
  const handleDownload = async (imageUrl: string, dreamText: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dreamlens-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (artworks.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 title-font bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Your Dream Gallery
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card
            key={artwork.id}
            className="group overflow-hidden bg-white/10 dark:bg-black/20 backdrop-blur-lg border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.dreamText}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Button
                onClick={() => handleDownload(artwork.imageUrl, artwork.dreamText)}
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white text-purple-600 shadow-lg"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Type className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                <p className="text-sm text-foreground/80 line-clamp-2">
                  {artwork.dreamText}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <time>{new Date(artwork.timestamp).toLocaleString()}</time>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
