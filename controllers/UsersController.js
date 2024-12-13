import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  /**
   * Get the status of Redis and MongoDB connections
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @returns {express.Response} JSON response with connection statuses
   */
  static getStatus(req, res) {
    return res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive()
    });
  }

  /**
   * Get the number of users and files in the database
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @returns {Promise<express.Response>} JSON response with user and file counts
   */
  static async getStats(req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    
    return res.status(200).json({ users, files });
  }
}

export default AppController;
