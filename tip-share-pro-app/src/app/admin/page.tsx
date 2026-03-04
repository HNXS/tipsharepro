'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  createAccount,
  changeAccountStatus,
  extendAccount,
  getLeads,
  getLeadStats,
  createLead,
  updateLead,
  deleteLead,
  getAutopilotSettings,
  updateAutopilotSettings,
  Organization,
  User,
  AdminStats,
  Lead,
  LeadStats,
  LeadType,
  LeadStatusType,
  AutopilotSettings,
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
  Clock,
  UserPlus,
  Inbox,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  ArrowUpDown,
  CreditCard,
  Calendar,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

// Subscription status badge colors
const STATUS_COLORS: Record<string, string> = {
  DEMO: 'badge-demo',
  TRIAL: 'badge-trial',
  ACTIVE: 'badge-active',
  SUSPENDED: 'badge-suspended',
  CANCELLED: 'badge-cancelled',
};

const LEAD_TYPE_LABELS: Record<string, string> = {
  DEMO_REQUEST: 'Demo Request',
  TRIAL_REQUEST: 'Trial Request',
  QUESTION: 'Question',
  CALLBACK: 'Callback',
};

const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  DEMO_SENT: 'Demo Sent',
  TRIAL: 'Trial',
  SUBSCRIBED: 'Subscribed',
  EXPIRED: 'Expired',
  DISQUALIFIED: 'Disqualified',
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: 'lead-badge-new',
  CONTACTED: 'lead-badge-contacted',
  DEMO_SENT: 'lead-badge-demo-sent',
  TRIAL: 'lead-badge-trial',
  SUBSCRIBED: 'lead-badge-subscribed',
  EXPIRED: 'lead-badge-expired',
  DISQUALIFIED: 'lead-badge-disqualified',
};

