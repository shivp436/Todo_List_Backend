import exress from 'express';
import { getTasks, createTask, editTask, deleteTask } from '../controllers/taskControllers';

const router = exress.Router();

router.route('/').get(getTasks).post(createTask);

router.route('/:id').put(editTask).delete(deleteTask);

module.exports = router;