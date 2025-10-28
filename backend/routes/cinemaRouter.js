import express from 'express';
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../controllers/cinemaController.js';
import { upload } from '../config/upload.js';

const router = express.Router();

router.get('/api/movies', getAllMovies);
router.get('/api/movies/:id', getMovieById);
router.post('/api/movies', upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), createMovie);
router.put('/api/movies/:id', upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), updateMovie);
router.delete('/api/movies/:id', deleteMovie);

export default router;