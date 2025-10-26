import React from "react";
import { useNavigate } from "react-router-dom";
import { useCarousel } from "../hooks/useCarousel";

// Move mapper outside component
const mapResponseToSlides = (data) => {
  const movies = Array.isArray(data) ? data : data.movies || data.data || [];
  return movies.map((movie) => ({
    id: movie._id,
    src: movie.posterUrl,
    thumb: movie.posterUrl,
    caption: movie.title,
    description: movie.description,
    genre: movie.genre,
    director: movie.director,
    releaseDate: movie.releaseDate,
    duration: movie.duration,
    trailerUrl: movie.trailerUrl || "", // Add trailer URL from API
  }));
};

export default function HeroSection({
  apiBase = "https://cinema-api.henrybergstrom.com/api/v1",
  endpoint = "/movies",
}) {
  const navigate = useNavigate();
  const { slides, animating, loading, error, handleNext, handlePrev } =
    useCarousel({
      apiBase,
      endpoint,
      mapResponseToSlides,
    });

  // Navigate to movie details page
  const handleBookNow = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) return <div className="hero-loading">Loading...</div>;
  if (error) return <div className="hero-error">Error: {error}</div>;
  if (!slides.length) return <div className="hero-empty">No slides</div>;

  return (
    <section className={`carousel ${animating ?? ""}`}>
      <div className="list">
        {slides.map((slide, i) => (
          <div key={slide.id ?? i} className="item">
            <img src={slide.src} alt={slide.caption ?? ""} />
            <div className="content">
              <div className="author">{slide.director}</div>
              <div className="title">{slide.caption}</div>
              <div className="topic">{slide.genre}</div>
              <div className="description">{slide.description}</div>
              <div className="buttons">
                <button onClick={() => handleBookNow(slide.id)}>
                  SEE MORE
                </button>
                {/* <button>SEE MORE</button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="thumbnails">
        {slides.map((slide, i) => (
          <div key={slide.id ?? i} className={`item ${i === 0 ? "active" : ""}`}>
            <img src={slide.thumb} alt={slide.caption ?? ""} />
            {/* <div className="content">
              <div className="title">{slide.caption}</div>
              <div className="description">{slide.genre}</div>
            </div> */}
          </div>
        ))}
      </div>

      <div className="arrows">
        <button id="prev" onClick={handlePrev}>{"<"}</button>
        <button id="next" onClick={handleNext}>{">"}</button>
      </div>
    </section>
  );
}
