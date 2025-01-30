import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Basic ')) return res.status(401).json({ error: 'Unauthorized' });

    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
    const [email, password] = credentials.split(':');
    
    const user = await dbClient.db.collection('users').findOne({
      email,
      password: sha1(password),
    });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 86400);
    res.json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}

export default AuthController;