const userQueue = require('../worker');  // Queue for user-related jobs

// Create a new user and send welcome email
exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await User.create({ email, password });

    // Add job to the Bull queue for sending a welcome email
    userQueue.add({ userId: newUser.id });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
