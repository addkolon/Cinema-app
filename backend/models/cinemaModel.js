import Movie from './Movie.js';

import dotenv from 'dotenv';
dotenv.config();

// const CINEMA_API_URL = process.env.CINEMA_API_URL;

async function getAllMovies() {
  try {
    console.log('🎬 Fetching movies from MongoDB...');
    console.log('📊 Database:', Movie.db.name);
    console.log('📊 Collection:', Movie.collection.name);

    // Fetch all movies from the database
    const movies = await Movie.find({});

    console.log(`✅ Retrieved ${movies.length} movies from the database.`);
     console.log('📦 First movie FULL:', JSON.stringify(movies[0], null, 2));
    return movies;
  
  } catch (error) {
    console.error('❌ Error fetching movies:', error.message);
    throw new Error('Failed to fetch movies from the database');
  }
}

export {
  getAllMovies
}