import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';

const validateToken = (req: any, res: Response, next: NextFunction) => {
  // Get token from authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify token and check expiration
  jwt.verify(token, process.env.JWT_SECRET_KEY || 'secretKey', (err: VerifyErrors | null, decoded: JwtPayload | undefined) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' }); // Generic error for other verification errors
    }
    req.user = decoded

    // Token is valid and not expired, continue to next middleware
    next();
  });
};

export default validateToken;
