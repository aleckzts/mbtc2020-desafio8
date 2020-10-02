import axios from 'axios';

const speech = axios.create({
  headers: {
    post: {
      'Content-Type': 'audio/flac',
    },
  },
  auth: {
    username: 'apikey',
    password: process.env.STT_APIKEY || '',
  },
  baseURL: process.env.STT_URL,
});

export default speech;
