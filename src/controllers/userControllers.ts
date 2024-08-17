import { Request, Response } from 'express';
import User from '../model/userModel';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import sendResponse from '../utils/responseUtils';
import { generateToken } from '../middleware/authMiddleware';

interface AuthenticatedRequest extends Request {
  user?: any;
  newToken?: string | undefined;
}

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { username, email, password, displayName, profilePicture } =
				req.body;
			if (!username || !email || !password) {
				sendResponse(res, 400, 'error', 'Please provide all required fields');
				return;
			}

			const userExists = await User.findOne({ email });
			if (userExists) {
				sendResponse(res, 400, 'error', 'User already exists');
				return;
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			const defaultDisplayName = displayName || username;
			const user = await User.create({
				username,
				email,
				password: hashedPassword,
				defaultDisplayName,
				profilePicture,
			});

			if (user) {
				sendResponse(res, 201, 'success', 'User registered successfully', {
					_user: {
						_id: user._id,
						username: user.username,
						email: user.email,
						displayName: user.displayName,
						profilePicture: user.profilePicture,
					},
          _token: generateToken((user._id as string).toString()),
				});
			} else {
				sendResponse(res, 400, 'error', 'Invalid user data');
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				sendResponse(
					res,
					500,
					'error',
					'Error registering user',
					error.message
				);
			} else {
				sendResponse(res, 500, 'error', 'Unknown error occurred');
			}
		}
	}
);

// @desc Login a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				sendResponse(res, 400, 'error', 'Please provide email and password');
				return;
			}

			// Find the user by email
			const user = await User.findOne({ email });
			if (!user) {
				sendResponse(res, 401, 'error', 'Invalid credentials');
				return;
			}

			// Compare passwords
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				sendResponse(res, 401, 'error', 'Incorrect password');
				return;
			}

			sendResponse(res, 200, 'success', 'Login successful', {
				_user: {
					_id: user._id,
					username: user.username,
					email: user.email,
					displayName: user.displayName,
					profilePicture: user.profilePicture,
				},
        _token: generateToken((user._id as string).toString()),
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				sendResponse(res, 500, 'error', 'Error logging in', error.message);
			} else {
				sendResponse(res, 500, 'error', 'Unknown error occurred');
			}
		}
	}
);

// @desc Get user profile
// @route GET /api/users/me
// @access Private
const getMyProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
	try {
		const user = req.user;
		const newToken = req.newToken;

		if (user) {
			sendResponse(res, 200, 'success', 'User profile retrieved successfully', {
				_user: {
					_id: user._id,
					username: user.username,
					email: user.email,
					displayName: user.displayName,
					profilePicture: user.profilePicture,
				},
        _token: newToken,
			});
		} else {
			sendResponse(res, 404, 'error', 'User not found');
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			sendResponse(
				res,
				500,
				'error',
				'Error fetching user profile',
				error.message
			);
		} else {
			sendResponse(res, 500, 'error', 'Unknown error occurred');
		}
	}
});

export { registerUser, loginUser, getMyProfile };
