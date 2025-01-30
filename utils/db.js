import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    this.connected = false;
    this.client = new MongoClient(`mongodb://${DB_HOST}:${DB_PORT}`, {
      useUnifiedTopology: true,
    });
    this.client.connect((err) => {
      if (!err) this.connected = true;
    });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    return this.client.db(DB_DATABASE).collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db(DB_DATABASE).collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;