export const prerender = false;

import type { APIRoute } from 'astro';
import { getCurrentlyPlayingSong } from '../lib/spotify';

export const GET: APIRoute = () => {
  return getCurrentlyPlayingSong(); 
};
