import axios from 'axios';

const nlu = axios.create({
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
  },
  auth: {
    username: 'apikey',
    password: process.env.NLU_APIKEY || '',
  },
  baseURL: process.env.NLU_URL,
});

export default nlu;
