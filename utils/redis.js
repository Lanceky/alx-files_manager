import { MongoClient } from 'mongodb';

/**
 * Database Client Utility Class
 */
class DBClient {
  /**
   * Create a new MongoDB client
   */
  constructor() {
    // Get configuration from environment variables or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    // Construct MongoDB connection URL
    const url = `mongodb://${host}:${port}`;
    
    // Create MongoDB client
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = database;
    this.connection = null;

    // Establish connection
    this.connect();
  }

  /**
   * Establish connection to MongoDB
   */
  async connect() {
    try {
      this.connection = await this.client.connect();
    } catch (error) {
      console.error('MongoDB Connection Error:', error);
    }
  }

  /**
   * Check if MongoDB connection is alive
   * @returns {boolean} Connection status
   */
  isAlive() {
    return this.connection !== null;
  }

  /**
   * Get the MongoDB database instance
   * @returns {object|null} MongoDB database or null
   */
  getDb() {
    if (!this.connection) return null;
    return this.connection.db(this.dbName);
  }

  /**
   * Count number of users in the database
   * @returns {Promise<number>} Number of users
   */
  async nbUsers() {
    const db = this.getDb();
    if (!db) return 0;
    return db.collection('users').countDocuments();
  }

  /**
   * Count number of files in the database
   * @returns {Promise<number>} Number of files
   */
  async nbFiles() {
    const db = this.getDb();
    if (!db) return 0;
    return db.collection('files').countDocuments();
  }
}

// Create and export a single instance of DBClient
const dbClient = new DBClient();
export default dbClient;
