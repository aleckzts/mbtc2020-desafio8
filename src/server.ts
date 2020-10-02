import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import 'dotenv/config';

import uploadConfig from './config/multer';

import AppError from './errors/AppError';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.audioFolder));

app.get('/', (_: Request, response: Response) => {
  return response.json({ message: 'API Rest Desafio 8 FCA Ok' });
});

app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log('Server started on port', port);
});
