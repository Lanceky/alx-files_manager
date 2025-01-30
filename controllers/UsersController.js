const crypto = require('crypto');
const User = require('../models/User'); // Adjust the path to where your user model is located

// POST /users - Create a new user
exports.postNew = async (req, res) => {
    const { email, password } = req.body;

    // Validation for missing email or password
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Already exist' });

        // Hash the password using SHA1
        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

        // Create a new user and save to DB
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Respond with the user details (excluding the password)
        res.status(201).json({
            id: newUser._id,
            email: newUser.email,
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
