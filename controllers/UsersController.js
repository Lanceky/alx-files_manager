import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db'; // MongoDB client

class UsersController {
  // POST /users (Create new user)
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validate email and password
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const userCollection = dbClient.db.collection('users');

      // Check if the email already exists
      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Create new user with hashed password
      const hashedPassword = sha1(password);
      const newUser = {
        email,
        password: hashedPassword,
      };

      // Insert new user into the database
      const result = await userCollection.insertOne(newUser);

      // Return the new user (only email and id)
      return res.status(201).json({
        id: result.insertedId.toString(),
        email: result.ops[0].email,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
