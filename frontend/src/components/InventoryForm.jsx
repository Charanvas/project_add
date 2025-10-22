import React, { useState } from 'react';
import { Plus, PackagePlus } from 'lucide-react';
import { inventoryAPI } from '../services/api';
import Toast from './Toast';

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    builder: '',
    propertyType: '',
    unitSpecification: '',
    sqftRangeMin: '',
    sqftRangeMax: '',
    paymentMode: '',
    possessionDate: '',
    currentStatus: '',
    closingPrice: '',
    cpCut: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const propertyTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Agricultural',
    'Mixed Use',
  ];

  const paymentModes = [
    'Cash',
    'Bank Loan',
    'Home Loan',
    'Construction Linked',
    'Possession Linked',
    'Flexible Payment Plan',
  ];

  const statusOptions = [
    'Under Construction',
    'Ready to Move',
    'Upcoming',
    'Sold Out',
    'Available',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        projectName: formData.projectName.trim(),
        builder: formData.builder.trim(),
        propertyType: formData.propertyType,
        unitSpecification: formData.unitSpecification.trim(),
        sqftRangeMin: Number(formData.sqftRangeMin),
        sqftRangeMax: Number(formData.sqftRangeMax),
        paymentMode: formData.paymentMode,
        possessionDate: formData.possessionDate,
        currentStatus: formData.currentStatus,
        closingPrice: Number(formData.closingPrice),
        cpCut: Number(formData.cpCut),
      };

      console.log('Frontend - Submitting data:', submitData);

      const response = await inventoryAPI.create(submitData);
      
      console.log('Frontend - Response:', response);

      setToast({
        message: 'Property added successfully!',
        type: 'success',
      });

      // Reset form
      setFormData({
        projectName: '',
        builder: '',
        propertyType: '',
        unitSpecification: '',
        sqftRangeMin: '',
        sqftRangeMax: '',
        paymentMode: '',
        possessionDate: '',
        currentStatus: '',
        closingPrice: '',
        cpCut: '',
      });
    } catch (error) {
      console.error('Frontend - Full error:', error);
      console.error('Frontend - Error response:', error.response);
      
      let errorMessage = 'Failed to add property';
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.msg || err.message).join(', ');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setToast({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <PackagePlus size={32} />
            Add/Edit Property
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Project Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Builder <span className="required">*</span>
              </label>
              <input
                type="text"
                name="builder"
                value={formData.builder}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter builder name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Property Type <span className="required">*</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Property Type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Unit Specification <span className="required">*</span>
              </label>
              <input
                type="text"
                name="unitSpecification"
                value={formData.unitSpecification}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 2BHK, 3BHK"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Sqft Range (Min) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="sqftRangeMin"
                value={formData.sqftRangeMin}
                onChange={handleChange}
                className="form-input"
                placeholder="Min"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Sqft Range (Max) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="sqftRangeMax"
                value={formData.sqftRangeMax}
                onChange={handleChange}
                className="form-input"
                placeholder="Max"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Payment Mode <span className="required">*</span>
              </label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Payment Mode</option>
                {paymentModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Possession Date <span className="required">*</span>
              </label>
              <input
                type="date"
                name="possessionDate"
                value={formData.possessionDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Current Status <span className="required">*</span>
              </label>
              <select
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Closing Price (₹) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="closingPrice"
                value={formData.closingPrice}
                onChange={handleChange}
                className="form-input"
                placeholder="₹"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                CP Cut (%) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="cpCut"
                value={formData.cpCut}
                onChange={handleChange}
                className="form-input"
                placeholder="%"
                step="0.01"
                min="0"
                max="100"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                Adding...
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Property
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;