const LEAD_TYPE_COLORS: Record<string, string> = {
  DEMO_REQUEST: 'lead-type-demo',
  TRIAL_REQUEST: 'lead-type-trial',
  QUESTION: 'lead-type-question',
  CALLBACK: 'lead-type-callback',
};

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [now, setNow] = useState(new Date());
  const [clockOpen, setClockOpen] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadStats, setLeadStats] = useState<LeadStats | null>(null);
  const [autopilot, setAutopilot] = useState<AutopilotSettings>({ autopilotDemo: false, autopilotTrial: false, clockDateFormat: 'Mon DD, YYYY', clockTimeFormat: '12h', clockTimeZone: 'America/New_York' });
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'organizations' | 'users'>('overview');

  // Modal states
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // Overview states
  const [showSubscriptionDetail, setShowSubscriptionDetail] = useState(false);

  // User search/filter
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Lead filters
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterType, setLeadFilterType] = useState('');
  const [leadFilterStatus, setLeadFilterStatus] = useState('');
  const [leadSort, setLeadSort] = useState('newest');

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
  const [leadForm, setLeadForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    state: '',
    leadType: 'DEMO_REQUEST' as LeadType,
    source: '',
    notes: '',
    viabilityDays: 14,
  });

  // Account management states
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [createAccountForm, setCreateAccountForm] = useState({
    email: '',
    password: '',
    companyName: '',
    subscriptionStatus: 'DEMO',
    durationDays: 14,
  });
  const [createAccountError, setCreateAccountError] = useState('');
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

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
      const [statsData, orgsData, usersData, leadsData, leadStatsData, autopilotData] = await Promise.all([
        getAdminStats(),
        getOrganizations(),
        getUsers(),
        getLeads(),
        getLeadStats(),
        getAutopilotSettings(),
      ]);
      setStats(statsData);
      setOrganizations(orgsData);
      setUsers(usersData);
      setLeads(leadsData);
      setLeadStats(leadStatsData);
      setAutopilot(autopilotData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }, [isAuthenticated]);

  const loadLeads = useCallback(async () => {
    try {
      const filters: Record<string, string> = {};
      if (leadFilterStatus) filters.status = leadFilterStatus;
      if (leadFilterType) filters.type = leadFilterType;
      if (leadSearch) filters.search = leadSearch;
      if (leadSort) filters.sort = leadSort;
      const [leadsData, leadStatsData] = await Promise.all([
        getLeads(filters),
        getLeadStats(),
      ]);
      setLeads(leadsData);
      setLeadStats(leadStatsData);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  }, [leadFilterStatus, leadFilterType, leadSearch, leadSort]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'leads') {
      loadLeads();
    }
  }, [isAuthenticated, activeTab, loadLeads]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clockRef.current && !clockRef.current.contains(e.target as Node)) {
        setClockOpen(false);
      }
    };
    if (clockOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clockOpen]);

  const US_TIME_ZONES = [
    { value: 'America/New_York', label: 'Eastern (ET)' },
    { value: 'America/Chicago', label: 'Central (CT)' },
    { value: 'America/Denver', label: 'Mountain (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
    { value: 'America/Anchorage', label: 'Alaska (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii (HT)' },
  ];

  const formatCurrentDate = () => {
    const tz = autopilot.clockTimeZone;
    const df = autopilot.clockDateFormat;
    const tf = autopilot.clockTimeFormat;
    const d = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: tz });
    let dateStr = '';
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    switch (df) {
      case 'MM/DD/YYYY': dateStr = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`; break;
      case 'DD/MM/YYYY': dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`; break;
      case 'YYYY-MM-DD': dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; break;
      case 'Mon DD, YYYY': dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: tz }); break;
      default: dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: tz }); break;
    }
    let timeStr = '';
    if (tf === '24h') {
      timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
    } else {
      timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });
    }
    return { dayName, dateStr, timeStr };
  };

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

  // Lead CRUD handlers
  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await updateLead(editingLead.id, {
          firstName: leadForm.firstName,
          lastName: leadForm.lastName,
          email: leadForm.email,
          phone: leadForm.phone || undefined,
          companyName: leadForm.companyName || undefined,
          state: leadForm.state || undefined,
          leadType: leadForm.leadType,
          source: leadForm.source || undefined,
          notes: leadForm.notes || undefined,
          viabilityDays: leadForm.viabilityDays,
        });
      } else {
        await createLead({
          firstName: leadForm.firstName,
          lastName: leadForm.lastName,
          email: leadForm.email,
          phone: leadForm.phone || undefined,
          companyName: leadForm.companyName || undefined,
          state: leadForm.state || undefined,
          leadType: leadForm.leadType,
          source: leadForm.source || undefined,
          notes: leadForm.notes || undefined,
          viabilityDays: leadForm.viabilityDays,
        });
      }
      setShowLeadModal(false);
      setEditingLead(null);
      resetLeadForm();
      loadLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    try {
      await deleteLead(id);
      loadLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleClockSetting = async (key: 'clockDateFormat' | 'clockTimeFormat' | 'clockTimeZone', value: string) => {
    const prev = autopilot[key];
    setAutopilot(p => ({ ...p, [key]: value }));
    try {
      await updateAutopilotSettings({ [key]: value });
    } catch (error) {
      setAutopilot(p => ({ ...p, [key]: prev }));
      console.error('Error saving clock setting:', error);
    }
  };

  const handleToggleAutopilot = async (key: 'autopilotDemo' | 'autopilotTrial') => {
    const newValue = !autopilot[key];
    setAutopilot(prev => ({ ...prev, [key]: newValue }));
    try {
      const updated = await updateAutopilotSettings({ [key]: newValue });
      setAutopilot(updated);
    } catch (error) {
      setAutopilot(prev => ({ ...prev, [key]: !newValue }));
      console.error('Error toggling autopilot:', error);
    }
  };

  const handleLeadStatusChange = async (lead: Lead, newStatus: LeadStatusType) => {
    try {
      await updateLead(lead.id, { status: newStatus });
      loadLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const openEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setLeadForm({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone || '',
      companyName: lead.companyName || '',
      state: lead.state || '',
      leadType: lead.leadType,
      source: lead.source || '',
      notes: lead.notes || '',
      viabilityDays: lead.viabilityDays,
    });
    setShowLeadModal(true);
  };

  const resetLeadForm = () => {
    setLeadForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      state: '',
      leadType: 'DEMO_REQUEST',
      source: '',
      notes: '',
      viabilityDays: 14,
    });
  };

  const getViabilityInfo = (lead: Lead) => {
    const now = new Date();
    const deadline = new Date(lead.viabilityDeadline);
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const closedStatuses: LeadStatusType[] = ['SUBSCRIBED', 'EXPIRED', 'DISQUALIFIED'];
    if (closedStatuses.includes(lead.status)) {
      return { label: '—', className: 'viability-closed' };
    }
    if (diffDays < 0) {
      return { label: 'Overdue', className: 'viability-red' };
    }
    if (diffDays <= 1) {
      return { label: 'Today', className: 'viability-red' };
    }
    if (diffDays <= 3) {
      return { label: `${diffDays}d left`, className: 'viability-yellow' };
    }
    return { label: `${diffDays}d left`, className: 'viability-green' };
  };

  // Account management handlers
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAccountError('');
    try {
      await createAccount({
        email: createAccountForm.email,
        password: createAccountForm.password,
        companyName: createAccountForm.companyName || undefined,
        subscriptionStatus: createAccountForm.subscriptionStatus,
        durationDays: createAccountForm.durationDays,
      });
      setShowCreateAccount(false);
      setCreateAccountForm({
        email: '',
        password: '',
        companyName: '',
        subscriptionStatus: 'DEMO',
        durationDays: 14,
      });
      loadData();
    } catch (error) {
      setCreateAccountError(
        error instanceof Error ? error.message : 'Failed to create account'
      );
    }
  };

  const handleOrgAction = async (org: Organization, action: string) => {
    setActionErrors((prev) => ({ ...prev, [org.id]: '' }));
    setActionLoading((prev) => ({ ...prev, [org.id]: true }));
    try {
      switch (action) {
        case 'upgrade-trial':
          await changeAccountStatus(org.id, { status: 'TRIAL', durationDays: 14 });
          break;
        case 'upgrade-active':
          await changeAccountStatus(org.id, { status: 'ACTIVE' });
          break;
        case 'suspend':
          await changeAccountStatus(org.id, { status: 'SUSPENDED' });
          break;
        case 'extend-30':
          await extendAccount(org.id, 30);
          break;
        default:
          return;
      }
      loadData();
    } catch (error) {
      setActionErrors((prev) => ({
        ...prev,
        [org.id]: error instanceof Error ? error.message : 'Action failed',
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [org.id]: false }));
    }
  };

  // Helper: calculate days remaining until trial end
  const getDaysRemaining = (trialEndsAt?: string): number | null => {
    if (!trialEndsAt) return null;
    const now = new Date();
    const end = new Date(trialEndsAt);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Expiring accounts (within 7 days)
  const expiringOrgs = organizations.filter((org) => {
    const days = getDaysRemaining(org.trialEndsAt);
    return days !== null && days >= 0 && days <= 7;
  });

  // Calculate end date preview for create account form
  const getEndDatePreview = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + createAccountForm.durationDays);
    return date.toLocaleDateString();
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
          <div className="admin-header-text">
            <h1>TipSharePro Command Center</h1>
            <div className="admin-autopilot-toggles" data-testid="autopilot-toggles">
              <button
                className={`autopilot-toggle ${autopilot.autopilotDemo ? 'autopilot-on' : 'autopilot-off'}`}
                onClick={() => handleToggleAutopilot('autopilotDemo')}
                data-testid="toggle-autopilot-demo"
              >
                <Zap size={13} />
                <span className="autopilot-toggle-label">Demo</span>
                <span className="autopilot-toggle-state">{autopilot.autopilotDemo ? 'ON' : 'OFF'}</span>
              </button>
              <button
                className={`autopilot-toggle ${autopilot.autopilotTrial ? 'autopilot-on' : 'autopilot-off'}`}
                onClick={() => handleToggleAutopilot('autopilotTrial')}
                data-testid="toggle-autopilot-trial"
              >
                <Zap size={13} />
                <span className="autopilot-toggle-label">Trial</span>
                <span className="autopilot-toggle-state">{autopilot.autopilotTrial ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
          <img src="/logo-icon.png" alt="TipSharePro" className="admin-header-logo" data-testid="header-logo" />
        </div>
        <div className="admin-header-right">
          <div ref={clockRef} className={`admin-header-clock${clockOpen ? ' clock-open' : ''}`} data-testid="header-clock" onClick={() => setClockOpen(prev => !prev)}>
            <span className="admin-clock-day">{formatCurrentDate().dayName}</span>
            <span className="admin-clock-date">{formatCurrentDate().dateStr}</span>
            <span className="admin-clock-time">{formatCurrentDate().timeStr}</span>
            {clockOpen && (
              <div className="admin-clock-config" onClick={(e) => e.stopPropagation()} data-testid="clock-config">
                <div className="clock-config-group">
                  <label className="clock-config-label">Date Format</label>
                  <select className="form-select clock-config-select" value={autopilot.clockDateFormat} onChange={(e) => handleClockSetting('clockDateFormat', e.target.value)} data-testid="select-date-format">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="Mon DD, YYYY">Mon DD, YYYY</option>
                  </select>
                </div>
                <div className="clock-config-group">
                  <label className="clock-config-label">Time Format</label>
                  <select className="form-select clock-config-select" value={autopilot.clockTimeFormat} onChange={(e) => handleClockSetting('clockTimeFormat', e.target.value)} data-testid="select-time-format">
                    <option value="12h">12-hour</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>
                <div className="clock-config-group">
                  <label className="clock-config-label">Time Zone</label>
                  <select className="form-select clock-config-select" value={autopilot.clockTimeZone} onChange={(e) => handleClockSetting('clockTimeZone', e.target.value)} data-testid="select-timezone">
                    {US_TIME_ZONES.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
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
          data-testid="nav-overview"
        >
          <Activity size={18} />
          Overview
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
          data-testid="nav-leads"
        >
          <Inbox size={18} />
          Leads
          {leadStats && leadStats.urgentCount > 0 && (
            <span className="admin-nav-badge" data-testid="leads-urgent-count">{leadStats.urgentCount}</span>
          )}
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'organizations' ? 'active' : ''}`}
          onClick={() => setActiveTab('organizations')}
          data-testid="nav-organizations"
        >
          <Building2 size={18} />
          Organizations
        </button>
        <button
          className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
          data-testid="nav-users"
        >
          <Users size={18} />
          Users
        </button>
      </nav>

      {/* Content */}
      <main className="admin-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="admin-overview" data-testid="overview-tab">
            <div className="overview-cards-grid" data-testid="overview-cards">
              <div
                className="overview-card overview-card-clickable"
                onClick={() => setShowSubscriptionDetail(!showSubscriptionDetail)}
                data-testid="card-subscriptions"
              >
                <div className="overview-card-icon overview-card-icon-primary">
                  <CreditCard size={22} />
                </div>
                <div className="overview-card-body">
                  <div className="overview-card-value" data-testid="text-subscription-count">
                    {stats.subscriptions?.total ?? 0}
                  </div>
                  <div className="overview-card-label">Active Subscriptions</div>
                  <div className="overview-card-breakdown" data-testid="text-subscription-breakdown">
                    <span>{stats.subscriptions?.monthly ?? 0} Monthly</span>
                    <span className="overview-card-sep">·</span>
                    <span>{stats.subscriptions?.annual ?? 0} Annual</span>
                  </div>
                </div>
                <ExternalLink size={14} className="overview-card-arrow" />
              </div>

              <div
                className="overview-card overview-card-clickable"
                onClick={() => setActiveTab('leads')}
                data-testid="card-leads"
              >
                <div className="overview-card-icon overview-card-icon-warning">
                  <Inbox size={22} />
                </div>
                <div className="overview-card-body">
                  <div className="overview-card-value" data-testid="text-open-leads">
                    {stats.openLeads ?? 0}
                  </div>
                  <div className="overview-card-label">Open Leads</div>
                  {(stats.urgentLeads ?? 0) > 0 && (
                    <div className="overview-card-urgent" data-testid="text-urgent-leads">
                      <AlertTriangle size={12} />
                      {stats.urgentLeads} urgent
                    </div>
                  )}
                </div>
                <ExternalLink size={14} className="overview-card-arrow" />
              </div>

              <div
                className="overview-card overview-card-clickable"
                onClick={() => setActiveTab('organizations')}
                data-testid="card-organizations"
              >
                <div className="overview-card-icon overview-card-icon-info">
                  <Building2 size={22} />
                </div>
                <div className="overview-card-body">
                  <div className="overview-card-value" data-testid="text-org-count">
                    {stats.organizationsByStatus['ACTIVE'] || 0}
                  </div>
                  <div className="overview-card-label">Active Organizations</div>
                  <div className="overview-card-breakdown">
                    <span>{stats.totalOrganizations} total</span>
                  </div>
                </div>
                <ExternalLink size={14} className="overview-card-arrow" />
              </div>

              <div className="overview-card" data-testid="card-locations">
                <div className="overview-card-icon overview-card-icon-neutral">
                  <MapPin size={22} />
                </div>
                <div className="overview-card-body">
                  <div className="overview-card-value" data-testid="text-location-count">
                    {stats.totalLocations}
                  </div>
                  <div className="overview-card-label">Locations</div>
                </div>
              </div>
            </div>

            {showSubscriptionDetail && (
              <div className="overview-detail-panel" data-testid="subscription-detail-panel">
                <div className="overview-detail-header">
                  <h3>Subscription Details</h3>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowSubscriptionDetail(false)}
                    data-testid="button-close-subscription-detail"
                  >
                    <X size={16} />
                  </button>
                </div>
                {(stats.subscriptions?.details?.length ?? 0) === 0 ? (
                  <div className="overview-detail-empty">
                    <CreditCard size={32} />
                    <p>No active subscriptions yet</p>
                  </div>
                ) : (
                  <div className="overview-detail-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Organization</th>
                          <th>Plan</th>
                          <th>Started</th>
                          <th>Renews</th>
                          <th>Locations</th>
                          <th>Users</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(stats.subscriptions?.details ?? []).map((sub) => (
                          <tr key={sub.id} data-testid={`row-subscription-${sub.id}`}>
                            <td className="overview-detail-name">{sub.name}</td>
                            <td>
                              <span className={`admin-badge-sm ${sub.subscriptionPlan === 'ANNUAL' ? 'badge-success' : 'badge-info'}`}>
                                {sub.subscriptionPlan || '—'}
                              </span>
                            </td>
                            <td>
                              {sub.subscriptionStartedAt
                                ? new Date(sub.subscriptionStartedAt).toLocaleDateString()
                                : '—'}
                            </td>
                            <td>
                              {sub.subscriptionRenewsAt
                                ? new Date(sub.subscriptionRenewsAt).toLocaleDateString()
                                : '—'}
                            </td>
                            <td>{sub._count.locations}</td>
                            <td>{sub._count.users}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="admin-stats-breakdown" data-testid="status-breakdown">
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
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="admin-leads" data-testid="leads-tab">
            <div className="leads-header-row">
              <h2>Leads Pipeline</h2>
              <div className="leads-header-right">
                <div className="leads-search" data-testid="leads-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search name, email, company..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    data-testid="input-lead-search"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingLead(null);
                    resetLeadForm();
                    setShowLeadModal(true);
                  }}
                  data-testid="button-new-lead"
                >
                  <Plus size={16} />
                  New Lead
                </button>
              </div>
            </div>

            <div className="leads-quick-tabs" data-testid="leads-quick-tabs">
              <button
                className={`leads-quick-tab ${leadFilterType === '' ? 'active' : ''}`}
                onClick={() => setLeadFilterType('')}
                data-testid="tab-all-leads"
              >
                All
                {leadStats && <span className="leads-quick-tab-count">{leadStats.totalLeads}</span>}
              </button>
              {(['DEMO_REQUEST', 'TRIAL_REQUEST', 'QUESTION', 'CALLBACK'] as const).map((type) => (
                <button
                  key={type}
                  className={`leads-quick-tab ${LEAD_TYPE_COLORS[type]} ${leadFilterType === type ? 'active' : ''}`}
                  onClick={() => setLeadFilterType(leadFilterType === type ? '' : type)}
                  data-testid={`tab-${type.toLowerCase()}`}
                >
                  {LEAD_TYPE_LABELS[type]}
                  {leadStats?.byType[type] != null && (
                    <span className="leads-quick-tab-count">{leadStats.byType[type]}</span>
                  )}
                </button>
              ))}
              {leadStats && leadStats.urgentCount > 0 && (
                <button
                  className={`leads-quick-tab leads-quick-tab-urgent ${leadSort === 'urgent' ? 'active' : ''}`}
                  onClick={() => setLeadSort(leadSort === 'urgent' ? 'newest' : 'urgent')}
                  data-testid="tab-urgent"
                >
                  <AlertTriangle size={13} />
                  Urgent
                  <span className="leads-quick-tab-count">{leadStats.urgentCount}</span>
                </button>
              )}
            </div>

            <div className="leads-filter-row">
              <select
                value={leadFilterStatus}
                onChange={(e) => setLeadFilterStatus(e.target.value)}
                className="leads-filter-select"
                data-testid="select-lead-status-filter"
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="DEMO_SENT">Demo Sent</option>
                <option value="TRIAL">Trial</option>
                <option value="SUBSCRIBED">Subscribed</option>
                <option value="EXPIRED">Expired</option>
                <option value="DISQUALIFIED">Disqualified</option>
              </select>
              <select
                value={leadSort}
                onChange={(e) => setLeadSort(e.target.value)}
                className="leads-filter-select"
                data-testid="select-lead-sort"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="urgent">Most Urgent</option>
              </select>
            </div>

            <div className="leads-list" data-testid="leads-list">
              {leads.map((lead) => {
                const viability = getViabilityInfo(lead);
                return (
                  <div key={lead.id} className="lead-card" data-testid={`lead-card-${lead.id}`}>
                    <div className="lead-card-top">
                      <div className="lead-card-name">
                        <h3 data-testid={`text-lead-name-${lead.id}`}>
                          {lead.firstName} {lead.lastName}
                        </h3>
                        {lead.companyName && (
                          <span className="lead-card-company" data-testid={`text-lead-company-${lead.id}`}>
                            {lead.companyName}
                          </span>
                        )}
                      </div>
                      <div className="lead-card-badges">
                        <span className={`lead-badge ${LEAD_TYPE_COLORS[lead.leadType] || ''}`}>
                          {LEAD_TYPE_LABELS[lead.leadType] || lead.leadType}
                        </span>
                        <span className={`lead-badge ${LEAD_STATUS_COLORS[lead.status] || ''}`}>
                          {LEAD_STATUS_LABELS[lead.status] || lead.status}
                        </span>
                      </div>
                    </div>
                    <div className="lead-card-details">
                      <div className="lead-card-contact">
                        <span className="lead-detail">
                          <Mail size={13} />
                          {lead.email}
                        </span>
                        {lead.phone && (
                          <span className="lead-detail">
                            <Phone size={13} />
                            {lead.phone}
                          </span>
                        )}
                        {lead.state && (
                          <span className="lead-detail">
                            <MapPin size={13} />
                            {lead.state}
                          </span>
                        )}
                      </div>
                      <div className="lead-card-right">
                        <div className={`lead-viability ${viability.className}`} data-testid={`text-viability-${lead.id}`}>
                          <Clock size={13} />
                          {viability.label}
                        </div>
                        <span className="lead-card-date">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="lead-card-notes">
                        <MessageSquare size={12} />
                        <span>{lead.notes}</span>
                      </div>
                    )}
                    <div className="lead-card-actions">
                      <select
                        value={lead.status}
                        onChange={(e) => handleLeadStatusChange(lead, e.target.value as LeadStatusType)}
                        className="lead-status-select"
                        data-testid={`select-lead-status-${lead.id}`}
                      >
                        {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEditLead(lead)}
                        data-testid={`button-edit-lead-${lead.id}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-danger"
                        onClick={() => handleDeleteLead(lead.id)}
                        data-testid={`button-delete-lead-${lead.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {leads.length === 0 && (
                <div className="admin-empty-state">
                  <Inbox size={48} />
                  <h3>No leads yet</h3>
                  <p>Add your first lead or connect your marketing site forms</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="admin-organizations">
            {/* Expiring Soon Alert */}
            {expiringOrgs.length > 0 && (
              <div className="admin-alert-expiring">
                <AlertTriangle size={20} />
                <div>
                  <strong>Expiring Soon</strong>
                  <ul>
                    {expiringOrgs.map((org) => {
                      const days = getDaysRemaining(org.trialEndsAt);
                      return (
                        <li key={org.id}>
                          {org.name} — {days === 0 ? 'expires today' : `${days} day${days === 1 ? '' : 's'} remaining`}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            <div className="admin-section-header">
              <h2>Organizations</h2>
              <div className="admin-section-header-btns">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowCreateAccount(!showCreateAccount);
                    setCreateAccountError('');
                  }}
                >
                  <UserPlus size={16} />
                  Create Account
                </button>
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
            </div>

            {/* Create Account Inline Form */}
            {showCreateAccount && (
              <div className="admin-create-form">
                <h3>Create New Account</h3>
                <p>
                  Creates an organization, a default location, and an admin user in one step.
                </p>
                <form onSubmit={handleCreateAccount}>
                  <div className="admin-create-form-grid">
                    <div className="form-group">
                      <label htmlFor="acctEmail">Email</label>
                      <input
                        id="acctEmail"
                        type="email"
                        value={createAccountForm.email}
                        onChange={(e) => setCreateAccountForm({ ...createAccountForm, email: e.target.value })}
                        placeholder="owner@restaurant.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="acctPassword">Password</label>
                      <input
                        id="acctPassword"
                        type="password"
                        value={createAccountForm.password}
                        onChange={(e) => setCreateAccountForm({ ...createAccountForm, password: e.target.value })}
                        placeholder="Min 8 characters"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="acctCompany">Company Name</label>
                      <input
                        id="acctCompany"
                        type="text"
                        value={createAccountForm.companyName}
                        onChange={(e) => setCreateAccountForm({ ...createAccountForm, companyName: e.target.value })}
                        placeholder="Restaurant name (optional)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="acctStatus">Status</label>
                      <select
                        id="acctStatus"
                        value={createAccountForm.subscriptionStatus}
                        onChange={(e) => setCreateAccountForm({ ...createAccountForm, subscriptionStatus: e.target.value })}
                      >
                        <option value="DEMO">Demo</option>
                        <option value="TRIAL">Trial</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="acctDuration">Duration (days)</label>
                      <input
                        id="acctDuration"
                        type="number"
                        min={1}
                        max={365}
                        value={createAccountForm.durationDays}
                        onChange={(e) => setCreateAccountForm({ ...createAccountForm, durationDays: parseInt(e.target.value) || 14 })}
                      />
                    </div>
                    <div className="admin-create-form-preview">
                      <span>
                        <Clock size={14} />
                        Ends: {getEndDatePreview()}
                      </span>
                    </div>
                  </div>

                  {createAccountError && (
                    <div className="admin-error admin-action-error">
                      <AlertTriangle size={16} />
                      {createAccountError}
                    </div>
                  )}

                  <div className="admin-create-form-actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setShowCreateAccount(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <Check size={16} />
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-org-list">
              {organizations.map((org) => {
                const daysRemaining = getDaysRemaining(org.trialEndsAt);
                const isExpiringSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;

                return (
                  <div key={org.id} className="admin-org-card">
                    {/* Row 1: Expand + Name + Badge + Expires */}
                    <div className="admin-org-row-top" onClick={() => toggleOrgExpanded(org.id)}>
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
                      <div className={`admin-org-expires ${isExpiringSoon ? 'admin-org-expires-urgent' : ''}`}>
                        {org.trialEndsAt ? (
                          <>
                            <Clock size={12} />
                            <span>
                              {new Date(org.trialEndsAt).toLocaleDateString()}
                              {isExpiringSoon && (
                                <span className="admin-org-expires-sub">
                                  {daysRemaining === 0 ? 'Expires today' : `${daysRemaining}d left`}
                                </span>
                              )}
                            </span>
                          </>
                        ) : (
                          <span>No expiry</span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Counts + Action Buttons + Edit/Delete */}
                    <div className="admin-org-row-meta">
                      <div className="admin-org-counts">
                        <span>
                          <Users size={14} /> {org._count?.users || 0} users
                        </span>
                        <span>
                          <MapPin size={14} /> {org._count?.locations || 0} locations
                        </span>
                      </div>
                      <div className="admin-org-actions">
                        {org.subscriptionStatus !== 'TRIAL' && org.subscriptionStatus !== 'ACTIVE' && (
                          <button
                            className="admin-action-btn admin-action-btn-trial"
                            onClick={(e) => { e.stopPropagation(); handleOrgAction(org, 'upgrade-trial'); }}
                            disabled={actionLoading[org.id]}
                          >
                            Trial
                          </button>
                        )}
                        {org.subscriptionStatus !== 'ACTIVE' && (
                          <button
                            className="admin-action-btn admin-action-btn-active"
                            onClick={(e) => { e.stopPropagation(); handleOrgAction(org, 'upgrade-active'); }}
                            disabled={actionLoading[org.id]}
                          >
                            Active
                          </button>
                        )}
                        {org.trialEndsAt && (
                          <button
                            className="admin-action-btn admin-action-btn-extend"
                            onClick={(e) => { e.stopPropagation(); handleOrgAction(org, 'extend-30'); }}
                            disabled={actionLoading[org.id]}
                          >
                            +30d
                          </button>
                        )}
                        {org.subscriptionStatus !== 'SUSPENDED' && (
                          <button
                            className="admin-action-btn admin-action-btn-suspend"
                            onClick={(e) => { e.stopPropagation(); handleOrgAction(org, 'suspend'); }}
                            disabled={actionLoading[org.id]}
                          >
                            Suspend
                          </button>
                        )}
                        {actionLoading[org.id] && <Loader2 size={14} className="loading-spinner" />}
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

                    {/* Inline action error */}
                    {actionErrors[org.id] && (
                      <div className="admin-error admin-action-error">
                        <AlertTriangle size={14} />
                        {actionErrors[org.id]}
                      </div>
                    )}

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
                );
              })}

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
          <div className="admin-users" data-testid="users-tab">
            <div className="users-header-row">
              <h2>Users</h2>
              <div className="users-header-right">
                <div className="users-search" data-testid="users-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search email, organization..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    data-testid="input-user-search"
                  />
                </div>
                <select
                  className="leads-filter-select"
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  data-testid="select-user-role"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="DATA">Data</option>
                </select>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingUser(null);
                    setUserForm({ organizationId: '', email: '', password: '', role: 'ADMIN' });
                    setShowUserModal(true);
                  }}
                  data-testid="button-new-user"
                >
                  <Plus size={16} />
                  New User
                </button>
              </div>
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
                  {users
                    .filter((user) => {
                      const searchLower = userSearch.toLowerCase();
                      const matchesSearch = !userSearch || 
                        user.email.toLowerCase().includes(searchLower) ||
                        (user.organization?.name || '').toLowerCase().includes(searchLower) ||
                        (user.location?.name || '').toLowerCase().includes(searchLower);
                      const matchesRole = !userRoleFilter || user.role === userRoleFilter;
                      return matchesSearch && matchesRole;
                    })
                    .map((user) => (
                    <tr key={user.id} data-testid={`row-user-${user.id}`}>
                      <td data-testid={`text-user-email-${user.id}`}>{user.email}</td>
                      <td>{user.organization?.name || '—'}</td>
                      <td>{user.location?.name || '—'}</td>
                      <td>
                        <span className={`admin-badge-sm ${user.role === 'ADMIN' ? 'badge-admin' : user.role === 'MANAGER' ? 'badge-manager' : 'badge-data'}`} data-testid={`text-user-role-${user.id}`}>
                          {user.role}
                        </span>
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
                          data-testid={`button-edit-user-${user.id}`}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-danger"
                          onClick={() => handleDeleteUser(user.id)}
                          data-testid={`button-delete-user-${user.id}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.filter((user) => {
                const searchLower = userSearch.toLowerCase();
                const matchesSearch = !userSearch || 
                  user.email.toLowerCase().includes(searchLower) ||
                  (user.organization?.name || '').toLowerCase().includes(searchLower) ||
                  (user.location?.name || '').toLowerCase().includes(searchLower);
                const matchesRole = !userRoleFilter || user.role === userRoleFilter;
                return matchesSearch && matchesRole;
              }).length === 0 && (
                <div className="admin-empty-state">
                  <Users size={48} />
                  <h3>{userSearch || userRoleFilter ? 'No matching users' : 'No users yet'}</h3>
                  <p>{userSearch || userRoleFilter ? 'Try adjusting your search or filters' : 'Create an organization first, then add users'}</p>
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

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="admin-modal-overlay" onClick={() => setShowLeadModal(false)}>
          <div className="admin-modal admin-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingLead ? 'Edit Lead' : 'New Lead'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowLeadModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveLead}>
              <div className="admin-modal-body">
                <div className="lead-form-grid">
                  <div className="form-group">
                    <label htmlFor="leadFirstName">First Name</label>
                    <input
                      id="leadFirstName"
                      type="text"
                      value={leadForm.firstName}
                      onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
                      placeholder="First name"
                      required
                      data-testid="input-lead-first-name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="leadLastName">Last Name</label>
                    <input
                      id="leadLastName"
                      type="text"
                      value={leadForm.lastName}
                      onChange={(e) => setLeadForm({ ...leadForm, lastName: e.target.value })}
                      placeholder="Last name"
                      required
                      data-testid="input-lead-last-name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="leadEmail">Email</label>
                    <input
                      id="leadEmail"
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="contact@restaurant.com"
                      required
                      data-testid="input-lead-email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="leadPhone">Phone</label>
                    <input
                      id="leadPhone"
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      data-testid="input-lead-phone"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="leadCompany">Company Name</label>
                    <input
                      id="leadCompany"
                      type="text"
                      value={leadForm.companyName}
                      onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                      placeholder="Restaurant name"
                      data-testid="input-lead-company"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="leadState">State</label>
                    <select
                      id="leadState"
                      value={leadForm.state}
                      onChange={(e) => setLeadForm({ ...leadForm, state: e.target.value })}
                      data-testid="select-lead-state"
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="leadType">Request Type</label>
                    <select
                      id="leadType"
                      value={leadForm.leadType}
                      onChange={(e) => setLeadForm({ ...leadForm, leadType: e.target.value as LeadType })}
                      data-testid="select-lead-type"
                    >
                      <option value="DEMO_REQUEST">Demo Request</option>
                      <option value="TRIAL_REQUEST">Trial Request</option>
                      <option value="QUESTION">Question</option>
                      <option value="CALLBACK">Callback</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="leadViability">Viability Window (days)</label>
                    <input
                      id="leadViability"
                      type="number"
                      min={1}
                      max={90}
                      value={leadForm.viabilityDays}
                      onChange={(e) => setLeadForm({ ...leadForm, viabilityDays: parseInt(e.target.value) || 5 })}
                      data-testid="input-lead-viability"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="leadSource">Source</label>
                    <input
                      id="leadSource"
                      type="text"
                      value={leadForm.source}
                      onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                      placeholder="e.g., Website, Referral, Trade Show"
                      data-testid="input-lead-source"
                    />
                  </div>
                </div>
                <div className="form-group lead-form-notes">
                  <label htmlFor="leadNotes">Notes</label>
                  <textarea
                    id="leadNotes"
                    rows={3}
                    value={leadForm.notes}
                    onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                    placeholder="Any additional notes about this lead..."
                    data-testid="input-lead-notes"
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowLeadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" data-testid="button-save-lead">
                  <Check size={16} />
                  {editingLead ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
