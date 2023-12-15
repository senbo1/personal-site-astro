import "dotenv/config";

async function getAccessToken(): Promise<{ access_token: string }> {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN as string;
  const clientId = process.env.SPOTIFY_CLIENT_ID as string;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET as string;
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  // add valibot parsing
  const { access_token } = await response.json();

  return { access_token };
}

let accesstoken: undefined | string = undefined;

export async function getCurrentlyPlayingSong() {
  if (!accesstoken) {
    const { access_token } = await getAccessToken();
    accesstoken = access_token;
  }

  const response = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    }
  );
  
  // if the access token is expired, get a new one and try again
  if (response.status === 401) {
    accesstoken = undefined;
    return getCurrentlyPlayingSong();
  } else if (response.status === 204) { // If no song is playing
    return new Response(null, { status: 204 });
  } else if (response.status === 429) {
    return new Response(JSON.stringify("No Song is Playing"), { status: 429 });
  }

  const song = await response.json();

  const currentSong = {
    title: song.item.name,
    album: {
      name: song.item.album.name,
      releaseDate: song.item.album.release_date,
      image: song.item.album.images[0].url,
    },
    artist: {
      name: song.item.artists[0].name,
    },
    previewUrl: song.item.preview_url,
    externalUrl: song.item.external_urls.spotify,
    trackLengthMilliseconds: song.item.duration_ms,
    progress_ms: song.progress_ms,
    duration_ms: song.item.duration_ms,
    currentProgress: song.progress_ms / song.item.duration_ms,
    isCurrentlyPlaying: song.is_playing,
  };
  return new Response(JSON.stringify(currentSong));
}
