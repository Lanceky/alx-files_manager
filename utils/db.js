import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;
    
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = database;
    this.connection = null;

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
   * @returns {Db} MongoDB database
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

const dbClient = new DBClient();
export default dbClient;
