import pino from 'pino';
import dayjs from 'dayjs';
import pretty from 'pino-pretty';

// Define the custom timestamp format
const timestamp = () => `,"time":"${dayjs().format()}"`;

// Configure pino-pretty options
const prettyOptions = {
  colorize: true,  // Colorize the output
  levelFirst: true, // Print log level before the message
  translateTime: 'SYS:standard', // Format the timestamp
};

// Create the pino logger with pino-pretty
const log = pino(
  {
    base: { pid: false },
    timestamp,
  },
  pretty(prettyOptions)
);

export default log;
