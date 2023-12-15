import { useState, useCallback, useEffect, useRef, type FC } from 'react';
import { FaSpotify } from 'react-icons/fa';
import type { Song } from '../lib/types';

const Spotify: FC = () => {
  const [song, setSong] = useState<Song>();
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/spotifydata.json');

      if (res.status === 200) {
        const data: Song = await res.json();
        setSong(data);

        if (progress.current) {
          progress.current.style.width = `${Math.floor(data?.currentProgress * 100)}%`;
        }
      } else if (res.status === 204) {
        setSong(undefined);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(1, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }, []);

  if (!song) {
    return (
      <section className="flex flex-col gap-1 my-2">
        <h2 className="font-bold flex items-center gap-2 underline underline-offset-4 decoration-neutral-500 hover-transition">
          <FaSpotify className="h-6" />
          Nothing Playing Right now!
        </h2>
        <div className="flex justify-center w-full">
          <img src="/wall.jpg" alt="Chill Clouds Image" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2 my-3">
      <h2 className="font-bold flex items-center gap-2 underline underline-offset-4 decoration-neutral-500 hover-transition">
        <FaSpotify className="h-6" />
        Currently {song.isCurrentlyPlaying ? 'Playing' : 'Paused'}
      </h2>
      <div className="flex">
        <img src={song.album.image} alt="Album cover" width={60} height={60} className='rounded-md'/>
        <div className="flex flex-col justify-between w-full">
          <div className="flex">
            <a
              className="font-bold hover-transition mx-auto truncate"
              href={song.externalUrl}
              target="_blank"
            >
              {song.title} - {song.artist.name}
            </a>
            <p className='font-mono'>{formatTime(Math.floor(song.progress_ms / 1000))}</p>
          </div>
          <div className="flex justify-center">
            <div className='w-3/4 h-1 bg-neutral-600 rounded-full'>
              <div className='h-full bg-neutral-50 rounded-full' ref={progress}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Spotify;

// RIP SEO