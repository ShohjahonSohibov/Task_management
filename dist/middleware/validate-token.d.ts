import { Response, NextFunction } from 'express';
declare const validateToken: (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default validateToken;
