import { Hono } from 'hono';
import {
  createRestroom,
  getAllRestrooms,
  getRestroomsByBounds,
  getRestroomById,
  updateRestroom,
  deleteRestroom,
  getRestroomCount,
} from '../modules/restrooms/restroom.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const restroomRoutes = new Hono();

// GET all restrooms
restroomRoutes.get('/', getAllRestrooms);

// GET restrooms by bounds (for map viewport)
restroomRoutes.get('/bounds', getRestroomsByBounds);

// GET restroom count
restroomRoutes.get('/count', getRestroomCount);

// GET single restroom
restroomRoutes.get('/:id', getRestroomById);

// CREATE restroom
restroomRoutes.post('/', authMiddleware, createRestroom);

// UPDATE restroom
restroomRoutes.put('/:id', authMiddleware, updateRestroom);

// DELETE restroom
restroomRoutes.delete('/:id', authMiddleware, deleteRestroom);

export default restroomRoutes;
