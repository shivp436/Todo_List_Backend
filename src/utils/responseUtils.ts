// utils/responseHelper.ts
import { Response } from 'express';

type ApiResponse = {
  status: 'success' | 'error';
  code: number;
  message: string;
  data?: any;
}

const sendResponse = (res: Response, statusCode: number, status: 'success' | 'error', message: string, data?: any) => {
  const response: ApiResponse = {
    status,
    code: statusCode,
    message,
    data,
  };
  
  res.status(200).json(response);
};

export default sendResponse;