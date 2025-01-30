import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create a Redis client instance
    this.client = createClient();

    // Handle Redis client errors
    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });
  }

  /**
   * Check if the Redis client is connected
   * @returns {boolean} True if connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value associated with a given key
   * @param {string} key - The key to retrieve
   * @returns {Promise<string | null>} The value stored in Redis, or null if not found
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
  }

  /**
   * Set a key-value pair in Redis with an expiration
   * @param {string} key - The key to set
   * @param {string | number} value - The value to store
   * @param {number} duration - Expiration time in seconds
   * @returns {Promise<boolean>} True if successful
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  /**
   * Delete a key-value pair from Redis
   * @param {string} key - The key to delete
   * @returns {Promise<boolean>} True if successful
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}

// Create and export a RedisClient instance
const redisClient = new RedisClient();
export default redisClient;
