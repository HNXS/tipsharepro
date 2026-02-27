'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api/users';
import { getLocations } from '@/lib/api/locations';
import type { OrgUser } from '@/lib/api/users';
import type { OrgLocation } from '@/lib/api/locations';
import { UserPlus, Trash2, X, Loader2, AlertCircle, Shield, MapPin } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  DESIGNEE: 'Designee',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'var(--accent-primary)',
  MANAGER: 'var(--accent-info)',
  DESIGNEE: 'var(--text-tertiary)',
};

export default function UserManagement() {
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [locations, setLocations] = useState<OrgLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [userList, locList] = await Promise.all([getUsers(), getLocations()]);
      setUsers(userList);
      setLocations(locList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRoleChange = async (userId: string, role: 'ADMIN' | 'MANAGER' | 'DESIGNEE') => {
    try {
      await updateUser(userId, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleLocationChange = async (userId: string, locationId: string | null) => {
    try {
      await updateUser(userId, { locationId });
      const loc = locationId ? locations.find(l => l.id === locationId) || null : null;
      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, locationId, location: loc ? { id: loc.id, name: loc.name } : null }
          : u
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="user-management-loading">
        <Loader2 size={20} className="loading-spinner" />
        <span>Loading users...</span>
      </div>
    );
  }

  return (
    <div className="user-management">
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setError(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="user-management-header">
        <h4 className="user-management-title">
          <Shield size={16} />
          Team Members ({users.length})
        </h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowInviteModal(true)}>
          <UserPlus size={14} />
          Invite User
        </button>
      </div>

      <div className="user-management-table-wrap">
        <table className="table user-management-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Location</th>
              <th>Last Login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="user-management-email">{user.email}</td>
                <td>
                  <select
                    className="form-select user-management-role-select"
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value as OrgUser['role'])}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="DESIGNEE">Designee</option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-select user-management-loc-select"
                    value={user.locationId || ''}
                    onChange={e => handleLocationChange(user.id, e.target.value || null)}
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </td>
                <td className="user-management-date">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Never'}
                </td>
                <td>
                  {deleteConfirm === user.id ? (
                    <div className="user-management-confirm-delete">
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                        Confirm
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm btn-danger-text"
                      onClick={() => setDeleteConfirm(user.id)}
                      title="Delete user"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInviteModal && (
        <InviteUserModal
          locations={locations}
          onClose={() => setShowInviteModal(false)}
          onCreated={(newUser) => {
            setUsers(prev => [...prev, newUser]);
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Invite User Modal
// ============================================================================

function InviteUserModal({
  locations,
  onClose,
  onCreated,
}: {
  locations: OrgLocation[];
  onClose: () => void;
  onCreated: (user: OrgUser) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'DESIGNEE'>('DESIGNEE');
  const [locationId, setLocationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const newUser = await createUser({
        email,
        password,
        role,
        locationId: locationId || undefined,
      });
      onCreated(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Invite User</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Temporary Password</label>
              <input
                type="text"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min 6 characters"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={e => setRole(e.target.value as typeof role)}
              >
                <option value="DESIGNEE">Designee (Shift Lead)</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                className="form-select"
                value={locationId}
                onChange={e => setLocationId(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 size={16} className="loading-spinner" /> : <UserPlus size={16} />}
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
