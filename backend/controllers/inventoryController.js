import Inventory from '../models/Inventory.js';
import { validationResult } from 'express-validator';

export const createInventory = async (req, res) => {
  try {
    console.log('=== CREATE INVENTORY REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    console.log('Validation passed, creating inventory...');
    const inventory = new Inventory(req.body);
    
    console.log('Saving to database...');
    await inventory.save();
    
    console.log('Successfully saved!');
    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      data: inventory
    });
  } catch (error) {
    console.error('Error in createInventory:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error adding property',
      error: error.message
    });
  }
};

export const getAllInventory = async (req, res) => {
  try {
    const { search, propertyType, status, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { builder: { $regex: search, $options: 'i' } },
        { unitSpecification: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (propertyType) query.propertyType = propertyType;
    if (status) query.currentStatus = status;
    
    const sortOrder = order === 'asc' ? 1 : -1;
    
    const inventory = await Inventory.find(query)
      .sort({ [sortBy]: sortOrder })
      .lean();
    
    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory
    });
  } catch (error) {
    console.error('Error in getAllInventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory',
      error: error.message
    });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error('Error in getInventoryById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

export const updateInventory = async (req, res) => {
  try {
    console.log('=== UPDATE INVENTORY REQUEST ===');
    console.log('ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: inventory
    });
  } catch (error) {
    console.error('Error in updateInventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteInventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const totalItems = await Inventory.countDocuments();
    const underConstruction = await Inventory.countDocuments({ currentStatus: 'Under Construction' });
    const readyToMove = await Inventory.countDocuments({ currentStatus: 'Ready to Move' });
    const upcoming = await Inventory.countDocuments({ currentStatus: 'Upcoming' });
    const soldOut = await Inventory.countDocuments({ currentStatus: 'Sold Out' });
    const available = await Inventory.countDocuments({ currentStatus: 'Available' });
    
    const totalValue = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$closingPrice' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalItems,
        underConstruction,
        readyToMove,
        upcoming,
        soldOut,
        available,
        totalValue: totalValue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error in getStatistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};