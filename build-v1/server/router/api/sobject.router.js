import { Router } from 'express';
import {
    customizableSObjects,
    SObjectsWithFields,
} from '../../controller/sobject.controller';

const SObjectRouter = Router();

SObjectRouter.post('/get-sobjects-with-fields', SObjectsWithFields);
SObjectRouter.get('/get-customizable-sobjects', customizableSObjects);

export default SObjectRouter;
