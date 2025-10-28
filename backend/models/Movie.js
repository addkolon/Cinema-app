import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  writer: {
    type: String
  },
  duration: {
    type: String,
    required: true
  },
  age: {
    type: String
  },
  releaseYear: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  bannerImgUrl: {
    type: String,
    required: true

  },
  trailerUrl: {
    type: String,
    default: ''
  },
  // UPDATED: Categories are objects with a "category" property
  categories: [{
    category: {
      type: String
    }
  }],
  // UPDATED: Stars are objects with a "name" property
  stars: [{
    name: {
      type: String
    }
  }],
  connectedUser: {
    type: String
  },
  // UPDATED: Shows structure
  shows: [{
    date: String,
    screenings: [{
      time: String,
      room: String,
      seats: [{
        seatNumber: String,
        booked: Boolean
      }]
    }]
  }]
}, {
  timestamps: true,
  collection: 'Movies'
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;