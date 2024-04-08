// MediaContext.tsx
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface Media {
    fileName: string;
    alt: string;
    url: string;
    fileSize: number;
    mimeType: string;
    height: number;
    width: number;
}

interface MediaContextType {
  selectedMedia: Media | null;
  setSelectedMedia: (media: Media | null) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);


export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  return (
    <MediaContext.Provider value={{ selectedMedia, setSelectedMedia }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => useContext(MediaContext);