import exress from 'express';
import { getTasks, createTask, editTask, deleteTask } from '../controllers/taskControllers';
import { protect } from '../middleware/authMiddleware';

const router = exress.Router();

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').put(protect, editTask).delete(protect, deleteTask);

export default router;