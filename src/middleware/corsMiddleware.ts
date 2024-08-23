import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import sendResponse from '../utils/responseUtils';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5500',
  'http://localhost:8080',
  'http://localhost:8000',
];

const corsMiddleware = cors({
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, isAllowed: boolean) => void
  ) => {
    if (allowedOrigins.includes(origin as string)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
});

const corsErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    sendResponse(
      res,
      403,
      'error',
      'Forbidden: Not allowed by CORS',
      {
        message: 'Not allowed by CORS',
        origin: req.headers.origin,
      }
    );
    return;
  } else {
    next(err); 
  }
};

export { corsMiddleware, corsErrorHandler };