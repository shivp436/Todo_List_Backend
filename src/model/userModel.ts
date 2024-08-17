import mongoose, { Schema, Document } from 'mongoose';

type User = Document & {
	username: string;
	password: string;
	email: string;
	displayName: string;
	profilePicture?: string;
};

const usernamePattern = /^[a-z0-9_]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateImageUrl = (url: string): boolean => {
	const imageUrlPattern = /\.(jpeg|jpg|png|gif)$/i;
	const urlPattern =
		/^(https?:\/\/)?((([a-zA-Z0-9\-_]+\.)+[a-zA-Z]{2,})|localhost)(\/[a-zA-Z0-9\-_\.\/?=&]*)?$/i;

	return urlPattern.test(url) && imageUrlPattern.test(url);
};

const userSchema = new Schema<User>({
	username: {
		type: String,
		required: [true, 'Username is required'],
		unique: true,
		minlength: 3,
		maxlength: 20,
		match: [
			usernamePattern,
			'Username can only contain lowercase letters, numbers, and underscores',
		],
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		match: [emailPattern, 'Please enter a valid email address'],
	},
	displayName: {
		type: String,
		required: true,
		minlength: [3, 'Display name must be at least 3 characters long'],
		maxlength: [20, 'Display name cannot exceed 20 characters'],
    default: function() {
      return this.username;
    }
	},
	profilePicture: {
		type: String,
		validate: {
			validator: (url: string) => !url || validateImageUrl(url),
			message:
				'Profile picture URL must be a valid image URL (JPEG, PNG, GIF)',
		},
	},
}, {
  timestamps: true,
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
