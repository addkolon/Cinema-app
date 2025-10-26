const TMDB_API_KEY = 'f66b7af8e5d18b04b3881245eea3cf2c'; // Replace with your key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Search for a movie on TMDB by title
 * Returns the first matching movie with its TMDB ID
 */
export async function searchMovie(title) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await response.json();
    return data.results[0]; // Return first match
  } catch (error) {
    console.error('Error searching movie:', error);
    return null;
  }
}

/**
 * Get trailer URL for a movie by TMDB ID
 * Returns YouTube URL or null
 */
export async function getMovieTrailer(tmdbId) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    
    // Find trailer (prefer official trailers)
    const trailer = data.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return null;
  }
}

/**
 * Combined function: search movie and get trailer in one call
 */
export async function findTrailerByTitle(title) {
  const movie = await searchMovie(title);
  if (!movie) return null;
  
  return await getMovieTrailer(movie.id);
}