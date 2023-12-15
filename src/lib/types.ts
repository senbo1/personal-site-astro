export interface Song {
    title: string,
    album: {
      name: string,
      releaseDate: string,
      image: string, 
    },
    artist: {
      name: string, 
    },
    previewUrl: string, 
    externalUrl: string,
    trackLengthMilliseconds: number, 
    progress_ms: number,
    duration_ms: number,
    currentProgress: number,
    isCurrentlyPlaying: boolean,
}