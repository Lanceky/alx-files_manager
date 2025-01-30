import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check for missing email
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check for missing password
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const userCollection = dbClient.db.collection('users');

      // Check if email already exists
      const userExists = await userCollection.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exists' });
      }

      // Hash the password with SHA1
      const hashedPassword = sha1(password);

      // Insert the new user into the database
      const result = await userCollection.insertOne({ email, password: hashedPassword });

      return res.status(201).json({ id: result.insertedId, email });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
