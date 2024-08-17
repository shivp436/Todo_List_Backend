import { User } from '../model/userModel'; // Adjust the import path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
