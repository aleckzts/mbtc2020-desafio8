import { Router } from 'express';

import fcaRouter from './fca.routes';

const routes = Router();

routes.use('/api', fcaRouter);

export default routes;
