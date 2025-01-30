import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import sha1 from 'sha1'; // For hashing passwords
import dbClient from '../utils/db';

class UsersController {
  /**
   * Creates a new user
   * @param {Request} req
   * @param {Response} res
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const db = dbClient.client.db(dbClient.dbName);

      // Check if the email already exists
      const userExists = await db.collection('users').findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password and save the user
      const hashedPassword = sha1(password);
      const newUser = {
        email,
        password: hashedPassword,
      };

      const result = await db.collection('users').insertOne(newUser);

      return res.status(201).json({ id: result.insertedId, email });
    } catch (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
