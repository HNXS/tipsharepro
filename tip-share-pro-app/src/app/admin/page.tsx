'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminKey,
  setAdminKey,
  clearAdminKey,
  verifyAdminKey,
  getAdminStats,
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  createLocation,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  Organization,
  User,
  AdminStats,
} from '@/lib/api/admin';
import {
  Building2,
  Users,
  MapPin,
  Activity,
  Zap,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Key,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';

// Subscription status badge colors
const STATUS_COLORS: Record<string, string> = {
  DEMO: 'badge-demo',
  TRIAL: 'badge-trial',
  ACTIVE: 'badge-active',
  SUSPENDED: 'badge-suspended',
  CANCELLED: 'badge-cancelled',
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users'>('overview');

  // Modal states
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // Expanded organizations
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

  // Form states
  const [orgForm, setOrgForm] = useState({ name: '', subscriptionStatus: 'DEMO' });
  const [userForm, setUserForm] = useState({
    organizationId: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });
  const [locationForm, setLocationForm] = useState({ name: '', number: '' });

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const key = getAdminKey();
      if (key) {
        const valid = await verifyAdminKey(key);
        if (valid) {
          setIsAuthenticated(true);
        } else {
          clearAdminKey();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Load data when authenticated
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [statsData, orgsData, usersData] = await Promise.all([
        getAdminStats(),
        getOrganizations(),
        getUsers(),
      ]);
      setStats(statsData);
      setOrganizations(orgsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    const valid = await verifyAdminKey(adminKeyInput);
    if (valid) {
      setAdminKey(adminKeyInput);
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid admin key');
    }
    setIsLoading(false);
  };

  // Handle logout
  const handleLogout = () => {
    clearAdminKey();
    setIsAuthenticated(false);
    setStats(null);
    setOrganizations([]);
    setUsers([]);
  };

  // Toggle org expansion
  const toggleOrgExpanded = (orgId: string) => {
    setExpandedOrgs((prev) => {
      const next = new Set(prev);
      if (next.has(orgId)) {
        next.delete(orgId);
      } else {
        next.add(orgId);
      }
      return next;
    });
  };

  // Organization CRUD
  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrg) {
        await updateOrganization(editingOrg.id, orgForm);
      } else {
        await createOrganization(orgForm);
      }
      setShowOrgModal(false);
      setEditingOrg(null);
      setOrgForm({ name: '', subscriptionStatus: 'DEMO' });
      loadData();
    } catch (error) {
      console.error('Error saving organization:', error);
    }
  };

  const handleDeleteOrg = async (id: string) => {
    if (!confirm('Delete this organization and all its data? This cannot be undone.')) {
      return;
    }
    try {
      await deleteOrganization(id);
      loadData();
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  const openEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setOrgForm({ name: org.name, subscriptionStatus: org.subscriptionStatus });
    setShowOrgModal(true);
  };

  // Location CRUD
  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId) return;
    try {
      await createLocation(selectedOrgId, locationForm);
      setShowLocationModal(false);
      setLocationForm({ name: '', number: '' });
      loadData();
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  // User CRUD
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData: { email?: string; password?: string; role?: string } = {
          email: userForm.email,
          role: userForm.role,
        };
        if (userForm.password) {
          updateData.password = userForm.password;
        }
        await updateUser(editingUser.id, updateData);
      } else {
        await createUser(userForm);
      }
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ organizationId: '', email: '', password: '', role: 'ADMIN' });
      loadData();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) {
      return;
    }
    try {
      await deleteUser(id);
      loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      organizationId: user.organizationId,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowUserModal(true);
  };

  const openNewUserForOrg = (orgId: string) => {
    setEditingUser(null);
    setUserForm({ organizationId: orgId, email: '', password: '', role: 'ADMIN' });
    setShowUserModal(true);
  };

  // Loading screen
  if (isLoading && !isAuthenticated) {
    return (
      <div className="admin-loading">
        <Loader2 className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <Key size={32} />
            <h1>Command Center</h1>
            <p>Enter your admin key to access the platform controls</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="adminKey">Admin Key</label>
              <input
                id="adminKey"
                type="password"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                placeholder="Enter admin key"
                required
              />
            </div>

            {authError && (
              <div className="admin-error">
                <AlertTriangle size={16} />
                {authError}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
              {isLoading ? <Loader2 className="loading-spinner" /> : 'Access Command Center'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>TipSharePro Command Center</h1>
          <div className="admin-autopilot">
            <span className="admin-autopilot-badge">
              <Zap size={14} />
              Autopilot: ON
            </span>
            <span className="admin-autopilot-subtitle">
              Self-service sign-ups active. Monitor via email/phone.
            </span>
          </div>
        </div>
        <div className="admin-header-right">
          <button onClick={handleLogout} className="btn btn-ghost">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button
          className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={18} />
          Overview
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'organizations' ? 'active' : ''}`}
          onClick={() => setActiveTab('organizations')}
        >
          <Building2 size={18} />
          Organizations
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          Users
        </button>
      </nav>

      {/* Content */}
      <main className="admin-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="admin-overview">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <Building2 size={24} />
                <div className="admin-stat-value">{stats.totalOrganizations}</div>
                <div className="admin-stat-label">Organizations</div>
              </div>
              <div className="admin-stat-card">
                <Users size={24} />
                <div className="admin-stat-value">{stats.totalUsers}</div>
                <div className="admin-stat-label">Users</div>
              </div>
              <div className="admin-stat-card">
                <MapPin size={24} />
                <div className="admin-stat-value">{stats.totalLocations}</div>
                <div className="admin-stat-label">Locations</div>
              </div>
            </div>

            <div className="admin-stats-breakdown">
              <h3>Organizations by Status</h3>
              <div className="admin-status-bars">
                {Object.entries(stats.organizationsByStatus).map(([status, count]) => (
                  <div key={status} className="admin-status-bar">
                    <span className={`admin-badge ${STATUS_COLORS[status] || ''}`}>{status}</span>
                    <span className="admin-status-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {stats.recentLogins.length > 0 && (
              <div className="admin-recent-logins">
                <h3>Recent Logins</h3>
                <ul>
                  {stats.recentLogins.map((login, i) => (
                    <li key={i}>
                      <span className="login-email">{login.email}</span>
                      <span className="login-org">{login.organization.name}</span>
                      <span className="login-time">
                        {new Date(login.lastLoginAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="admin-organizations">
            <div className="admin-section-header">
              <h2>Organizations</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingOrg(null);
                  setOrgForm({ name: '', subscriptionStatus: 'DEMO' });
                  setShowOrgModal(true);
                }}
              >
                <Plus size={16} />
                New Organization
              </button>
            </div>

            <div className="admin-org-list">
              {organizations.map((org) => (
                <div key={org.id} className="admin-org-card">
                  <div className="admin-org-header" onClick={() => toggleOrgExpanded(org.id)}>
                    <div className="admin-org-expand">
                      {expandedOrgs.has(org.id) ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </div>
                    <div className="admin-org-info">
                      <h3>{org.name}</h3>
                      <span className={`admin-badge ${STATUS_COLORS[org.subscriptionStatus]}`}>
                        {org.subscriptionStatus}
                      </span>
                    </div>
                    <div className="admin-org-counts">
                      <span>
                        <Users size={14} /> {org._count?.users || 0}
                      </span>
                      <span>
                        <MapPin size={14} /> {org._count?.locations || 0}
                      </span>
                    </div>
                    <div className="admin-org-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditOrg(org);
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrg(org.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {expandedOrgs.has(org.id) && (
                    <div className="admin-org-details">
                      <div className="admin-org-section">
                        <div className="admin-org-section-header">
                          <h4>Locations</h4>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              setSelectedOrgId(org.id);
                              setLocationForm({ name: '', number: '' });
                              setShowLocationModal(true);
                            }}
                          >
                            <Plus size={14} /> Add
                          </button>
                        </div>
                        {org.locations && org.locations.length > 0 ? (
                          <ul className="admin-location-list">
                            {org.locations.map((loc) => (
                              <li key={loc.id}>
                                <MapPin size={14} />
                                <span>{loc.name}</span>
                                <span className={`admin-badge-sm ${loc.status === 'ACTIVE' ? 'badge-active' : ''}`}>
                                  {loc.status}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="admin-empty">No locations</p>
                        )}
                      </div>

                      <div className="admin-org-section">
                        <div className="admin-org-section-header">
                          <h4>Users</h4>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => openNewUserForOrg(org.id)}
                          >
                            <Plus size={14} /> Add
                          </button>
                        </div>
                        {org.users && org.users.length > 0 ? (
                          <ul className="admin-user-list">
                            {org.users.map((user) => (
                              <li key={user.id}>
                                <span className="user-email">{user.email}</span>
                                <span className="admin-badge-sm">{user.role}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="admin-empty">No users</p>
                        )}
                      </div>

                      <div className="admin-org-meta">
                        <span>Created: {new Date(org.createdAt).toLocaleDateString()}</span>
                        {org.trialEndsAt && (
                          <span>Trial ends: {new Date(org.trialEndsAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {organizations.length === 0 && (
                <div className="admin-empty-state">
                  <Building2 size={48} />
                  <h3>No organizations yet</h3>
                  <p>Create your first organization to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-users">
            <div className="admin-section-header">
              <h2>All Users</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({ organizationId: '', email: '', password: '', role: 'ADMIN' });
                  setShowUserModal(true);
                }}
              >
                <Plus size={16} />
                New User
              </button>
            </div>

            <div className="admin-users-table">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Location</th>
                    <th>Role</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.organization?.name || '—'}</td>
                      <td>{user.location?.name || '—'}</td>
                      <td>
                        <span className="admin-badge-sm">{user.role}</span>
                      </td>
                      <td>
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleString()
                          : 'Never'}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEditUser(user)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-danger"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="admin-empty-state">
                  <Users size={48} />
                  <h3>No users yet</h3>
                  <p>Create an organization first, then add users</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Organization Modal */}
      {showOrgModal && (
        <div className="admin-modal-overlay" onClick={() => setShowOrgModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingOrg ? 'Edit Organization' : 'New Organization'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowOrgModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveOrg}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label htmlFor="orgName">Organization Name</label>
                  <input
                    id="orgName"
                    type="text"
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="orgStatus">Subscription Status</label>
                  <select
                    id="orgStatus"
                    value={orgForm.subscriptionStatus}
                    onChange={(e) => setOrgForm({ ...orgForm, subscriptionStatus: e.target.value })}
                  >
                    <option value="DEMO">Demo</option>
                    <option value="TRIAL">Trial</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowOrgModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  {editingOrg ? 'Save Changes' : 'Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="admin-modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>New Location</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowLocationModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveLocation}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label htmlFor="locName">Location Name</label>
                  <input
                    id="locName"
                    type="text"
                    value={locationForm.name}
                    onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                    placeholder="e.g., Downtown Store"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="locNumber">Location Number (optional)</label>
                  <input
                    id="locNumber"
                    type="text"
                    value={locationForm.number}
                    onChange={(e) => setLocationForm({ ...locationForm, number: e.target.value })}
                    placeholder="e.g., 001"
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowLocationModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  Create Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="admin-modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingUser ? 'Edit User' : 'New User'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowUserModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="admin-modal-body">
                {!editingUser && (
                  <div className="form-group">
                    <label htmlFor="userOrg">Organization</label>
                    <select
                      id="userOrg"
                      value={userForm.organizationId}
                      onChange={(e) => setUserForm({ ...userForm, organizationId: e.target.value })}
                      required
                    >
                      <option value="">Select organization</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="userEmail">Email</label>
                  <input
                    id="userEmail"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userPassword">
                    Password {editingUser && '(leave blank to keep current)'}
                  </label>
                  <input
                    id="userPassword"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={editingUser ? 'Enter new password' : 'Enter password'}
                    required={!editingUser}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userRole">Role</label>
                  <select
                    id="userRole"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
