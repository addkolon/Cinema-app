import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8888/api/movies/${id}`);

        if (!response.ok) {
          throw new Error("Movie not found");
        }

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Update page title when movie loads
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} (${movie.releaseYear}) - Cinema App`;
    }
    
    // Cleanup: Reset title when component unmounts
    return () => {
      document.title = 'Cinema App';
    };
  }, [movie]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowTrailer(false);
      }
    };

    if (showTrailer) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showTrailer]);

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return <div className="movie-detail-loading">Loading movie details...</div>;
  }

  if (error) {
    return (
      <div className="movie-detail-error">
        <h2>Error: {error}</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  if (!movie) {
    return <div className="movie-detail-error">Movie not found</div>;
  }

  const youtubeId = getYouTubeId(movie.trailerUrl);

  return (
    <div className="movie-detail">
      {/* Banner Background */}
      <div
        className="movie-banner"
        style={{ backgroundImage: `url(${movie.bannerImgUrl})` }}
      >
        <div className="banner-overlay"></div>
      </div>

      <div className="movie-content">
        <div className="movie-poster">
          <img src={movie.imageUrl} alt={movie.title} />
        </div>

        <div className="movie-info">
          <h1>{movie.title}</h1>

          <div className="movie-meta">
            <span className="release-year">{movie.releaseYear}</span>
            <span className="duration">{movie.duration}</span>
            <span className="age-rating">{movie.age}</span>
          </div>

          <div className="movie-categories">
            {movie.categories?.map((cat, index) => (
              <span key={index} className="category-tag">
                {cat.category}
              </span>
            ))}
          </div>

          <div className="movie-description">
            <h2>Synopsis</h2>
            <p>{movie.description}</p>
          </div>

          <div className="movie-credits">
            <div className="credit-item">
              <strong>Director:</strong> {movie.director}
            </div>
            {movie.writer && (
              <div className="credit-item">
                <strong>Writer:</strong> {movie.writer}
              </div>
            )}
          </div>

          {movie.stars?.length > 0 && (
            <div className="movie-stars">
              <h3>Cast</h3>
              <div className="stars-list">
                {movie.stars.map((star, index) => (
                  <span key={index} className="star-name">
                    {star.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="movie-actions">
            {movie.trailerUrl && (
              <button
                className="btn-trailer"
                onClick={() => setShowTrailer(true)}
              >
                ▶ Watch Trailer
              </button>
            )}
            <button
              className="btn-book"
              onClick={() => navigate(`/booking/${id}`)}
            >
              Book Tickets
            </button>
            <button className="btn-back" onClick={() => navigate("/")}>
              ← Back
            </button>
          </div>

          {movie.shows?.length > 0 && (
            <div className="movie-showtimes">
              <h3>Showtimes</h3>
              {movie.shows.map((show, index) => (
                <div key={index} className="showtime-date">
                  <h4>{show.date}</h4>
                  <div className="screenings">
                    {show.screenings.map((screening, idx) => (
                      <div key={idx} className="screening-time">
                        <span className="time">{screening.time}</span>
                        <span className="room">{screening.room}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && youtubeId && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="trailer-close" 
              onClick={() => setShowTrailer(false)}
              aria-label="Close trailer"
            >
              ✕
            </button>
            <div className="trailer-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}