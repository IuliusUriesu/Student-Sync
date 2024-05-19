import { Router } from "express";

export const pingRouter = Router();

pingRouter.get('/', async (req, res) => {
    res.status(200).send('OK');
});