import { Router } from 'express';

import {
  handleAddNote,
  handleDeleteNote,
  handleGetNotes,
  handleUpdateNote,
} from '../controllers/notes.controller.js';
const router: Router = Router();

router.post('/notes', handleAddNote);
router.get('/notes/:id', handleGetNotes);
router.put('/notes', handleUpdateNote);
router.post('/notes/remove', handleDeleteNote);

export default router;
