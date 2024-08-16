import mongoose from 'mongoose';
import colors from 'colors';  // Import colors library

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(colors.red(`Error: ${error.message}`));
    } else {
      console.error(colors.red('Unknown error occurred'));
    }
    process.exit(1);
  }
}

export { connectDB };
