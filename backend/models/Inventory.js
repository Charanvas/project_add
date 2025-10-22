import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  builder: {
    type: String,
    required: [true, 'Builder name is required'],
    trim: true
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Mixed Use'],
    trim: true
  },
  unitSpecification: {
    type: String,
    required: [true, 'Unit specification is required'],
    trim: true
  },
  sqftRangeMin: {
    type: Number,
    required: [true, 'Minimum sqft range is required'],
    min: [0, 'Sqft range cannot be negative']
  },
  sqftRangeMax: {
    type: Number,
    required: [true, 'Maximum sqft range is required'],
    min: [0, 'Sqft range cannot be negative']
  },
  paymentMode: {
    type: String,
    required: [true, 'Payment mode is required'],
    enum: ['Cash', 'Bank Loan', 'Home Loan', 'Construction Linked', 'Possession Linked', 'Flexible Payment Plan'],
    trim: true
  },
  possessionDate: {
    type: Date,
    required: [true, 'Possession date is required']
  },
  currentStatus: {
    type: String,
    required: [true, 'Current status is required'],
    enum: ['Under Construction', 'Ready to Move', 'Upcoming', 'Sold Out', 'Available'],
    default: 'Available'
  },
  closingPrice: {
    type: Number,
    required: [true, 'Closing price is required'],
    min: [0, 'Price cannot be negative']
  },
  cpCut: {
    type: Number,
    required: [true, 'CP Cut is required'],
    min: [0, 'CP Cut cannot be negative'],
    max: [100, 'CP Cut cannot exceed 100%']
  }
}, {
  timestamps: true
});

// Validate that max sqft is greater than min sqft
inventorySchema.pre('save', function(next) {
  if (this.sqftRangeMax < this.sqftRangeMin) {
    next(new Error('Maximum sqft range must be greater than minimum sqft range'));
  }
  next();
});

export default mongoose.model('Inventory', inventorySchema);