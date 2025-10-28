import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    director: '',
    writer: '',
    duration: '',
    age: '',
    releaseYear: '',
    trailerUrl: '',
    categories: ''
  });
  
  const [posterImage, setPosterImage] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing movie data
  useEffect(() => {
    document.title = 'Edit Movie - Admin';
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8888/api/movies/${id}`);
      
      if (!response.ok) {
        throw new Error('Movie not found');
      }
      
      const movie = await response.json();
      
      // Populate form with existing data
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        director: movie.director || '',
        writer: movie.writer || '',
        duration: movie.duration || '',
        age: movie.age || '',
        releaseYear: movie.releaseYear || '',
        trailerUrl: movie.trailerUrl || '',
        categories: movie.categories?.map(cat => cat.category).join(', ') || ''
      });
      
      // Set existing images as previews
      setPosterPreview(movie.imageUrl);
      setBannerPreview(movie.bannerImgUrl);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setPosterImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setBannerImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const data = new FormData();
      
      // Append all text fields
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('director', formData.director);
      data.append('writer', formData.writer);
      data.append('duration', formData.duration);
      data.append('age', formData.age);
      data.append('releaseYear', formData.releaseYear);
      data.append('trailerUrl', formData.trailerUrl);
      data.append('categories', formData.categories);
      
      // Only append images if new ones were selected
      if (posterImage) {
        data.append('poster', posterImage);
      }
      if (bannerImage) {
        data.append('banner', bannerImage);
      }

      const response = await fetch(`http://localhost:8888/api/movies/${id}`, {
        method: 'PUT',
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update movie');
      }

      const result = await response.json();
      console.log('✅ Movie updated:', result);

      alert('Movie updated successfully!');
      navigate('/admin/movieList');

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="add-movie-page"><h1>Loading movie...</h1></div>;
  }

  if (error && !formData.title) {
    return (
      <div className="add-movie-page">
        <h1>Error</h1>
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/admin/movieList')}>
          Back to Movie List
        </button>
      </div>
    );
  }

  return (
    <div className="add-movie-page">
      <h1>Edit Movie</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="add-movie-form">
        
        {/* Poster Image */}
        <div className="form-group">
          <label htmlFor="poster">Movie Poster (Vertical) - Leave empty to keep current</label>
          <input
            type="file"
            id="poster"
            accept="image/*"
            onChange={handlePosterChange}
          />
          {posterPreview && (
            <div className="image-preview">
              <p>Current/New Poster:</p>
              <img src={posterPreview} alt="Poster Preview" />
            </div>
          )}
        </div>

        {/* Banner Image */}
        <div className="form-group">
          <label htmlFor="banner">Banner Image (Horizontal) - Leave empty to keep current</label>
          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={handleBannerChange}
          />
          {bannerPreview && (
            <div className="image-preview banner-preview">
              <p>Current/New Banner:</p>
              <img src={bannerPreview} alt="Banner Preview" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Release Year */}
        <div className="form-group">
          <label htmlFor="releaseYear">Release Year *</label>
          <input
            type="text"
            id="releaseYear"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            placeholder="2024"
            min="1900"
            max="2100"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        {/* Director */}
        <div className="form-group">
          <label htmlFor="director">Director *</label>
          <input
            type="text"
            id="director"
            name="director"
            value={formData.director}
            onChange={handleChange}
            required
          />
        </div>

        {/* Writer */}
        <div className="form-group">
          <label htmlFor="writer">Writer</label>
          <input
            type="text"
            id="writer"
            name="writer"
            value={formData.writer}
            onChange={handleChange}
          />
        </div>

        {/* Duration */}
        <div className="form-group">
          <label htmlFor="duration">Duration (e.g., "120 mins") *</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="120 mins"
            required
          />
        </div>

        {/* Age Rating */}
        <div className="form-group">
          <label htmlFor="age">Age Rating</label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="15 år"
          />
        </div>

        {/* Categories */}
        <div className="form-group">
          <label htmlFor="categories">Categories (comma-separated)</label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            placeholder="Drama, Comedy, Action"
          />
        </div>

        {/* Trailer URL */}
        <div className="form-group">
          <label htmlFor="trailerUrl">Trailer URL</label>
          <input
            type="url"
            id="trailerUrl"
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
          />
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Update Movie'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/movieList')}
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}