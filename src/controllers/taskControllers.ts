import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Task from '../model/taskModel';
import User from '../model/userModel';
import sendResponse from '../utils/responseUtils';

interface AuthenticatedRequest extends Request {
	user?: any;
  newToken?: string | undefined;
}

// @desc   Get all tasks
// @route  GET /api/tasks
// @access Private
const getTasks = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			const tasks = await Task.find({ user: req.user?._id });
			sendResponse(res, 200, 'success', 'Tasks retrieved successfully', {
				_tasks: tasks,
        _token: req.newToken,
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				sendResponse(res, 500, 'error', 'Error fetching tasks', error.message);
			} else {
				sendResponse(res, 500, 'error', 'Unknown error occurred');
			}
		}
	}
);

// @desc   Create a task
// @route  POST /api/tasks
// @access Private
const createTask = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			if (!req.body.name) {
				sendResponse(res, 400, 'error', 'Task name is required');
				return;
			}

			const task = new Task({
				name: req.body.name,
				completed: req.body.completed,
				due: req.body.due,
				priority: req.body.priority,
				list: req.body.list,
				tags: req.body.tags,
				description: req.body.description,
				user: req.user?._id,
			});

			const createdTask = await task.save();
			sendResponse(res, 201, 'success', 'Task created successfully', {
				_task: createdTask,
        _token: req.newToken,
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				sendResponse(res, 500, 'error', 'Error creating task', error.message);
			} else {
				sendResponse(res, 500, 'error', 'Unknown error occurred');
			}
		}
	}
);

// @desc   Edit a task
// @route  PUT /api/tasks/:id
// @access Private
const editTask = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			const task = await Task.findById(req.params.id);
			if (!task) {
				sendResponse(res, 404, 'error', 'Task not found');
				return;
			}

			const user = await User.findById(req.user?._id);
			if (!user) {
				sendResponse(res, 401, 'error', 'User not found');
				return;
			}

			if (task.user.toString() !== (user._id as String).toString()) {
				sendResponse(
					res,
					403,
					'error',
					'You are not authorized to edit this task'
				);
				return;
			}

			const updatedTask = await Task.findByIdAndUpdate(
				req.params.id,
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);

			sendResponse(res, 200, 'success', 'Task updated successfully', {
				_task: updatedTask,
        _token: req.newToken,
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				sendResponse(res, 500, 'error', 'Error updating task', error.message);
			} else {
				sendResponse(res, 500, 'error', 'Unknown error occurred');
			}
		}
	}
);

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			const task = await Task.findById(req.params.id);
			if (!task) {
				sendResponse(res, 404, 'error', 'Task not found');
				return;
			}

			const user = await User.findById(req.user?._id);
			if (!user) {
				sendResponse(res, 401, 'error', 'User not found');
				return;
			}

			if (task.user.toString() !== (user._id as String).toString()) {
				sendResponse(
					res,
					403,
					'error',
					'You are not authorized to delete this task'
				);
				return;
			}

			await Task.findByIdAndDelete(req.params.id);
			sendResponse(res, 200, 'success', 'Task deleted successfully', { 
        _task : task,
        _token: req.newToken,
      });
		} catch (error: unknown) {
			if (error instanceof Error) {
				sendResponse(res, 500, 'error', 'Error deleting task', error.message);
			} else {
				sendResponse(res, 500, 'error', 'Unknown error occurred');
			}
		}
	}
);

export { getTasks, createTask, editTask, deleteTask };
