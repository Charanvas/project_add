import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Search,
  Edit2,
  Trash2,
  Package,
  TrendingUp,
  X,
  Save,
} from 'lucide-react';
import { inventoryAPI } from '../services/api';
import Toast from './Toast';

const InventoryAdmin = () => {
  const [inventory, setInventory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

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

  useEffect(() => {
    fetchData();
  }, [searchTerm, propertyTypeFilter, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryData, statsData] = await Promise.all([
        inventoryAPI.getAll({
          search: searchTerm,
          propertyType: propertyTypeFilter,
          status: statusFilter,
        }),
        inventoryAPI.getStatistics(),
      ]);

      setInventory(inventoryData.data);
      setStatistics(statsData.data);
    } catch (error) {
      setToast({
        message: error.message || 'Failed to fetch data',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await inventoryAPI.delete(id);
      setToast({
        message: 'Property deleted successfully!',
        type: 'success',
      });
      setDeleteModal(null);
      fetchData();
    } catch (error) {
      setToast({
        message: error.message || 'Failed to delete property',
        type: 'error',
      });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.update(editModal._id, {
        ...editModal,
        sqftRangeMin: Number(editModal.sqftRangeMin),
        sqftRangeMax: Number(editModal.sqftRangeMax),
        closingPrice: Number(editModal.closingPrice),
        cpCut: Number(editModal.cpCut),
      });

      setToast({
        message: 'Property updated successfully!',
        type: 'success',
      });
      setEditModal(null);
      fetchData();
    } catch (error) {
      setToast({
        message: error.message || 'Failed to update property',
        type: 'error',
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

      {/* Statistics */}
      {statistics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Properties</span>
              <Package size={24} className="stat-card-icon" />
            </div>
            <div className="stat-card-value">{statistics.totalItems}</div>
          </div>

          
        </div>
      )}

      {/* Main Content */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <LayoutDashboard size={32} />
            Property Listings
          </h1>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by project name, builder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
          >
            <option value="">All Property Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : inventory.length === 0 ? (
          <div className="empty-state">
            <Package size={64} className="empty-state-icon" />
            <h2 className="empty-state-title">No Properties Found</h2>
            <p className="empty-state-text">
              {searchTerm || propertyTypeFilter || statusFilter
                ? 'Try adjusting your filters'
                : 'Start by adding your first property'}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Builder</th>
                  <th>Property Type</th>
                  <th>Unit Specification</th>
                  <th>Sqft Range</th>
                  <th>Payment Mode</th>
                  <th>Possession Date</th>
                  <th>Current Status</th>
                  <th>Closing Price</th>
                  <th>CP Cut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 600 }}>{item.projectName}</td>
                    <td>{item.builder}</td>
                    <td>{item.propertyType}</td>
                    <td>{item.unitSpecification}</td>
                    <td>{item.sqftRangeMin} - {item.sqftRangeMax} sqft</td>
                    <td>{item.paymentMode}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(item.possessionDate)}
                    </td>
                    <td>
                      <span className="status-badge in-stock">
                        {item.currentStatus}
                      </span>
                    </td>
                    <td>{formatCurrency(item.closingPrice)}</td>
                    <td>{item.cpCut}%</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon edit"
                          onClick={() => setEditModal(item)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => setDeleteModal(item)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Property</h2>
              <button className="btn-icon" onClick={() => setEditModal(null)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEdit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editModal.projectName}
                    onChange={(e) =>
                      setEditModal({ ...editModal, projectName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Builder</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editModal.builder}
                    onChange={(e) =>
                      setEditModal({ ...editModal, builder: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select
                    className="form-select"
                    value={editModal.propertyType}
                    onChange={(e) =>
                      setEditModal({ ...editModal, propertyType: e.target.value })
                    }
                    required
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Specification</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editModal.unitSpecification}
                    onChange={(e) =>
                      setEditModal({ ...editModal, unitSpecification: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sqft Range (Min)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editModal.sqftRangeMin}
                    onChange={(e) =>
                      setEditModal({ ...editModal, sqftRangeMin: e.target.value })
                    }
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sqft Range (Max)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editModal.sqftRangeMax}
                    onChange={(e) =>
                      setEditModal({ ...editModal, sqftRangeMax: e.target.value })
                    }
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="form-select"
                    value={editModal.paymentMode}
                    onChange={(e) =>
                      setEditModal({ ...editModal, paymentMode: e.target.value })
                    }
                    required
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Possession Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editModal.possessionDate ? editModal.possessionDate.split('T')[0] : ''}
                    onChange={(e) =>
                      setEditModal({ ...editModal, possessionDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Status</label>
                  <select
                    className="form-select"
                    value={editModal.currentStatus}
                    onChange={(e) =>
                      setEditModal({ ...editModal, currentStatus: e.target.value })
                    }
                    required
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Closing Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editModal.closingPrice}
                    onChange={(e) =>
                      setEditModal({ ...editModal, closingPrice: e.target.value })
                    }
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CP Cut (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editModal.cpCut}
                    onChange={(e) =>
                      setEditModal({ ...editModal, cpCut: e.target.value })
                    }
                    step="0.01"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Delete</h2>
              <button className="btn-icon" onClick={() => setDeleteModal(null)}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '1rem 0' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Are you sure you want to delete this property?
              </p>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--cream-bg)', 
                borderRadius: '8px',
                borderLeft: '4px solid var(--danger)'
              }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                  {deleteModal.projectName}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Builder: {deleteModal.builder}
                </p>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteModal._id)}
              >
                <Trash2 size={20} />
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAdmin;