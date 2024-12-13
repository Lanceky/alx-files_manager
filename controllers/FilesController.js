const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const fileQueue = require('../worker');  // For adding jobs to process file thumbnails

// Get file data
exports.getFile = async (req, res) => {
  const { id } = req.params;
  const size = parseInt(req.query.size); // Size query for thumbnail
  const userId = req.userId; // Assuming userId is added by middleware after authentication

  try {
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ error: "Not found" });
    }

    if (!file.isPublic && file.userId !== userId) {
      return res.status(404).json({ error: "Not found" });
    }

    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }

    let filePath = path.join(__dirname, '..', 'uploads', file.name);

    // If the size query is present and the file is an image, serve the correct thumbnail
    if (size && file.type === 'image') {
      filePath = `${filePath}_${size}`;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Not found" });
      }
    }

    const mimeType = mime.lookup(file.name);
    res.setHeader('Content-Type', mimeType);
    fs.createReadStream(filePath).pipe(res);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add file to queue for thumbnail generation (in POST route or after file upload)
exports.addToThumbnailQueue = async (file) => {
  // Add job to the Bull queue for image processing
  if (file.type === 'image') {
    await fileQueue.add({
      userId: file.userId,
      fileId: file.id
    });
  }
};
