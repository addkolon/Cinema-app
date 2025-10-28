import React from "react";
import { useNavigate } from "react-router-dom";
import { useCarousel } from "../hooks/useCarousel";

// Updated mapper to match YOUR MongoDB structure
const mapResponseToSlides = (data) => {
  const movies = Array.isArray(data) ? data : data.movies || data.data || [];
  
  console.log('🎬 Raw movie data:', movies[0]);
  
  return movies.map((movie) => {
    // Extract category strings from objects: [{ category: "Drama" }] → ["Drama"]
    const categories = movie.categories?.map(cat => cat.category) || [];
    
    console.log('📦 Extracted categories:', categories);
    
    return {
      id: movie._id,
      src: movie.bannerImgUrl,
      thumb: movie.imageUrl,
      caption: movie.title,
      description: movie.description,
      categories: categories, // Now it's an array of strings!
      director: movie.director,
      releaseYear: movie.releaseYear,
      duration: movie.duration,
      trailerUrl: movie.trailerUrl || "",
    };
  });
};

export default function HeroSection({
  apiBase = import.meta.env.VITE_API_URL || "http://localhost:8888/api",
  endpoint = "/movies",
}) {
  const navigate = useNavigate();
  const { slides, animating, loading, error, handleNext, handlePrev } =
    useCarousel({
      apiBase,
      endpoint,
      mapResponseToSlides,
    });

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
              <div className="topic">
                {slide.categories?.map((category, index) => (
                  <span key={index} className="category-badge">
                    {category}
                  </span>
                ))}
                {!slide.categories?.length && "Unknown"}
              </div>
              <div className="description">{slide.description}</div>
              <div className="buttons">
                <button onClick={() => handleBookNow(slide.id)}>
                  SEE MORE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="thumbnails">
        {slides.map((slide, i) => (
          <div
            key={slide.id ?? i}
            className={`item ${i === 0 ? "active" : ""}`}
          >
            <img src={slide.thumb} alt={slide.caption ?? ""} />
          </div>
        ))}
      </div>

      <div className="arrows">
        <button id="prev" onClick={handlePrev}>
          {"<"}
        </button>
        <button id="next" onClick={handleNext}>
          {">"}
        </button>
      </div>
    </section>
  );
}
