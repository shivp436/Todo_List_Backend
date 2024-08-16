import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Task from '../model/taskModel';

// @desc   Get all tasks
// @route  GET /api/tasks
// @access Private
const getTasks = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const tasks = await Task.find();
			res.status(200).json({ tasks });
		} catch (error: unknown) {
			if (error instanceof Error) {
				res
					.status(500)
					.json({ message: 'Error fetching tasks', error: error.message });
			} else {
				res.status(500).json({ message: 'Unknown error occurred' });
			}
		}
	}
);

// @desc   Create a task
// @route  POST /api/tasks
// @access Private
const createTask = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		if (!req.body.name) {
			res.status(400);
			throw new Error('Task name is required');
		}

		const task = new Task({
			name: req.body.name,
			completed: req.body.completed,
			due: req.body.due,
			priority: req.body.priority,
			list: req.body.list,
			tags: req.body.tags,
			description: req.body.description,
		});

		const createdTask = await task.save();

		res.status(201).json({ task: createdTask });
	}
);

// @desc   Edit a task
// @route  PUT /api/tasks/:id
// @access Private
const editTask = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const task = await Task.findById(req.params.id);

		if (!task) {
			res.status(400);
			throw new Error('Task not found');
		}

		const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({ task: updatedTask });
	}
);

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(400);
      throw new Error('Task not found');
    }

    await Task.findByIdAndDelete(req.params.id);

		res.status(200).json({ task: task, message: 'Task deleted' });
	}
);

export { getTasks, createTask, editTask, deleteTask };
