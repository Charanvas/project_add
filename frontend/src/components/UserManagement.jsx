import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Shield,
  Edit,
  Eye,
  X,
  Save,
} from 'lucide-react';
import { userAPI } from '../services/api';
import Toast from './Toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [toast, setToast] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'read',
    status: 'Active'
  });

  useEffect(() => {
    fetchData();
  }, [searchTerm, roleFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        userAPI.getAll({
          search: searchTerm,
          role: roleFilter,
        }),
        userAPI.getStatistics(),
      ]);

      setUsers(usersData.data);
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userAPI.create(newUser);
      setToast({
        message: 'User created successfully!',
        type: 'success',
      });
      setShowCreateModal(false);
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: 'read',
        status: 'Active'
      });
      fetchData();
    } catch (error) {
      let errorMessage = 'Failed to create user';
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.msg || err.message).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setToast({
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      setToast({
        message: 'User role updated successfully!',
        type: 'success',
      });
      fetchData();
    } catch (error) {
      setToast({
        message: error.message || 'Failed to update role',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await userAPI.delete(id);
      setToast({
        message: 'User deleted successfully!',
        type: 'success',
      });
      setDeleteModal(null);
      fetchData();
    } catch (error) {
      setToast({
        message: error.message || 'Failed to delete user',
        type: 'error',
      });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield size={16} style={{ color: 'var(--danger)' }} />;
      case 'edit':
        return <Edit size={16} style={{ color: 'var(--warning)' }} />;
      case 'read':
        return <Eye size={16} style={{ color: 'var(--success)' }} />;
      default:
        return null;
    }
  };

  const adminUsers = users.filter(user => user.role === 'admin');
  const editUsers = users.filter(user => user.role === 'edit');
  const readUsers = users.filter(user => user.role === 'read');

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

      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <Users size={32} />
            User Management - tattva
          </h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <UserPlus size={20} />
            Create User
          </button>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="edit">Edit</option>
            <option value="read">Read</option>
          </select>
        </div>

        {/* Admin Users Table */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Admin Users
          </h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner" />
            </div>
          ) : adminUsers.length === 0 ? (
            <div className="empty-state">
              <Shield size={48} className="empty-state-icon" />
              <p className="empty-state-text">No admin users found</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => (
                    <tr key={user._id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getRoleIcon(user.role)}
                          {user.username}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${user.status === 'Active' ? 'in-stock' : 'out-of-stock'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleRoleChange(user._id, 'edit')}
                          >
                            Make Edit
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleRoleChange(user._id, 'read')}
                          >
                            Make Read
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => setDeleteModal(user)}
                          >
                            Remove
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

        {/* Edit Users Table */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Edit Users
          </h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner" />
            </div>
          ) : editUsers.length === 0 ? (
            <div className="empty-state">
              <Edit size={48} className="empty-state-icon" />
              <p className="empty-state-text">No edit users found</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {editUsers.map((user) => (
                    <tr key={user._id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getRoleIcon(user.role)}
                          {user.username}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${user.status === 'Active' ? 'in-stock' : 'out-of-stock'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleRoleChange(user._id, 'admin')}
                          >
                            Make Admin
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleRoleChange(user._id, 'read')}
                          >
                            Make Read
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => setDeleteModal(user)}
                          >
                            Remove
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

        {/* Read Users Table */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Read Users
          </h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner" />
            </div>
          ) : readUsers.length === 0 ? (
            <div className="empty-state">
              <Eye size={48} className="empty-state-icon" />
              <p className="empty-state-text">No read users found</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {readUsers.map((user) => (
                    <tr key={user._id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getRoleIcon(user.role)}
                          {user.username}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${user.status === 'Active' ? 'in-stock' : 'out-of-stock'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleRoleChange(user._id, 'admin')}
                          >
                            Make Admin
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleRoleChange(user._id, 'edit')}
                          >
                            Make Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            onClick={() => setDeleteModal(user)}
                          >
                            Remove
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
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New User</h2>
              <button className="btn-icon" onClick={() => setShowCreateModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Username <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="Enter username"
                    required
                    minLength="3"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Role <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    required
                  >
                    <option value="read">Read</option>
                    <option value="edit">Edit</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Status <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={20} />
                  Create User
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
                Are you sure you want to delete this user?
              </p>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--cream-bg)', 
                borderRadius: '8px',
                borderLeft: '4px solid var(--danger)'
              }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                  {deleteModal.username}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Email: {deleteModal.email}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Role: {deleteModal.role}
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
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;