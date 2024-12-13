import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Handle connection errors
    this.client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
  }

  /**
   * Check if the Redis connection is alive
   * @returns {boolean} Connection status
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get a value from Redis by key
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} The value associated with the key
   */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  /**
   * Set a key-value pair in Redis with an expiration
   * @param {string} key - The key to set
   * @param {*} value - The value to store
   * @param {number} duration - Expiration time in seconds
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    const setAsync = promisify(this.client.setex).bind(this.client);
    return setAsync(key, duration, value);
  }

  /**
   * Delete a key from Redis
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    return delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
