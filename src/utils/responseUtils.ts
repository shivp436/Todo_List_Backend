// utils/responseHelper.ts
import { Response } from 'express';

type ApiResponse = {
  category: 'success' | 'error';
  code: number;
  message: string;
  data?: any;
}

const sendResponse = (res: Response, statusCode: number, category: 'success' | 'error', message: string, data?: any) => {
  const response: ApiResponse = {
    category,
    code: statusCode,
    message,
    data,
  };
  
  res.status(statusCode).json(response);
};

export default sendResponse;