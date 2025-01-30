import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import mime from 'mime-types';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, type, parentId = 0, isPublic = false, data } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) return res.status(400).json({ error: 'Missing type' });
    if (type !== 'folder' && !data) return res.status(400).json({ error: 'Missing data' });

    if (parentId !== 0) {
      const parentFile = await dbClient.db.collection('files').findOne({ _id: ObjectId(parentId) });
      if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
      if (parentFile.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }

    const fileDoc = {
      userId: ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId === 0 ? parentId : ObjectId(parentId),
    };

    if (type === 'folder') {
      const result = await dbClient.db.collection('files').insertOne(fileDoc);
      return res.status(201).json({ ...fileDoc, id: result.insertedId });
    }

    const filePath = `${FOLDER_PATH}/${uuidv4()}`;
    const buff = Buffer.from(data, 'base64');
    await fs.promises.writeFile(filePath, buff);

    fileDoc.localPath = filePath;
    const result = await dbClient.db.collection('files').insertOne(fileDoc);
    res.status(201).json({ ...fileDoc, id: result.insertedId });
  }

  static async getFile(req, res) {
    const { id } = req.params;
    const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(id) });
    if (!file) return res.status(404).json({ error: 'Not found' });

    if (file.type === 'folder') return res.status(400).json({ error: "A folder doesn't have content" });

    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    const isAuthorized = file.isPublic || (userId && file.userId.toString() === userId);
    if (!isAuthorized) return res.status(404).json({ error: 'Not found' });

    if (!fs.existsSync(file.localPath)) return res.status(404).json({ error: 'Not found' });

    const mimeType = mime.lookup(file.name) || 'text/plain';
    res.setHeader('Content-Type', mimeType);
    return res.sendFile(file.localPath);
  }
}

export default FilesController;