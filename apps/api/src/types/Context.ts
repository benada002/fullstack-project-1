import { Request, Response } from 'express';
import JwtPayload from './JwtPayload';

export default interface Context {
  req: Request;
  res: Response;
  payload?: JwtPayload;
}
