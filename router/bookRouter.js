import express from 'express';
import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} from '../controllers/bookController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all book routes
router.use(protect);

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
