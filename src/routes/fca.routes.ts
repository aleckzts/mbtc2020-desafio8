import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';

import FCAController from '../controller/fcaController';

const fcaRouter = Router();
const upload = multer(uploadConfig);

const fcaController = new FCAController();

fcaRouter.post(
  '/recommend',
  upload.single('audio'),
  fcaController.createRecommendation,
);

export default fcaRouter;
