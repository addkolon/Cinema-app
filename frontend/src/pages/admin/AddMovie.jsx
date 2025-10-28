import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function AddMovie() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    director: '',
    writer: '',
    duration: '',
    age: '',
    trailerUrl: '',
    categories: '',
    releaseYear: ''
  });
  
  // Separate state for each image
  const [posterImage, setPosterImage] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle poster image selection
   */
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

  /**
   * Handle banner image selection
   */
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
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      
      // Append text fields
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('director', formData.director);
      data.append('writer', formData.writer);
      data.append('duration', formData.duration);
      data.append('age', formData.age);
      data.append('trailerUrl', formData.trailerUrl);
      data.append('categories', formData.categories);
      data.append('releaseYear', formData.releaseYear);
      
      // Append both images
      data.append('poster', posterImage);
      if (bannerImage) {
        data.append('banner', bannerImage);
      }

      const response = await fetch('http://localhost:8888/api/movies', {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create movie');
      }

      const result = await response.json();
      console.log('✅ Movie created:', result);

      alert('Movie created successfully!');
      navigate('/');

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie-page">
      <h1>Add New Movie</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="add-movie-form">
        
        {/* Poster Image Upload */}
        <div className="form-group">
          <label htmlFor="poster">Movie Poster * (Vertical)</label>
          <input
            type="file"
            id="poster"
            accept="image/*"
            onChange={handlePosterChange}
            required
          />
          {posterPreview && (
            <div className="image-preview">
              <p>Poster Preview:</p>
              <img src={posterPreview} alt="Poster Preview" />
            </div>
          )}
        </div>

        {/* Banner Image Upload */}
        <div className="form-group">
          <label htmlFor="banner">Banner Image (Horizontal - Optional)</label>
          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={handleBannerChange}
          />
          {bannerPreview && (
            <div className="image-preview banner-preview">
              <p>Banner Preview:</p>
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

        {/* Submit Button */}
        <button type="submit" disabled={loading || !posterImage}>
          {loading ? 'Creating...' : 'Create Movie'}
        </button>
      </form>
    </div>
  );
}