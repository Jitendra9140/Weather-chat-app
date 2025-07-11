import jwt from 'jsonwebtoken';
import User from '../schemas/userSchema.js';

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'weatherchat-secret-key');
    
    // Find user in database to ensure they exist
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found or invalid token.' });
    }
    
    // Add user from payload to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};