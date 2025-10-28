import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function MovieList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Movie List - Admin';
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8888/api/movies');
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId, movieTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${movieTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8888/api/movies/${movieId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      alert('Movie deleted successfully!');
      fetchMovies(); // Refresh list
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading movies...</div>;
  }

  if (error) {
    return <div className="admin-error">Error: {error}</div>;
  }

  return (
    <div className="movie-list-page">
      <div className="admin-header">
        <h1>Manage Movies</h1>
        <button 
          className="btn-add-new"
          onClick={() => navigate('/admin/addMovie')}
        >
          + Add New Movie
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="no-movies">
          <p>No movies found. Add your first movie!</p>
          <button onClick={() => navigate('/admin/addMovie')}>
            Add Movie
          </button>
        </div>
      ) : (
        <div className="movies-table">
          <table>
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Director</th>
                <th>Year</th>
                <th>Duration</th>
                <th>Categories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td className="movie-poster-cell">
                    <img 
                      src={movie.imageUrl} 
                      alt={movie.title}
                      className="movie-thumbnail"
                    />
                  </td>
                  <td className="movie-title-cell">
                    <strong>{movie.title}</strong>
                  </td>
                  <td>{movie.director}</td>
                  <td>{movie.releaseYear}</td>
                  <td>{movie.duration}</td>
                  <td className="categories-cell">
                    {movie.categories?.map((cat, idx) => (
                      <span key={idx} className="category-badge-small">
                        {cat.category}
                      </span>
                    ))}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/movie/${movie.slug || movie._id}`)}
                      title="View Movie"
                    >
                      👁️ View
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/editMovie/${movie._id}`)}
                      title="Edit Movie"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(movie._id, movie.title)}
                      title="Delete Movie"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-footer">
        <button onClick={() => navigate('/')} className="btn-back-home">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}