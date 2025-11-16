import Router from 'express';
import { MovimientosAlmacenController } from '../controllers/movimientosAlmacenController.mjs';
import { errorHandler } from '../middlewares/errorHandler.mjs';

const movimientosAlmacenRouter = Router();

movimientosAlmacenRouter.get('/obra/:idObra', MovimientosAlmacenController.getByObra);
movimientosAlmacenRouter.post('/', MovimientosAlmacenController.create);
movimientosAlmacenRouter.put('/:idMovimiento', MovimientosAlmacenController.update);
movimientosAlmacenRouter.delete('/:idMovimiento', MovimientosAlmacenController.delete);

movimientosAlmacenRouter.use(errorHandler);

export default movimientosAlmacenRouter;