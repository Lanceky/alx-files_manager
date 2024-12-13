const Bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const path = require('path');
const File = require('./models/File');
const User = require('./models/User');

// File processing queue (for image thumbnail generation)
const fileQueue = new Bull('fileQueue');

// Process file thumbnail generation
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!userId || !fileId) {
    throw new Error('Missing userId or fileId');
  }

  const file = await File.findOne({ _id: fileId, userId });

  if (!file) {
    throw new Error('File not found');
  }

  if (file.type !== 'image') {
    throw new Error('File is not an image');
  }

  const filePath = path.join(__dirname, 'uploads', file.name);
  
  const thumbnailSizes = [500, 250, 100];
  
  for (const size of thumbnailSizes) {
    try {
      const thumbnail = await imageThumbnail(filePath, { width: size });
      const newFilePath = `${filePath}_${size}`;
      fs.writeFileSync(newFilePath, thumbnail);
    } catch (err) {
      console.error(`Error generating thumbnail for ${size}px:`, err);
    }
  }
});

// User queue (for sending welcome email)
const userQueue = new Bull('userQueue');

userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  console.log(`Welcome ${user.email}!`);
});

module.exports = { fileQueue, userQueue };
