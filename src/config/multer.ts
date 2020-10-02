import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const audioFolder = path.resolve(__dirname, '..', '..', 'audio');

export default {
  audioFolder,

  storage: multer.diskStorage({
    destination: audioFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
