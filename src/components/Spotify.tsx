import { useState, useCallback, useEffect, useRef, type FC } from 'react';
import type { Song } from '../lib/types';
import { Icons } from './Icons/ReactIcons';

const Spotify: FC = () => {
  const [song, setSong] = useState<Song>();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); 
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/spotifydata.json');

      if (res.status === 200) {
        const data: Song = await res.json();
        setSong(data);

        if (progress.current) {
          progress.current.style.width = `${Math.floor(
            data?.currentProgress * 100
          )}%`;
        }
      } else if (res.status === 204) {
        setSong(undefined);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const downloadAndPlayPause = useCallback(() => {
    if (audio && !audio.paused) {
      audio.pause();
    } else if (audio && audio.paused) {
      audio.play();
    } else if (!audio && song) {
      fetch(song.previewUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          const newAudio = new Audio(objectURL);
          setAudio(newAudio)
          newAudio.play();
        });
    }
  }, [song?.previewUrl, audio]);

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
          <Icons.SpotifyIcon className="h-6 ml-1" />
          Nothing Playing Right now!
        </h2>
        <div className="flex justify-center">
          <img src="/wall.jpg" alt="Chill Clouds Image" className="w-full" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2 my-3">
      <h2 className="font-bold flex items-center gap-2 underline underline-offset-4 decoration-neutral-500 hover-transition">
        <Icons.SpotifyIcon className="h-6 ml-1" />
        Currently {song.isCurrentlyPlaying ? 'Playing' : 'Paused'}
      </h2>
      <div className="flex">
        <img
          src={song.album.image}
          alt="Album cover"
          width={60}
          height={60}
          className="rounded-md"
        />
        <div className="flex flex-col justify-between w-full">
          <div className="flex">
            <div className="mx-auto flex flex-col">
              <a
                className="font-bold hover-transition mx-auto truncate"
                href={song.externalUrl}
                target="_blank"
              >
                {song.title} - {song.artist.name}
              </a>
              <button
                className="mx-auto hover-transition"
                onClick={downloadAndPlayPause}
              >
                Play/Pause
              </button>
            </div>
            <p className="font-mono">
              {formatTime(Math.floor(song.progress_ms / 1000))}
            </p>
          </div>
          <div className="flex justify-center mx-auto w-3/4">
            <div className="w-full h-1 bg-neutral-600 rounded-full">
              <div
                className="h-full bg-neutral-50 rounded-full"
                ref={progress}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Spotify;

// RIP SEO
