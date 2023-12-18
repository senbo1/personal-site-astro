import { useState, useCallback, useEffect, useRef, type FC } from 'react';
import type { Song } from '../lib/types';
import { Icons } from './Icons/ReactIcons';
import Modal from './Modal';

const Spotify: FC = () => {
  const [song, setSong] = useState<Song>();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetching song updates at regular interval
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/spotifydata.json');

        if (res.status === 200) {
          const data: Song = await res.json();
          setSong(data);

          if (progress.current) {
            // update progress bar width
            progress.current.style.width = `${Math.floor(
              data?.currentProgress * 100
            )}%`;
          }
        } else if (res.status === 204) {
          // if no song is playing
          setSong(undefined);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
        setAudio(null);
      }
    };
  }, []);

  const downloadAndPlayPause = useCallback(() => {
    if (fetching) {
      // if song is already being downloaded
      return;
    }

    // if there is song and no audio is downloaded or the song has changed
    if (song && (!audio || (audio && song.title !== audio.title))) {
      // if No Preview is available
      if (song.previewUrl === null) {
        setShowModal(true);
        return;
      }

      setFetching(true); // set fetching to true

      // if audio is already playing then pause
      let wasPlaying: boolean = false;

      if (audio) {
        wasPlaying = !audio.paused;
        audio.pause();
        URL.revokeObjectURL(audio.src); // Remove from memory
      }

      fetch(song.previewUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          const newAudio = new Audio(objectURL);
          newAudio.title = song.title;
          newAudio.volume = 0.4;
          if (!wasPlaying) {
            newAudio.play();
          }
          setAudio(newAudio);
          setFetching(false);
        });
    } else if (audio && !audio.paused) {
      audio.pause();
    } else if (audio && audio.paused) {
      audio.play();
    }
  }, [song?.previewUrl, audio, fetching]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(1, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
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
      {song.previewUrl === null && showModal && (
        <Modal onClose={handleModalClose} />
      )}
      <h2 className="font-bold flex items-center gap-2 underline underline-offset-4 decoration-neutral-500 hover-transition group">
        <Icons.SpotifyIcon className="h-6 ml-1 fill-green-600 group-hover:fill-neutral-900 duration-200" />
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
          <div className="flex justify-between px-2">
            <a
              className="truncate font-mono tracking-tight flex flex-col ml-2"
              href={song.externalUrl}
              target="_blank"
            >
              <span className="hover-transition">{song.title}</span>
              <span className="text-sm text-neutral-400">
                {song.artist.name}
              </span>
            </a>
            <button onClick={downloadAndPlayPause}>
              {!audio || audio?.paused ? (
                <Icons.Play className="h-6" aria-label="Play" />
              ) : (
                <Icons.Pause className="h-6" aria-label="Pause" />
              )}
            </button>
            <p className={'font-mono text-green-400 h-fit'}>
              {formatTime(Math.floor(song.progress_ms / 1000))} /{' '}
              {formatTime(Math.floor(song.duration_ms / 1000))}
            </p>
          </div>
          <div className="flex justify-center w-full px-5">
            <div className="w-full h-1 bg-neutral-600 rounded-full">
              <div
                className="h-full rounded-full bg-green-500"
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
