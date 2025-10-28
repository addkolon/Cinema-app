// IMPORTS
import Movie from '../models/Movie.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8888';


/**
 * Get all movies from MongoDB
 */
export async function getAllMovies(req, res) {
  try {
    console.log('🎬 Fetching movies from MongoDB...');
    
    const movies = await Movie.find({});
    
    // Transform imageUrl to full URL on the fly
    const moviesWithFullUrls = movies.map(movie => {
      const movieObj = movie.toObject();
      
      // Only add BASE_URL if it's a relative path
      if (movieObj.imageUrl && !movieObj.imageUrl.startsWith('http')) {
        movieObj.imageUrl = `${BASE_URL}${movieObj.imageUrl}`;
      }
      
      if (movieObj.bannerImgUrl && !movieObj.bannerImgUrl.startsWith('http')) {
        movieObj.bannerImgUrl = `${BASE_URL}${movieObj.bannerImgUrl}`;
      }
      
      return movieObj;
    });
    
    console.log(`✅ Retrieved ${movies.length} movies`);
    res.json(moviesWithFullUrls);
  } catch (error) {
    console.error('❌ Error fetching movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies from database' });
  }
}

/**
 * Get a single movie by ID
 */
export async function getMovieById(req, res) {
  try {
    const { id } = req.params;
    console.log('🎬 Fetching movie with id:', id);
    
    const movie = await Movie.findById(id).catch(() => null) || 
                  await Movie.findOne({ id: parseInt(id) });
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    // Transform to full URLs
    const movieObj = movie.toObject();
    
    if (movieObj.imageUrl && !movieObj.imageUrl.startsWith('http')) {
      movieObj.imageUrl = `${BASE_URL}${movieObj.imageUrl}`;
    }
    
    if (movieObj.bannerImgUrl && !movieObj.bannerImgUrl.startsWith('http')) {
      movieObj.bannerImgUrl = `${BASE_URL}${movieObj.bannerImgUrl}`;
    }
    
    console.log('✅ Found movie:', movie.title);
    res.json(movieObj);
  } catch (error) {
    console.error('❌ Error fetching movie:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
}

/**
 * Create a new movie with image upload
 */
export async function createMovie(req, res) {
  try {
    console.log('📝 Creating new movie...');
    console.log('🖼️ Uploaded files:', req.files);
    
    const { title, description, director, writer, duration, age, trailerUrl, categories, releaseYear } = req.body;
    
    if (!req.files || !req.files.poster) {
      return res.status(400).json({ error: 'Poster image is required' });
    }
    
    // Store RELATIVE paths in database (dynamic!)
    const imageUrl = `/uploads/movies/${req.files.poster[0].filename}`;
    const bannerImgUrl = req.files.banner 
      ? `/uploads/movies/${req.files.banner[0].filename}`
      : imageUrl;
    
    const categoriesArray = categories 
      ? categories.split(',').map(cat => ({ category: cat.trim() }))
      : [];
    
    const newMovie = new Movie({
      title,
      description,
      director,
      writer,
      duration,
      age,
      imageUrl,      // Relative path stored
      bannerImgUrl,  // Relative path stored
      trailerUrl: trailerUrl || '',
      categories: categoriesArray,
      connectedUser: 'Admin',
      shows: [],
      releaseYear
    });
    
    await newMovie.save();
    
    console.log('✅ Movie created:', newMovie);
    
    // Return with full URLs
    const responseMovie = newMovie.toObject();
    responseMovie.imageUrl = `${BASE_URL}${responseMovie.imageUrl}`;
    responseMovie.bannerImgUrl = `${BASE_URL}${responseMovie.bannerImgUrl}`;
    
    res.status(201).json({
      message: 'Movie created successfully!',
      movie: responseMovie
    });
    
  } catch (error) {
    console.error('❌ Error creating movie:', error.message);
    res.status(500).json({ error: 'Failed to create movie: ' + error.message });
  }
}

/**
 * Delete a movie
 */
export async function deleteMovie(req, res) {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting movie with id:', id);
    
    // Find by _id or slug
    const movie = await Movie.findById(id).catch(() => null) || 
                  await Movie.findOne({ slug: id });
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    await movie.deleteOne();
    
    console.log('✅ Movie deleted:', movie.title);
    res.json({ message: 'Movie deleted successfully', movie });
  } catch (error) {
    console.error('❌ Error deleting movie:', error.message);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
}

/**
 * Update a movie
 */
export async function updateMovie(req, res) {
  try {
    const { id } = req.params;
    console.log('📝 Updating movie with id:', id);
    console.log('📦 Request body:', req.body);
    console.log('🖼️ Uploaded files:', req.files);
    
    // Find existing movie
    const movie = await Movie.findById(id).catch(() => null) || 
                  await Movie.findOne({ slug: id });
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    const { title, description, director, writer, duration, age, releaseYear, trailerUrl, categories } = req.body;
    
    // Update text fields
    movie.title = title;
    movie.description = description;
    movie.director = director;
    movie.writer = writer;
    movie.duration = duration;
    movie.age = age;
    movie.releaseYear = parseInt(releaseYear);
    movie.trailerUrl = trailerUrl || '';
    
    // Update categories
    movie.categories = categories 
      ? categories.split(',').map(cat => ({ category: cat.trim() }))
      : [];
    
    // Update images only if new ones were uploaded
    if (req.files && req.files.poster) {
      movie.imageUrl = `/uploads/movies/${req.files.poster[0].filename}`;
    }
    
    if (req.files && req.files.banner) {
      movie.bannerImgUrl = `/uploads/movies/${req.files.banner[0].filename}`;
    }
    
    // Save updated movie
    await movie.save();
    
    console.log('✅ Movie updated:', movie.title);
    
    // Return with full URLs
    const responseMovie = movie.toObject();
    responseMovie.imageUrl = `${BASE_URL}${responseMovie.imageUrl}`;
    responseMovie.bannerImgUrl = `${BASE_URL}${responseMovie.bannerImgUrl}`;
    
    res.json({
      message: 'Movie updated successfully!',
      movie: responseMovie
    });
    
  } catch (error) {
    console.error('❌ Error updating movie:', error.message);
    res.status(500).json({ error: 'Failed to update movie: ' + error.message });
  }
}