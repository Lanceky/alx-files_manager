const { hashPassword } = require('../utils/hash');
const User = require('../models/User');  // Assuming you are using a User model

async function postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
        return res.status(400).json({ error: 'Missing password' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password before saving
    const hashedPassword = hashPassword(password);

    const newUser = new User({
        email,
        password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
        id: newUser._id,
        email: newUser.email,
    });
}
