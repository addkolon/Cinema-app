import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrailerModal from "../components/TrailerModal";
import { findTrailerByTitle } from "../utils/tmdbApi";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  // Fetch movie details
  useEffect(() => {
    fetch(`https://cinema-api.henrybergstrom.com/api/v1/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch trailer when "Watch Trailer" is clicked
  const handleWatchTrailer = async () => {
    // If already have trailer URL (from API or previous fetch), just show modal
    if (movie.trailerUrl || trailerUrl) {
      setShowTrailer(true);
      return;
    }

    // Otherwise, fetch from TMDB
    setLoadingTrailer(true);
    const fetchedTrailer = await findTrailerByTitle(movie.title);
    setTrailerUrl(fetchedTrailer);
    setLoadingTrailer(false);
    setShowTrailer(true);
  };

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className="movie-hero" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
        <div className="movie-overlay">
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span>{movie.genre}</span>
              <span>{movie.duration} min</span>
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
            <p className="director">Directed by {movie.director}</p>
            <p className="description">{movie.description}</p>
            
            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={handleWatchTrailer}
                disabled={loadingTrailer}
              >
                {loadingTrailer ? "Loading Trailer..." : "▶ Watch Trailer"}
              </button>
              <button className="btn-secondary">Book Tickets</button>
            </div>
          </div>
        </div>
      </div>

      <div className="details-content">
        <section className="synopsis">
          <h2>Synopsis</h2>
          <p>{movie.description}</p>
        </section>

        <section className="info-grid">
          <div className="info-item">
            <h3>Director</h3>
            <p>{movie.director}</p>
          </div>
          <div className="info-item">
            <h3>Genre</h3>
            <p>{movie.genre}</p>
          </div>
          <div className="info-item">
            <h3>Duration</h3>
            <p>{movie.duration} minutes</p>
          </div>
          <div className="info-item">
            <h3>Release Date</h3>
            <p>{new Date(movie.releaseDate).toLocaleDateString()}</p>
          </div>
        </section>
      </div>

      {/* Trailer Modal - use API trailer or TMDB-fetched trailer */}
      {showTrailer && (
        <TrailerModal
          trailerUrl={movie.trailerUrl || trailerUrl}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}