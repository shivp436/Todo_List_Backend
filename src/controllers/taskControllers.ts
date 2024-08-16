import { Request, Response } from 'express';
import { fetchTasks } from '../helpers/dummyFuncs';
import asyncHandler from 'express-async-handler';

// @desc   Get all tasks
// @route  GET /api/tasks
// @access Private
const getTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await fetchTasks();
    res.status(200).json({ tasks });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
});

// @desc   Create a task
// @route  POST /api/tasks
// @access Private
const createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Task text is required');
  }

  res.status(201).json({ message: 'Task created' });
});

// @desc   Edit a task
// @route  PUT /api/tasks/:id
// @access Private
const editTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: `Task updated with ID: ${req.params.id}` });
});

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: `Task deleted with ID: ${req.params.id}` });
});

export { getTasks, createTask, editTask, deleteTask };
