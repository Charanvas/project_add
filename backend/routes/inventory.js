import express from 'express';
import { body } from 'express-validator';
import {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getStatistics
} from '../controllers/inventoryController.js';

const router = express.Router();

const inventoryValidation = [
  body('projectName').notEmpty().trim().withMessage('Project name is required'),
  body('builder').notEmpty().trim().withMessage('Builder name is required'),
  body('propertyType').notEmpty().trim().withMessage('Property type is required'),
  body('unitSpecification').notEmpty().trim().withMessage('Unit specification is required'),
  body('sqftRangeMin').isInt({ min: 0 }).withMessage('Minimum sqft range must be a positive number'),
  body('sqftRangeMax').isInt({ min: 0 }).withMessage('Maximum sqft range must be a positive number'),
  body('paymentMode').notEmpty().trim().withMessage('Payment mode is required'),
  body('possessionDate').notEmpty().withMessage('Possession date is required'),
  body('currentStatus').notEmpty().trim().withMessage('Current status is required'),
  body('closingPrice').isFloat({ min: 0 }).withMessage('Closing price must be a positive number'),
  body('cpCut').isFloat({ min: 0, max: 100 }).withMessage('CP Cut must be between 0 and 100')
];

router.post('/', inventoryValidation, createInventory);
router.get('/', getAllInventory);
router.get('/statistics', getStatistics);
router.get('/:id', getInventoryById);
router.put('/:id', inventoryValidation, updateInventory);
router.delete('/:id', deleteInventory);

export default router;