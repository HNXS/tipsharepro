'use client';

import { useState, useRef, useEffect } from 'react';
import { useDemo } from '@/lib/DemoContext';
import {
  WHOLE_WEIGHT_OPTIONS,
  HELP_TEXT,
  ContributionMethod,
  getContributionRateOptions,
  CONTRIBUTION_METHOD_LABELS,
  CategoryColor,
  CATEGORY_COLOR_MAP,
  isSalesBasedMethod,
} from '@/lib/types';
import HelpTooltip from './HelpTooltip';
import { InlineCategoryDot } from './CategoryBadge';
import { Lock, ChevronRight, RotateCcw, GripVertical, X, Plus, Printer, Navigation, FlaskConical, TableProperties, Database, UserCircle, LogOut, Users, UserPlus, Trash2, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import PrintDialog from './PrintDialog';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api/users';
import type { OrgUser, CreateUserRequest } from '@/lib/api/users';
import { getAuthorizedContacts, createAuthorizedContact, updateAuthorizedContact, deleteAuthorizedContact } from '@/lib/api/authorizedContacts';
import type { AuthorizedContact, CreateContactRequest } from '@/lib/api/authorizedContacts';
import { updateSettings as apiUpdateSettings } from '@/lib/api/settings';

// The 5 category color keys in display order
const CATEGORY_COLORS: CategoryColor[] = ['boh', 'foh', 'bar', 'support', 'custom'];

// CSS hex colors for category backgrounds
const CATEGORY_HEX: Record<CategoryColor, string> = {
  boh: '#E85D04',
  foh: '#8E44AD',
  bar: '#35A0D2',
  support: '#82B536',
  custom: '#F1C40F',
};

export default function SettingsPage() {
  const {
    state,
    updateSettings,
    setContributionMethod,
    updateCategoryWeight,
    updateCategoryName,
    moveJobToCategory,
    addJobToCategory,
    removeJob,
    setCurrentStep,
    resetSettingsToDefaults,
    resetToDefaults,
    handleLogout,
    setSelectedLocationName,
  } = useDemo();

  const { settings } = state;
  const isDemo = state.subscriptionStatus === 'DEMO';
  const userRole = state.user?.role;
  const contributionRateOptions = getContributionRateOptions(settings.contributionMethod);

  // Only Admin can access settings page (full version)
  if (!isDemo && userRole !== 'ADMIN') {
    return (
      <div className="content-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="text-secondary">Settings are managed by your Admin.</p>
          <p className="text-tertiary" style={{ marginTop: '0.5rem' }}>
            Contact your restaurant administrator to make changes.
          </p>
        </div>
      </div>
    );
  }

  // Local state for monthly estimate input (only format with commas on blur)
  const [monthlyInputValue, setMonthlyInputValue] = useState(
    settings.estimatedMonthlySales > 0 ? settings.estimatedMonthlySales.toLocaleString('en-US') : '0'
  );
  const [monthlyInputFocused, setMonthlyInputFocused] = useState(false);
  
  // Ref for the contribution rate select to focus on Enter
  const contributionRateRef = useRef<HTMLSelectElement>(null);

  // Sync from external state when not focused
  useEffect(() => {
    if (!monthlyInputFocused) {
      setMonthlyInputValue(
        settings.estimatedMonthlySales > 0 ? settings.estimatedMonthlySales.toLocaleString('en-US') : '0'
      );
    }
  }, [settings.estimatedMonthlySales, monthlyInputFocused]);

  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  // "Go To..." dropdown state
  const [goToOpen, setGoToOpen] = useState(false);
  const goToRef = useRef<HTMLDivElement>(null);

  // Card 1: Day/Date/Time state
  const [card1Open, setCard1Open] = useState(false);
  const [dateFormat, setDateFormat] = useState<'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'Mon DD, YYYY'>('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [timeZone, setTimeZone] = useState('America/New_York');
  const [now, setNow] = useState(new Date());
  const card1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!card1Open) return;
    const handleClick = (e: MouseEvent) => {
      if (card1Ref.current && !card1Ref.current.contains(e.target as Node)) {
        setCard1Open(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [card1Open]);

  const formatCurrentDate = () => {
    const opts: Intl.DateTimeFormatOptions = { timeZone };
    const d = new Date(now.toLocaleString('en-US', { timeZone }));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone });
    let dateStr = '';
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    switch (dateFormat) {
      case 'MM/DD/YYYY': dateStr = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`; break;
      case 'DD/MM/YYYY': dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`; break;
      case 'YYYY-MM-DD': dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; break;
      case 'Mon DD, YYYY': dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone }); break;
    }
    let timeStr = '';
    if (timeFormat === '12h') {
      timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone });
    } else {
      timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
    }
    return { dayName, dateStr, timeStr };
  };

  const US_TIME_ZONES = [
    { value: 'America/New_York', label: 'Eastern (ET)' },
    { value: 'America/Chicago', label: 'Central (CT)' },
    { value: 'America/Denver', label: 'Mountain (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
    { value: 'America/Anchorage', label: 'Alaska (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii (HT)' },
  ];

  // Card 1: Locations state
  interface LocationEntry {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    nickname: string;
  }

  const [locCardOpen, setLocCardOpen] = useState(false);
  const [editingLocId, setEditingLocId] = useState<number | null>(null);
  const locCardRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<LocationEntry[]>([
    { id: 1, name: "Mario's Italian Kitchen", address: '412 Main St', city: 'New York', state: 'NY', zip: '10001', nickname: "Mario's Midtown" },
    { id: 2, name: 'Sunset Grill & Bar', address: '8800 Sunset Blvd', city: 'Los Angeles', state: 'CA', zip: '90069', nickname: 'Sunset Strip' },
    { id: 3, name: 'Deep Dish House', address: '233 N Michigan Ave', city: 'Chicago', state: 'IL', zip: '60601', nickname: 'The Loop Spot' },
    { id: 4, name: 'Gulf Coast Seafood', address: '1500 Westheimer Rd', city: 'Houston', state: 'TX', zip: '77006', nickname: 'Montrose Location' },
  ]);
  const [selectedLocId, setSelectedLocId] = useState(1);
  const [currentLocId, setCurrentLocId] = useState(1);

  useEffect(() => {
    if (!locCardOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (locCardRef.current && !locCardRef.current.contains(e.target as Node)) {
        setLocCardOpen(false);
        setEditingLocId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [locCardOpen]);

  const updateLocation = (id: number, field: keyof LocationEntry, value: string) => {
    setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, [field]: value } : loc));
  };

  const setCurrentLocation = async (id: number) => {
    setCurrentLocId(id);
    const loc = locations.find(l => l.id === id);
    if (loc) {
      setSelectedLocationName(loc.name);
    }
    if (!isDemo) {
      try {
        await apiUpdateSettings({ currentLocationId: String(id) });
      } catch (err) {
        console.error('Failed to save current location:', err);
      }
    }
  };

  const selectedLocation = locations.find(l => l.id === selectedLocId);
  const currentLocation = locations.find(l => l.id === currentLocId);

  useEffect(() => {
    if (currentLocation) {
      setSelectedLocationName(currentLocation.name);
    }
  }, [currentLocation?.name, setSelectedLocationName]);

  // Card 3: Pay Period state
  type PayFrequency = 'weekly' | 'biweekly' | 'bimonthly';
  type PayDayType = 'dayOfWeek' | 'datesOfMonth';

  const [payCardOpen, setPayCardOpen] = useState(false);
  const payCardRef = useRef<HTMLDivElement>(null);
  const [periodStartDate, setPeriodStartDate] = useState('2026-02-23');
  const [periodEndDate, setPeriodEndDate] = useState('2026-03-01');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('weekly');
  const [payDayType, setPayDayType] = useState<PayDayType>('dayOfWeek');
  const [payDayOfWeek, setPayDayOfWeek] = useState(4);
  const [payDayDate1, setPayDayDate1] = useState(5);
  const [payDayDate2, setPayDayDate2] = useState(20);
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'next'>('current');
  const [payPeriodsConfigured, setPayPeriodsConfigured] = useState(false);
  const [payConfigError, setPayConfigError] = useState('');

  const [draftStartDate, setDraftStartDate] = useState(periodStartDate);
  const [draftEndDate, setDraftEndDate] = useState(periodEndDate);
  const [draftPayDayType, setDraftPayDayType] = useState<PayDayType>(payDayType);
  const [draftPayDayOfWeek, setDraftPayDayOfWeek] = useState(payDayOfWeek);
  const [draftPayDayDate1, setDraftPayDayDate1] = useState(payDayDate1);
  const [draftPayDayDate2, setDraftPayDayDate2] = useState(payDayDate2);

  const resetDrafts = () => {
    setDraftStartDate(periodStartDate);
    setDraftEndDate(periodEndDate);
    setDraftPayDayType(payDayType);
    setDraftPayDayOfWeek(payDayOfWeek);
    setDraftPayDayDate1(payDayDate1);
    setDraftPayDayDate2(payDayDate2);
    setPayConfigError('');
  };

  const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDraftFrequency = (): PayFrequency => {
    if (!draftStartDate || !draftEndDate) return payFrequency;
    const start = new Date(draftStartDate + 'T00:00:00');
    const end = new Date(draftEndDate + 'T00:00:00');
    const span = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (span === 7) return 'weekly';
    if (span === 14) return 'biweekly';
    if (span >= 13 && span <= 16) return 'bimonthly';
    return payFrequency;
  };

  const saveDrafts = () => {
    const freq = getDraftFrequency();
    if (freq !== 'bimonthly' && draftPayDayType === 'datesOfMonth') {
      setDraftPayDayType('dayOfWeek');
    }
    const start = new Date(draftStartDate + 'T00:00:00');
    const end = new Date(draftEndDate + 'T00:00:00');
    if (end <= start) {
      setPayConfigError('Last day must be after first day.');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (end < today) {
      setPayConfigError('Pay period cannot be entirely in the past.');
      return;
    }
    const span = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (span !== 7 && span !== 14 && !(span >= 13 && span <= 16)) {
      setPayConfigError('Period must be 7 days (weekly), 14 days (bi-weekly), or ~15 days (bi-monthly).');
      return;
    }
    if (freq === 'bimonthly' && start.getDate() !== 1 && start.getDate() !== 16) {
      setPayConfigError('Bi-monthly periods must start on the 1st or 16th of the month.');
      return;
    }
    setPayConfigError('');
    setPeriodStartDate(draftStartDate);
    setPeriodEndDate(draftEndDate);
    setPayFrequency(getDraftFrequency());
    setPayDayType(draftPayDayType);
    setPayDayOfWeek(draftPayDayOfWeek);
    setPayDayDate1(draftPayDayDate1);
    setPayDayDate2(draftPayDayDate2);
    setPayPeriodsConfigured(true);
  };

  useEffect(() => {
    if (!payCardOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (payCardRef.current && !payCardRef.current.contains(e.target as Node)) {
        setPayCardOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [payCardOpen]);

  const computePayPeriods = () => {
    if (!periodStartDate || !periodEndDate) return { current: null, next: null, currentPayDay: null, nextPayDay: null };
    const start = new Date(periodStartDate + 'T00:00:00');
    const end = new Date(periodEndDate + 'T00:00:00');
    const span = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    let nextStart: Date;
    let nextEnd: Date;

    if (payFrequency === 'bimonthly') {
      if (start.getDate() === 1) {
        nextStart = new Date(start.getFullYear(), start.getMonth(), 16);
        nextEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      } else {
        nextStart = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        nextEnd = new Date(start.getFullYear(), start.getMonth() + 1, 15);
      }
    } else {
      nextStart = new Date(end.getTime() + 86400000);
      nextEnd = new Date(nextStart.getTime() + (span - 1) * 86400000);
    }

    const getPayDay = (periodEnd: Date): Date => {
      if (payDayType === 'dayOfWeek') {
        const d = new Date(periodEnd.getTime());
        while (d.getDay() !== payDayOfWeek) {
          d.setDate(d.getDate() + 1);
        }
        return d;
      } else {
        const afterEnd = new Date(periodEnd.getTime());
        const candidates = [payDayDate1, payDayDate2].sort((a, b) => a - b);
        for (const c of candidates) {
          const test = new Date(afterEnd.getFullYear(), afterEnd.getMonth(), c);
          if (test >= afterEnd) return test;
        }
        const test = new Date(afterEnd.getFullYear(), afterEnd.getMonth() + 1, candidates[0]);
        return test;
      }
    };

    const computeNextPeriod = (pStart: Date, pEnd: Date): { start: Date; end: Date } => {
      const s = Math.round((pEnd.getTime() - pStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (payFrequency === 'bimonthly') {
        if (pStart.getDate() === 1) {
          return { start: new Date(pStart.getFullYear(), pStart.getMonth(), 16), end: new Date(pStart.getFullYear(), pStart.getMonth() + 1, 0) };
        } else {
          return { start: new Date(pStart.getFullYear(), pStart.getMonth() + 1, 1), end: new Date(pStart.getFullYear(), pStart.getMonth() + 1, 15) };
        }
      }
      const ns = new Date(pEnd.getTime() + 86400000);
      return { start: ns, end: new Date(ns.getTime() + (s - 1) * 86400000) };
    };

    const thirdPeriod = computeNextPeriod(nextStart, nextEnd);

    return {
      current: { start, end },
      next: { start: nextStart, end: nextEnd },
      currentPayDay: getPayDay(end),
      nextPayDay: getPayDay(nextEnd),
      getPayDay,
      computeNextPeriod,
    };
  };

  const payPeriods = computePayPeriods();

  useEffect(() => {
    if (!payPeriodsConfigured || !payPeriods.current || !payPeriods.currentPayDay) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayAfterPayDay = new Date(payPeriods.currentPayDay.getTime() + 86400000);
    dayAfterPayDay.setHours(0, 0, 0, 0);

    if (today >= dayAfterPayDay && payPeriods.next) {
      const newStart = payPeriods.next.start;
      const newEnd = payPeriods.next.end;
      const fmt = (d: Date) => `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
      setPeriodStartDate(fmt(newStart));
      setPeriodEndDate(fmt(newEnd));
    }
  }, [payPeriodsConfigured]);

  const formatShortDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (d: Date) => {
    const dayAbbr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const rest = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${dayAbbr}-${rest}`;
  };

  const freqLabel = (f: PayFrequency) => {
    switch (f) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Bi-Weekly';
      case 'bimonthly': return 'Bi-Monthly';
    }
  };

  useEffect(() => {
    if (!goToOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (goToRef.current && !goToRef.current.contains(e.target as Node)) {
        setGoToOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [goToOpen]);

  // Card 5: Authorized Emails state
  const [emailCardOpen, setEmailCardOpen] = useState(false);
  const emailCardRef = useRef<HTMLDivElement>(null);
  const [authorizedContacts, setAuthorizedContacts] = useState<AuthorizedContact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [addContactForm, setAddContactForm] = useState<CreateContactRequest>({ name: '', company: '', email: '' });
  const [addContactLoading, setAddContactLoading] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [showContactSaved, setShowContactSaved] = useState(false);
  const [contactSavedKey, setContactSavedKey] = useState(0);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const loadContacts = async () => {
    if (isDemo) return;
    try {
      setContactsLoading(true);
      setContactsError(null);
      const list = await getAuthorizedContacts();
      setAuthorizedContacts(list);
    } catch (err) {
      setContactsError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setContactsLoading(false);
    }
  };

  const flashContactSaved = () => {
    setContactSavedKey(k => k + 1);
    setShowContactSaved(true);
    setTimeout(() => setShowContactSaved(false), 1800);
  };

  const handleAddContact = async () => {
    if (!addContactForm.name || !addContactForm.email) return;
    try {
      setAddContactLoading(true);
      await createAuthorizedContact(addContactForm);
      setAddContactForm({ name: '', company: '', email: '' });
      setShowAddContactForm(false);
      await loadContacts();
      flashContactSaved();
    } catch (err) {
      setContactsError(err instanceof Error ? err.message : 'Failed to add contact');
    } finally {
      setAddContactLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteAuthorizedContact(id);
      await loadContacts();
      flashContactSaved();
    } catch (err) {
      setContactsError(err instanceof Error ? err.message : 'Failed to delete contact');
    }
    setDeleteContactId(null);
  };

  // Card 4: Team & Permissions state
  const [teamCardOpen, setTeamCardOpen] = useState(false);
  const teamCardRef = useRef<HTMLDivElement>(null);
  const [teamUsers, setTeamUsers] = useState<OrgUser[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [addUserForm, setAddUserForm] = useState<CreateUserRequest>({ firstName: '', lastName: '', email: '', password: '', role: 'DATA' });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showTeamSaved, setShowTeamSaved] = useState(false);
  const [teamSavedKey, setTeamSavedKey] = useState(0);
  const [adminAckDialog, setAdminAckDialog] = useState<{ userId: string; name: string } | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const loadTeamData = async () => {
    if (isDemo) return;
    try {
      setTeamLoading(true);
      setTeamError(null);
      const userList = await getUsers();
      setTeamUsers(userList);
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to load team');
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      loadTeamData();
    }
  }, []);

  useEffect(() => {
    if (teamCardOpen && !isDemo) {
      loadTeamData();
    }
  }, [teamCardOpen]);

  useEffect(() => {
    if (!teamCardOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (teamCardRef.current && !teamCardRef.current.contains(e.target as Node)) {
        setTeamCardOpen(false);
        setShowAddUserForm(false);
        setEditingUserId(null);
        setAdminAckDialog(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [teamCardOpen]);

  // Card 5: load contacts when opened
  useEffect(() => {
    if (emailCardOpen && !isDemo) {
      loadContacts();
    }
  }, [emailCardOpen]);

  useEffect(() => {
    if (!emailCardOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (emailCardRef.current && !emailCardRef.current.contains(e.target as Node)) {
        setEmailCardOpen(false);
        setShowAddContactForm(false);
        setEditingContactId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [emailCardOpen]);

  const handleAddUser = async () => {
    try {
      setAddUserLoading(true);
      setTeamError(null);
      const payload = {
        ...addUserForm,
        firstName: addUserForm.firstName?.trim() || undefined,
        lastName: addUserForm.lastName?.trim() || undefined,
      };
      const newUser = await createUser(payload);
      setTeamUsers(prev => [...prev, newUser]);
      setAddUserForm({ firstName: '', lastName: '', email: '', password: '', role: 'DATA' });
      setShowAddUserForm(false);
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'MANAGER' | 'DATA') => {
    if (newRole === 'ADMIN') {
      const u = teamUsers.find(u => u.id === userId);
      const displayName = [u?.firstName, u?.lastName].filter(Boolean).join(' ') || u?.email || 'User';
      setAdminAckDialog({ userId, name: displayName });
      return;
    }
    try {
      setTeamError(null);
      await updateUser(userId, { role: newRole });
      setTeamUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      flashTeamSaved();
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const [adminAckChecked, setAdminAckChecked] = useState(false);

  const confirmAdminAssign = async () => {
    if (!adminAckDialog || !adminAckChecked) return;
    try {
      setTeamError(null);
      await updateUser(adminAckDialog.userId, { role: 'ADMIN', adminAcknowledgment: true });
      setTeamUsers(prev => prev.map(u => u.id === adminAckDialog.userId ? { ...u, role: 'ADMIN' } : u));
      setAdminAckDialog(null);
      setAdminAckChecked(false);
      flashTeamSaved();
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to assign admin');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setTeamError(null);
      await deleteUser(userId);
      setTeamUsers(prev => prev.filter(u => u.id !== userId));
      setDeleteConfirmId(null);
      flashTeamSaved();
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const flashTeamSaved = () => {
    setShowTeamSaved(true);
    setTeamSavedKey(k => k + 1);
    setTimeout(() => setShowTeamSaved(false), 1500);
  };

  const handleToggle2FA = async (userId: string, enabled: boolean) => {
    try {
      setTeamError(null);
      await updateUser(userId, { twoFactorEnabled: enabled });
      setTeamUsers(prev => prev.map(u => u.id === userId ? { ...u, twoFactorEnabled: enabled } : u));
      flashTeamSaved();
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to update 2FA');
    }
  };

  const handleUpdateUserName = async (userId: string, firstName: string, lastName: string) => {
    try {
      setTeamError(null);
      const fn = firstName.trim() || undefined;
      const ln = lastName.trim() || undefined;
      await updateUser(userId, { firstName: fn, lastName: ln });
      setTeamUsers(prev => prev.map(u => u.id === userId ? { ...u, firstName: fn || null, lastName: ln || null } : u));
      setEditingUserId(null);
      flashTeamSaved();
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to update name');
    }
  };

  const currentUserName = state.user?.name || state.user?.email || 'Administrator';
  const teamCount = teamUsers.length;

  const ROLE_BADGE_COLORS: Record<string, string> = {
    ADMIN: 'var(--accent-primary)',
    MANAGER: 'var(--accent-info)',
    DATA: 'var(--text-tertiary)',
  };

  // Local state for new job input
  const [newJobName, setNewJobName] = useState('');
  // Track which job is being dragged
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<CategoryColor | null>(null);

  // Calculate projected pool for display
  const projectedPool = (settings.estimatedMonthlySales / 2) * (settings.contributionRate / 100);

  // Group jobs by category
  const jobsByCategory: Record<CategoryColor, typeof settings.jobCategories> = {
    boh: [], foh: [], bar: [], support: [], custom: [],
  };
  settings.jobCategories.forEach(job => {
    if (jobsByCategory[job.categoryColor]) {
      jobsByCategory[job.categoryColor].push(job);
    }
  });

  // Smooth scroll to Distribution Table section
  const goToDistribution = () => {
    const element = document.getElementById('distribution-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle adding a new job via the write-in input
  const handleAddJob = () => {
    const name = newJobName.trim();
    if (!name) return;
    // Add to first category with fewest jobs, or 'custom' by default
    addJobToCategory(name, 'custom');
    setNewJobName('');
  };

  // Drag and drop handlers
  const handleDragStart = (jobId: string) => {
    setDraggedJobId(jobId);
  };

  const handleDragOver = (e: React.DragEvent, categoryColor: CategoryColor) => {
    e.preventDefault();
    setDragOverCategory(categoryColor);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent, categoryColor: CategoryColor) => {
    e.preventDefault();
    if (draggedJobId) {
      moveJobToCategory(draggedJobId, categoryColor);
    }
    setDraggedJobId(null);
    setDragOverCategory(null);
  };

  const handleDragEnd = () => {
    setDraggedJobId(null);
    setDragOverCategory(null);
  };

  return (
    <div className="content-container">
      {/* Print-only Settings Header with Logo */}
      <div className="print-settings-header print-only">
        <img src="/logo-full.png" alt="TipSharePro" className="print-settings-logo" />
        <div className="print-settings-title">{isDemo ? 'Demo Settings' : 'Settings'}</div>
      </div>

      {/* Settings Header with Actions */}
      <div className="settings-header no-print">
        <h1 className="page-title">{isDemo ? 'Demo Settings' : 'Settings'}</h1>
        <div className="settings-actions">
          {isDemo && (
            <>
              <button
                onClick={resetSettingsToDefaults}
                className="btn btn-outline btn-sm"
                title="Reset settings to defaults"
              >
                <RotateCcw size={16} />
                Reset Settings
              </button>
              <button
                onClick={resetToDefaults}
                className="btn btn-outline btn-sm"
                title="Reset everything to defaults"
              >
                <RotateCcw size={16} />
                Reset All
              </button>
            </>
          )}
          {!isDemo && (
            <div className="header-menu-wrap" ref={goToRef}>
              <button
                onClick={() => setGoToOpen(prev => !prev)}
                className={`btn btn-outline btn-sm ${goToOpen ? 'btn-active' : ''}`}
                title="Go To..."
                data-testid="button-goto"
              >
                <Navigation size={16} />
                Go To...
              </button>
              {goToOpen && (
                <div className="header-dropdown goto-dropdown">
                  <button className="header-dropdown-item" data-testid="goto-sandbox" onClick={() => { setGoToOpen(false); }}>
                    <FlaskConical size={16} />
                    <span>Scenario Sand Box</span>
                  </button>
                  <button className="header-dropdown-item" data-testid="goto-distribution" onClick={() => { setGoToOpen(false); document.getElementById('distribution-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                    <TableProperties size={16} />
                    <span>Distribution Table</span>
                  </button>
                  <button className="header-dropdown-item" data-testid="goto-datahub" onClick={() => { setGoToOpen(false); }}>
                    <Database size={16} />
                    <span>Data Hub</span>
                  </button>
                  <button className="header-dropdown-item" data-testid="goto-profile" onClick={() => { setGoToOpen(false); }}>
                    <UserCircle size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="header-dropdown-item" data-testid="goto-logout" onClick={() => { setGoToOpen(false); handleLogout(); }}>
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setShowPrintDialog(true)}
            className="btn btn-outline btn-sm"
            title="Print settings configuration"
          >
            <Printer size={16} />
            {isDemo ? 'Print Settings' : 'Print Settings Table'}
          </button>
        </div>
      </div>

      {isDemo ? (
        <div className="projected-pool-card">
          <div className="projected-pool-label">
            Projected Pool (per pay period)
            <HelpTooltip text={HELP_TEXT.projectedPool} />
          </div>
          <div className="projected-pool-value">
            ${projectedPool.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="projected-pool-formula">
            (${settings.estimatedMonthlySales.toLocaleString('en-US')} {isSalesBasedMethod(settings.contributionMethod) ? 'sales' : 'tips'} / 2) x {settings.contributionRate}%
          </div>
        </div>
      ) : (
        <div className="clickable-stat-cards-grid">
          {/* Card 1: Locations */}
          <div ref={locCardRef} className="clickable-stat-card stat-card-top-row" style={locCardOpen ? { zIndex: 30 } : undefined} data-testid="clickable-stat-card-1" onClick={() => { if (!locCardOpen) setLocCardOpen(true); }}>
            <div className="clickable-stat-card-header">
              <span className="step-number">1</span>
              <HelpTooltip text="Select or edit your restaurant locations. Click a location to edit its details. The selected location loads that location's settings." />
            </div>
            <div className="clickable-stat-card-body clickable-stat-card-body-stacked">
              <span className="card1-label">Location</span>
              {currentLocation && (
                <>
                  <span className="card1-date">{currentLocation.name}</span>
                  <span className="card1-time">{currentLocation.city}, {currentLocation.state}</span>
                  <span className="card1-date" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>{currentLocation.nickname}</span>
                </>
              )}
            </div>
            {locCardOpen && (
              <div className="card1-config" onClick={(e) => e.stopPropagation()}>
                {locations.map((loc) => (
                  <div key={loc.id} className="loc-entry" data-testid={`loc-entry-${loc.id}`} style={currentLocId === loc.id ? { borderLeft: '3px solid #fb923c', background: 'rgba(251,146,60,0.08)' } : {}}>
                    <div className="loc-entry-header">
                      <label className="loc-radio-label" style={{ minWidth: 0 }}>
                        <input
                          type="radio"
                          name="selectedLocation"
                          checked={selectedLocId === loc.id}
                          onChange={() => setSelectedLocId(loc.id)}
                          data-testid={`loc-radio-${loc.id}`}
                        />
                        <span className="loc-radio-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{loc.name || `Location ${loc.id}`}</span>
                        {currentLocId === loc.id && (
                          <span style={{ fontSize: '0.6rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0, letterSpacing: '0.04em' }}>Current</span>
                        )}
                      </label>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                        {currentLocId !== loc.id && (
                          <button
                            className="loc-edit-btn"
                            onClick={(e) => { e.stopPropagation(); setCurrentLocation(loc.id); }}
                            style={{ color: '#fb923c', fontWeight: 600 }}
                            data-testid={`loc-set-current-${loc.id}`}
                          >
                            Set Current
                          </button>
                        )}
                        <button
                          className="loc-edit-btn"
                          onClick={(e) => { e.stopPropagation(); setEditingLocId(editingLocId === loc.id ? null : loc.id); }}
                          data-testid={`loc-edit-btn-${loc.id}`}
                        >
                          {editingLocId === loc.id ? 'Done' : 'Edit'}
                        </button>
                      </div>
                    </div>
                    {editingLocId === loc.id && (
                      <div className="loc-edit-fields">
                        <div className="loc-field-group">
                          <label className="card1-config-label">Name</label>
                          <input type="text" className="form-input loc-input" value={loc.name} onChange={(e) => updateLocation(loc.id, 'name', e.target.value)} data-testid={`loc-name-${loc.id}`} />
                        </div>
                        <div className="loc-field-group">
                          <label className="card1-config-label">Address</label>
                          <input type="text" className="form-input loc-input" value={loc.address} onChange={(e) => updateLocation(loc.id, 'address', e.target.value)} data-testid={`loc-address-${loc.id}`} />
                        </div>
                        <div className="loc-field-row">
                          <div className="loc-field-group" style={{ flex: 2 }}>
                            <label className="card1-config-label">City</label>
                            <input type="text" className="form-input loc-input" value={loc.city} onChange={(e) => updateLocation(loc.id, 'city', e.target.value)} data-testid={`loc-city-${loc.id}`} />
                          </div>
                          <div className="loc-field-group" style={{ flex: 1 }}>
                            <label className="card1-config-label">State</label>
                            <input type="text" className="form-input loc-input" value={loc.state} maxLength={2} onChange={(e) => updateLocation(loc.id, 'state', e.target.value.toUpperCase())} data-testid={`loc-state-${loc.id}`} />
                          </div>
                          <div className="loc-field-group" style={{ flex: 1 }}>
                            <label className="card1-config-label">Zip</label>
                            <input type="text" className="form-input loc-input" value={loc.zip} maxLength={5} onChange={(e) => updateLocation(loc.id, 'zip', e.target.value)} data-testid={`loc-zip-${loc.id}`} />
                          </div>
                        </div>
                        <div className="loc-field-group">
                          <label className="card1-config-label">Nickname</label>
                          <input type="text" className="form-input loc-input" value={loc.nickname} onChange={(e) => updateLocation(loc.id, 'nickname', e.target.value)} data-testid={`loc-nickname-${loc.id}`} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Day/Date/Time */}
          <div ref={card1Ref} className="clickable-stat-card stat-card-top-row" style={card1Open ? { zIndex: 30 } : undefined} data-testid="clickable-stat-card-2" onClick={() => setCard1Open(prev => !prev)}>
            <div className="clickable-stat-card-header">
              <span className="step-number">2</span>
              <HelpTooltip text="Set your preferred date format, time format, and US time zone. The display updates in real time." />
            </div>
            <div className="clickable-stat-card-body clickable-stat-card-body-stacked">
              <span className="card1-day">{formatCurrentDate().dayName}</span>
              <span className="card1-date">{formatCurrentDate().dateStr}</span>
              <span className="card1-time">{formatCurrentDate().timeStr}</span>
            </div>
            {card1Open && (
              <div className="card1-config" onClick={(e) => e.stopPropagation()}>
                <div className="card1-config-group">
                  <label className="card1-config-label">Date Format</label>
                  <select className="form-select card1-select" value={dateFormat} onChange={(e) => setDateFormat(e.target.value as typeof dateFormat)}>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="Mon DD, YYYY">Mon DD, YYYY</option>
                  </select>
                </div>
                <div className="card1-config-group">
                  <label className="card1-config-label">Time Format</label>
                  <select className="form-select card1-select" value={timeFormat} onChange={(e) => setTimeFormat(e.target.value as typeof timeFormat)}>
                    <option value="12h">12-hour</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>
                <div className="card1-config-group">
                  <label className="card1-config-label">Time Zone</label>
                  <select className="form-select card1-select" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                    {US_TIME_ZONES.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Pay Period */}
          <div ref={payCardRef} className="clickable-stat-card stat-card-top-row" style={payCardOpen ? { zIndex: 30 } : undefined} data-testid="clickable-stat-card-3" onClick={() => { if (!payCardOpen) setPayCardOpen(true); }}>
            <div className="clickable-stat-card-header">
              <span className="step-number">3</span>
              <HelpTooltip text="Set your pay period dates and pay day. This determines all future pay periods and pay days. Archiving occurs the day after pay day — data cannot be changed after archiving." />
            </div>
            <div className="clickable-stat-card-body clickable-stat-card-body-stacked">
              <span className="card1-label">Pay Period</span>
              {payPeriods.current && selectedPeriod === 'current' && (
                <>
                  <span className="card1-date">{formatShortDate(payPeriods.current.start)} – {formatShortDate(payPeriods.current.end)}</span>
                  <span className="card1-time">Pay Day: {payPeriods.currentPayDay ? formatFullDate(payPeriods.currentPayDay) : '—'}</span>
                </>
              )}
              {payPeriods.next && selectedPeriod === 'next' && (
                <>
                  <span className="card1-date">{formatShortDate(payPeriods.next.start)} – {formatShortDate(payPeriods.next.end)}</span>
                  <span className="card1-time">Pay Day: {payPeriods.nextPayDay ? formatFullDate(payPeriods.nextPayDay) : '—'}</span>
                </>
              )}
            </div>
            {payCardOpen && (
              <div className="card1-config" onClick={(e) => e.stopPropagation()}>
                <div className="pay-period-chooser">
                  <button
                    className={`pay-period-choice${selectedPeriod === 'current' ? ' pay-period-choice-active' : ''}`}
                    onClick={() => setSelectedPeriod('current')}
                    data-testid="pay-period-choose-current"
                  >
                    <span className="pay-choice-label">Current</span>
                    <span className="pay-choice-dates">{payPeriods.current ? `${formatShortDate(payPeriods.current.start)} – ${formatShortDate(payPeriods.current.end)}` : '—'}</span>
                    <span className="pay-choice-payday">{payPeriods.currentPayDay ? `Pay: ${formatFullDate(payPeriods.currentPayDay)}` : ''}</span>
                  </button>
                  <button
                    className={`pay-period-choice${selectedPeriod === 'next' ? ' pay-period-choice-active' : ''}`}
                    onClick={() => setSelectedPeriod('next')}
                    data-testid="pay-period-choose-next"
                  >
                    <span className="pay-choice-label">Next</span>
                    <span className="pay-choice-dates">{payPeriods.next ? `${formatShortDate(payPeriods.next.start)} – ${formatShortDate(payPeriods.next.end)}` : '—'}</span>
                    <span className="pay-choice-payday">{payPeriods.nextPayDay ? `Pay: ${formatFullDate(payPeriods.nextPayDay)}` : ''}</span>
                  </button>
                </div>
                <div className="pay-section-divider" />
                {!payPeriodsConfigured ? (
                  <>
                    <div className="card1-config-group">
                      <label className="card1-config-label">Period First Day</label>
                      <input type="date" className="form-input loc-input" value={draftStartDate} onChange={(e) => setDraftStartDate(e.target.value)} data-testid="pay-period-start" />
                    </div>
                    <div className="card1-config-group">
                      <label className="card1-config-label">Period Last Day</label>
                      <input type="date" className="form-input loc-input" value={draftEndDate} onChange={(e) => setDraftEndDate(e.target.value)} data-testid="pay-period-end" />
                    </div>
                    <div className="pay-freq-display">
                      <span className="card1-config-label">Frequency</span>
                      <span className="pay-freq-value">{freqLabel(getDraftFrequency())}</span>
                    </div>
                    <div className="pay-section-divider" />
                    <div className="card1-config-group">
                      <label className="card1-config-label">Pay Day Type</label>
                      {getDraftFrequency() === 'bimonthly' ? (
                        <select className="form-select card1-select" value={draftPayDayType} onChange={(e) => setDraftPayDayType(e.target.value as PayDayType)} data-testid="pay-day-type">
                          <option value="dayOfWeek">Same Day of Week</option>
                          <option value="datesOfMonth">Same Dates of Month</option>
                        </select>
                      ) : (
                        <span className="pay-freq-value" style={{ fontSize: '0.75rem' }}>Same Day of Week</span>
                      )}
                    </div>
                    {(getDraftFrequency() !== 'bimonthly' || draftPayDayType === 'dayOfWeek') ? (
                      <div className="card1-config-group">
                        <label className="card1-config-label">Pay Day</label>
                        <select className="form-select card1-select" value={draftPayDayOfWeek} onChange={(e) => setDraftPayDayOfWeek(Number(e.target.value))} data-testid="pay-day-of-week">
                          {DAYS_OF_WEEK.map((day, i) => (
                            <option key={i} value={i}>{day}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="loc-field-row">
                        <div className="card1-config-group" style={{ flex: 1 }}>
                          <label className="card1-config-label">1st Pay Date</label>
                          <select className="form-select card1-select" value={draftPayDayDate1} onChange={(e) => setDraftPayDayDate1(Number(e.target.value))} data-testid="pay-date-1">
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                              <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'}</option>
                            ))}
                          </select>
                        </div>
                        <div className="card1-config-group" style={{ flex: 1 }}>
                          <label className="card1-config-label">2nd Pay Date</label>
                          <select className="form-select card1-select" value={draftPayDayDate2} onChange={(e) => setDraftPayDayDate2(Number(e.target.value))} data-testid="pay-date-2">
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                              <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    {payConfigError && (
                      <span className="pay-config-error">{payConfigError}</span>
                    )}
                    <div className="pay-btn-row">
                      <button className="pay-reset-btn" onClick={resetDrafts} data-testid="pay-reset-drafts">Reset</button>
                      <button className="pay-save-btn" onClick={saveDrafts} data-testid="pay-save-config">Save</button>
                    </div>
                  </>
                ) : (
                  <button className="pay-edit-btn" onClick={() => { resetDrafts(); setPayPeriodsConfigured(false); }} data-testid="pay-edit-config">
                    Edit Pay Period Settings
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Card 4: Team & Permissions */}
          <div
            ref={teamCardRef}
            className={`clickable-stat-card${teamCardOpen ? ' clickable-stat-card-active' : ''}`}
            style={{ position: 'relative', zIndex: teamCardOpen ? 30 : undefined, cursor: 'pointer' }}
            onClick={() => { if (!teamCardOpen && !isDemo) setTeamCardOpen(true); }}
            data-testid="clickable-stat-card-4"
          >
            <div className="clickable-stat-card-header">
              <span className="step-number">4</span>
              <HelpTooltip text="Manage your team members, logins, and permissions. Admin, Manager, and Data roles control access across the platform." />
            </div>
            <div className="clickable-stat-card-body clickable-stat-card-body-stacked">
              <span className="card1-label" style={{ color: 'var(--color-primary)' }}>Team & Permissions</span>
              <span className="card1-date" data-testid="team-card-logged-in-user">
                {isDemo ? 'Demo User' : currentUserName}
              </span>
              {!isDemo && teamCount > 0 && (
                <span className="card1-time" data-testid="team-card-count">
                  {teamCount} member{teamCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {teamCardOpen && !isDemo && (
              <div className="card1-config team-config" onClick={e => e.stopPropagation()} data-testid="team-config-panel">
                {teamError && (
                  <div style={{ background: 'var(--bg-danger)', border: '1px solid var(--border-danger)', borderRadius: '0.35rem', padding: '0.4rem 0.6rem', fontSize: '0.7rem', color: 'var(--text-danger)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertTriangle size={12} />
                    <span>{teamError}</span>
                    <button onClick={() => setTeamError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-danger)' }}><X size={12} /></button>
                  </div>
                )}

                {teamLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Loader2 size={14} className="loading-spinner" />
                    Loading team...
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Shield size={12} />
                        Team ({teamUsers.length})
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {showTeamSaved && (
                          <span key={teamSavedKey} style={{ fontSize: '0.6rem', fontWeight: 700, color: '#22c55e', whiteSpace: 'nowrap', animation: 'fadeInOut 1.5s ease forwards' }}>Saved</span>
                        )}
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                          onClick={() => setShowAddUserForm(!showAddUserForm)}
                          data-testid="team-add-user-btn"
                        >
                          <UserPlus size={10} />
                          {showAddUserForm ? 'Cancel' : 'Add'}
                        </button>
                      </div>
                    </div>

                    {showAddUserForm && (
                      <div className="team-add-form" data-testid="team-add-user-form">
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <div className="card1-config-group" style={{ flex: 1 }}>
                            <label className="card1-config-label">First Name</label>
                            <input
                              type="text"
                              className="form-input loc-input"
                              value={addUserForm.firstName || ''}
                              onChange={e => setAddUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="First"
                              data-testid="team-add-first-name"
                            />
                          </div>
                          <div className="card1-config-group" style={{ flex: 1 }}>
                            <label className="card1-config-label">Last Name</label>
                            <input
                              type="text"
                              className="form-input loc-input"
                              value={addUserForm.lastName || ''}
                              onChange={e => setAddUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                              placeholder="Last"
                              data-testid="team-add-last-name"
                            />
                          </div>
                        </div>
                        <div className="card1-config-group">
                          <label className="card1-config-label">Email</label>
                          <input
                            type="email"
                            className="form-input loc-input"
                            value={addUserForm.email}
                            onChange={e => setAddUserForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                            required
                            data-testid="team-add-email"
                          />
                        </div>
                        <div className="card1-config-group">
                          <label className="card1-config-label">Temporary Password</label>
                          <input
                            type="text"
                            className="form-input loc-input"
                            value={addUserForm.password}
                            onChange={e => setAddUserForm(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Min 6 characters"
                            data-testid="team-add-password"
                          />
                        </div>
                        <div className="card1-config-group">
                          <label className="card1-config-label">Permission Level</label>
                          <select
                            className="form-select card1-select"
                            value={addUserForm.role}
                            onChange={e => setAddUserForm(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'MANAGER' | 'DATA' }))}
                            data-testid="team-add-role"
                          >
                            <option value="DATA">Data — Entry & Printing Only</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                        <button
                          className="pay-save-btn"
                          style={{ width: '100%', marginTop: '0.3rem' }}
                          disabled={!addUserForm.email || addUserForm.password.length < 6 || addUserLoading}
                          onClick={handleAddUser}
                          data-testid="team-add-submit"
                        >
                          {addUserLoading ? 'Creating...' : 'Create User'}
                        </button>
                      </div>
                    )}

                    <div className="team-user-list" data-testid="team-user-list">
                      {teamUsers.map(u => {
                        const displayName = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email.split('@')[0];
                        const isEditing = editingUserId === u.id;
                        const isSelf = u.email === state.user?.email;
                        return (
                          <div key={u.id} className="team-user-row" data-testid={`team-user-${u.id}`}>
                            {isEditing ? (
                              <TeamNameEditor
                                user={u}
                                onSave={(fn, ln) => handleUpdateUserName(u.id, fn, ln)}
                                onCancel={() => setEditingUserId(null)}
                              />
                            ) : (
                              <>
                                <div className="team-user-info" onClick={() => setEditingUserId(u.id)} style={{ cursor: 'pointer' }}>
                                  <span className="team-user-name" data-testid={`team-user-name-${u.id}`}>{displayName}{isSelf ? ' (you)' : ''}</span>
                                  <span className="team-user-email" data-testid={`team-user-email-${u.id}`}>{u.email}</span>
                                </div>
                                <div className="team-user-actions">
                                  <select
                                    className="form-select team-role-select"
                                    value={u.role}
                                    onChange={e => handleRoleChange(u.id, e.target.value as 'ADMIN' | 'MANAGER' | 'DATA')}
                                    data-testid={`team-user-role-${u.id}`}
                                    style={{ borderLeft: `3px solid ${ROLE_BADGE_COLORS[u.role]}` }}
                                    disabled={isSelf}
                                  >
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="DATA">Data</option>
                                  </select>
                                  {u.mustChangePassword && (
                                    <span className="team-badge-new" title="First login pending" data-testid={`team-user-pending-${u.id}`}>NEW</span>
                                  )}
                                  <label className="team-2fa-toggle" title={u.twoFactorEnabled ? '2FA enabled' : '2FA disabled'} data-testid={`team-user-2fa-toggle-${u.id}`}>
                                    <input
                                      type="checkbox"
                                      checked={u.twoFactorEnabled}
                                      onChange={e => handleToggle2FA(u.id, e.target.checked)}
                                    />
                                    <span className="team-2fa-slider" />
                                    <span className="team-2fa-label">2FA</span>
                                  </label>
                                  {!isSelf && (
                                    deleteConfirmId === u.id ? (
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#ef4444', lineHeight: 1 }}>You Sure?</span>
                                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                                          <button className="team-delete-confirm" onClick={() => handleDeleteUser(u.id)} data-testid={`team-user-delete-confirm-${u.id}`}>Yes</button>
                                          <button className="team-delete-cancel" onClick={() => setDeleteConfirmId(null)}>No</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button className="team-delete-btn" onClick={() => setDeleteConfirmId(u.id)} title="Delete user" data-testid={`team-user-delete-${u.id}`}>
                                        <Trash2 size={11} />
                                      </button>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                      {teamUsers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '0.8rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          No team members yet. Click "Add" to invite your first user.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {adminAckDialog && (
              <div className="modal-overlay" style={{ zIndex: 100 }} onClick={() => { setAdminAckDialog(null); setAdminAckChecked(false); }}>
                <div className="modal-content team-admin-ack-modal" onClick={e => e.stopPropagation()} data-testid="admin-ack-dialog">
                  <div className="modal-header" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <h3 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <AlertTriangle size={16} style={{ color: 'var(--accent-warning)' }} />
                      Admin Privileges
                    </h3>
                    <button className="modal-close-btn" onClick={() => { setAdminAckDialog(null); setAdminAckChecked(false); }}>
                      <X size={16} />
                    </button>
                  </div>
                  <div className="modal-body" style={{ padding: '0.75rem 1rem', fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      You are about to assign <strong style={{ color: 'var(--text-primary)' }}>Admin</strong> privileges to <strong style={{ color: 'var(--text-primary)' }}>{adminAckDialog.name}</strong>.
                    </p>
                    <p style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Please acknowledge you understand assigning Admin privileges requires a lot of trust. The assignee needs a general knowledge of the Laws and Ethics concerning Tip Pooling in order to maintain Trust.
                      {' '}Please take the time to <span style={{ color: '#fff', fontWeight: 600 }}>Read:</span>
                      <br />
                      <span style={{ display: 'block', textAlign: 'center', marginTop: '0.25rem' }}>
                        <a href="/The_Admin_Role.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#fb923c', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '0.2rem' }} data-testid="admin-role-pdf-link">The Admin Role .pdf</a>
                      </span>
                    </p>
                    <label
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                        cursor: 'pointer', padding: '0.6rem 0.5rem',
                        background: adminAckChecked ? 'rgba(34,197,94,0.08)' : 'var(--bg-tertiary)',
                        borderRadius: '0.4rem', border: `1px solid ${adminAckChecked ? '#22c55e' : 'var(--border-primary)'}`,
                        transition: 'all 0.2s ease',
                      }}
                      data-testid="admin-ack-checkbox-label"
                    >
                      <input
                        type="checkbox"
                        checked={adminAckChecked}
                        onChange={e => setAdminAckChecked(e.target.checked)}
                        style={{ marginTop: '0.15rem', accentColor: '#22c55e', width: '1rem', height: '1rem', flexShrink: 0 }}
                        data-testid="admin-ack-checkbox"
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        I Understand and Agree
                      </span>
                    </label>
                  </div>
                  <div className="modal-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', padding: '0.75rem 1rem', borderTop: '1px solid var(--border-primary)' }}>
                    <button className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => { setAdminAckDialog(null); setAdminAckChecked(false); }} data-testid="admin-ack-cancel">
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', opacity: adminAckChecked ? 1 : 0.4, cursor: adminAckChecked ? 'pointer' : 'not-allowed' }}
                      onClick={confirmAdminAssign}
                      disabled={!adminAckChecked}
                      data-testid="admin-ack-confirm"
                    >
                      Assign Admin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 5: Authorized Emails */}
          <div
            ref={emailCardRef}
            className={`clickable-stat-card${emailCardOpen ? ' clickable-stat-card-active' : ''}`}
            style={{ position: 'relative', zIndex: emailCardOpen ? 30 : undefined, cursor: 'pointer' }}
            onClick={() => { if (!emailCardOpen && !isDemo) setEmailCardOpen(true); }}
            data-testid="clickable-stat-card-5"
          >
            <div className="clickable-stat-card-header">
              <span className="step-number">5</span>
              {showContactSaved && (
                <span key={contactSavedKey} style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.7rem', marginLeft: '0.25rem', animation: 'fadeIn 0.2s ease' }}>Saved</span>
              )}
              {emailCardOpen && !isDemo && (
                <button
                  className="btn btn-outline btn-xs"
                  style={{ fontSize: '0.55rem', padding: '0.1rem 0.35rem', marginLeft: 'auto', marginRight: '0.25rem' }}
                  onClick={(e) => { e.stopPropagation(); setShowAddContactForm(true); }}
                  data-testid="add-contact-btn"
                >
                  <Plus size={10} /> Add
                </button>
              )}
              <HelpTooltip text="Only Admin Authorized emails will be allowed sensitive payroll information (wages etc.)." />
            </div>
            <div className="clickable-stat-card-body clickable-stat-card-body-stacked">
              <span className="card1-label" style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>Authorized</span>
              <span className="card1-date" style={{ color: 'var(--color-primary)' }}>Emails</span>
              <span className="card1-time" style={{ color: 'var(--text-primary)' }}>
                {isDemo ? '—' : `${authorizedContacts.length} contact${authorizedContacts.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            {emailCardOpen && !isDemo && (
              <div className="team-expand" onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 40, background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderTop: 'none', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', boxShadow: 'var(--shadow-lg)', maxHeight: '320px', overflowY: 'auto' }}>
                {contactsLoading && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Loader2 size={16} className="spin" style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }} /> Loading...
                  </div>
                )}
                {contactsError && (
                  <div style={{ padding: '0.5rem 0.75rem', color: '#ef4444', fontSize: '0.7rem' }}>{contactsError}</div>
                )}
                {!contactsLoading && authorizedContacts.length === 0 && !showAddContactForm && (
                  <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>No authorized contacts yet</div>
                )}
                {!contactsLoading && authorizedContacts.map((contact) => (
                  <div key={contact.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderBottom: '1px solid var(--bg-border)', fontSize: '0.7rem' }}>
                    {editingContactId === contact.id ? (
                      <ContactEditor
                        contact={contact}
                        onSave={async (name, company, email) => {
                          await updateAuthorizedContact(contact.id, { name, company: company || null, email });
                          await loadContacts();
                          setEditingContactId(null);
                          flashContactSaved();
                        }}
                        onCancel={() => setEditingContactId(null)}
                      />
                    ) : (
                      <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.name}</div>
                          {contact.company && <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{contact.company}</div>}
                          <div style={{ color: '#fb923c', fontSize: '0.6rem' }}>{contact.email}</div>
                        </div>
                        <button
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.15rem', fontSize: '0.6rem' }}
                          onClick={() => setEditingContactId(contact.id)}
                          data-testid={`edit-contact-${contact.id}`}
                          title="Edit"
                        >Edit</button>
                        {deleteContactId === contact.id ? (
                          <div style={{ display: 'flex', gap: '0.2rem' }}>
                            <button className="pay-save-btn" style={{ fontSize: '0.5rem', padding: '0.1rem 0.3rem', background: '#ef4444' }} onClick={() => handleDeleteContact(contact.id)} data-testid={`confirm-delete-contact-${contact.id}`}>Yes</button>
                            <button className="pay-reset-btn" style={{ fontSize: '0.5rem', padding: '0.1rem 0.3rem' }} onClick={() => setDeleteContactId(null)}>No</button>
                          </div>
                        ) : (
                          <button
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.15rem' }}
                            onClick={() => setDeleteContactId(contact.id)}
                            data-testid={`delete-contact-${contact.id}`}
                            title="Delete"
                          ><Trash2 size={12} /></button>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {showAddContactForm && (
                  <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid var(--bg-border)' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <input
                        type="text"
                        className="form-input loc-input"
                        placeholder="Name"
                        value={addContactForm.name}
                        onChange={(e) => setAddContactForm(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                        style={{ fontSize: '0.65rem' }}
                        data-testid="contact-name-input"
                      />
                      <input
                        type="text"
                        className="form-input loc-input"
                        placeholder="Company (optional)"
                        value={addContactForm.company || ''}
                        onChange={(e) => setAddContactForm(prev => ({ ...prev, company: e.target.value }))}
                        style={{ fontSize: '0.65rem' }}
                        data-testid="contact-company-input"
                      />
                      <input
                        type="email"
                        className="form-input loc-input"
                        placeholder="Email"
                        value={addContactForm.email}
                        onChange={(e) => setAddContactForm(prev => ({ ...prev, email: e.target.value }))}
                        style={{ fontSize: '0.65rem' }}
                        data-testid="contact-email-input"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.3rem' }}>
                      <button className="pay-save-btn" style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem' }} onClick={handleAddContact} disabled={addContactLoading} data-testid="save-contact-btn">
                        {addContactLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button className="pay-reset-btn" style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem' }} onClick={() => { setShowAddContactForm(false); setAddContactForm({ name: '', company: '', email: '' }); }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 6: Placeholder */}
          <div className="clickable-stat-card" data-testid="clickable-stat-card-6">
            <div className="clickable-stat-card-header">
              <span className="step-number">6</span>
              <HelpTooltip text="" />
            </div>
            <div className="clickable-stat-card-body">
            </div>
          </div>
        </div>
      )}

      {/* Step 7 + 8 Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)', alignItems: 'stretch' }}>
        {/* Step 7: Contribution Method */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">
              <span className="step-number">7</span>
              Method for Contribution
            </h2>
            <HelpTooltip text={HELP_TEXT.contributionMethod} pdfLink="/help/why-sales-contribution-factor.pdf" pdfTitle="Why Use Sales as Contribution Factor (PDF)" />
          </div>

          <div className="method-selector" style={{ flex: 1, alignItems: 'stretch' }}>
            {(Object.keys(CONTRIBUTION_METHOD_LABELS) as ContributionMethod[]).map((method) => (
              <label key={method} className="method-option">
                <input
                  type="radio"
                  name="contributionMethod"
                  value={method}
                  checked={settings.contributionMethod === method}
                  onChange={() => setContributionMethod(method)}
                  className="method-radio"
                />
                <span className="method-label">{CONTRIBUTION_METHOD_LABELS[method]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 8: Contribution Percentage */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">
              <span className="step-number">8</span>
              Enter Contribution %
            </h2>
            <HelpTooltip
              text={
                settings.contributionMethod === 'ALL_SALES'
                  ? HELP_TEXT.contributionRateAllSales
                  : settings.contributionMethod === 'CC_SALES'
                  ? HELP_TEXT.contributionRateCCSales
                  : HELP_TEXT.contributionRateTips
              }
            />
          </div>

          <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="input-with-suffix">
              <select
                ref={contributionRateRef}
                value={settings.contributionRate}
                onChange={(e) => updateSettings({ contributionRate: parseFloat(e.target.value) })}
                className="form-select"
              >
                {contributionRateOptions.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate.toFixed(rate % 1 === 0 ? 0 : rate % 0.5 === 0 ? 1 : 2)}
                  </option>
                ))}
              </select>
              <span className="input-suffix">%</span>
            </div>
            <p className="form-help">
              {settings.contributionMethod === 'ALL_SALES'
                ? 'Range: 1% - 5% in 0.25% increments'
                : settings.contributionMethod === 'CC_SALES'
                ? 'Range: 1% - 10% in 0.25% increments'
                : 'Range: 1% - 35% in 0.5% increments'}
            </p>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="step-number">2</span>
              Estimate Monthly {isSalesBasedMethod(settings.contributionMethod) ? 'Sales' : 'Tips'}
            </h2>
            <HelpTooltip text={HELP_TEXT.estimatedMonthlySales} />
          </div>

          <div className="form-group">
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={monthlyInputValue}
                onChange={(e) => {
                  const display = e.target.value;
                  setMonthlyInputValue(display);
                  const rawValue = display.replace(/[^0-9]/g, '');
                  updateSettings({ estimatedMonthlySales: parseInt(rawValue) || 0 });
                }}
                onFocus={(e) => {
                  setMonthlyInputFocused(true);
                  const raw = settings.estimatedMonthlySales;
                  setMonthlyInputValue(raw > 0 ? String(raw) : '');
                  setTimeout(() => e.target.select(), 0);
                }}
                onBlur={() => {
                  setMonthlyInputFocused(false);
                  const val = settings.estimatedMonthlySales;
                  setMonthlyInputValue(val > 0 ? val.toLocaleString('en-US') : '0');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    contributionRateRef.current?.focus();
                  }
                }}
                className="form-input form-input-money"
                placeholder="0"
              />
            </div>
            <p className="form-help">
              Enter your estimated monthly {isSalesBasedMethod(settings.contributionMethod) ? 'sales' : 'tips'} in whole dollars
            </p>
          </div>
        </div>
      )}

      {/* Step 9: Define Categories */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">9</span>
            Job Categories
          </h2>
          <HelpTooltip text={HELP_TEXT.jobCategories} />
        </div>

        <p className="form-help mb-4">
          Categories are groups of jobs. You can rename any category below. Names and colors can be customized.
        </p>

        <div className="category-boxes-grid">
          {CATEGORY_COLORS.map((color) => (
            <div
              key={color}
              className="category-name-box"
              style={{
                borderColor: CATEGORY_HEX[color],
                backgroundColor: `${CATEGORY_HEX[color]}20`,
              }}
            >
              <InlineCategoryDot categoryColor={color} size={14} />
              <input
                type="text"
                value={settings.categoryNames?.[color] || CATEGORY_COLOR_MAP[color].name}
                onChange={(e) => updateCategoryName(color, e.target.value)}
                className="category-name-input"
                style={{ color: CATEGORY_HEX[color] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step 10: Assign Jobs to Categories */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">10</span>
            Assign Jobs to Categories
          </h2>
          <HelpTooltip text="Drag and drop jobs between categories to reassign them. Type a new job name and press Enter to add it." />
        </div>

        {/* Add new job input */}
        <div className="add-job-row">
          <input
            type="text"
            value={newJobName}
            onChange={(e) => setNewJobName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddJob()}
            placeholder="Type a new job title and press Enter..."
            className="form-input add-job-input"
          />
          <button
            onClick={handleAddJob}
            disabled={!newJobName.trim()}
            className="btn btn-outline btn-sm"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Category drop zones with jobs */}
        <div className="job-assignment-grid">
          {CATEGORY_COLORS.map((color) => (
            <div
              key={color}
              className={`job-category-zone ${dragOverCategory === color ? 'job-category-zone-active' : ''}`}
              style={{ borderColor: CATEGORY_HEX[color] }}
              onDragOver={(e) => handleDragOver(e, color)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, color)}
            >
              <div
                className={`job-category-zone-header${color === 'custom' ? ' job-category-zone-header-custom' : ''}`}
                style={{ backgroundColor: CATEGORY_HEX[color] }}
              >
                <span className="job-category-zone-title">
                  {settings.categoryNames?.[color] || CATEGORY_COLOR_MAP[color].name}
                </span>
              </div>
              <div className="job-category-zone-body">
                {jobsByCategory[color].length === 0 ? (
                  <p className="job-zone-empty">Drop jobs here</p>
                ) : (
                  jobsByCategory[color].map((job) => (
                    <div
                      key={job.id}
                      className={`job-pill ${draggedJobId === job.id ? 'job-pill-dragging' : ''}`}
                      draggable
                      onDragStart={() => handleDragStart(job.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <GripVertical size={12} className="job-pill-grip" />
                      <span className="job-pill-name">{job.name}</span>
                      <button
                        className="job-pill-remove"
                        onClick={() => removeJob(job.id)}
                        title="Remove job"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 11: Job Category Weights */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="step-number">11</span>
            Category Weights
          </h2>
          <HelpTooltip text={HELP_TEXT.variableWeight} pdfLink="/help/category-weights.pdf" pdfTitle="Category Weights (PDF)" />
        </div>

        <div className="weight-list">
          {CATEGORY_COLORS.map((color) => (
            <div key={color} className="weight-item">
              <div className="weight-item-info">
                <div
                  className="category-weight-badge"
                  style={{ backgroundColor: CATEGORY_HEX[color] }}
                >
                  {settings.categoryNames?.[color] || CATEGORY_COLOR_MAP[color].name}
                </div>
                <span className="weight-item-jobs">
                  {jobsByCategory[color].map(j => j.name).join(', ') || 'No jobs assigned'}
                </span>
              </div>
              <select
                value={settings.categoryWeights?.[color] || 1}
                onChange={(e) => updateCategoryWeight(color, parseInt(e.target.value))}
                className="form-select weight-select"
              >
                {WHOLE_WEIGHT_OPTIONS.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <p className="form-help mt-4">
          Weight scale: 1 = Lowest share, 5 = Highest share of the tip pool.
          Fine-tune individual weights by +0.25 increments (up to +0.75) on the Distribution Table page.
        </p>
      </div>

      {/* Blocked Features Teaser — only for DEMO tier */}
      {isDemo && (
        <div className="card card-promo">
          <div className="promo-header">
            <Lock size={20} className="promo-icon" />
            <h3 className="promo-title">Full Version Features</h3>
          </div>
          <div className="promo-features">
            <div className="promo-feature promo-feature-disabled">
              <Lock size={14} />
              <span>Location Settings</span>
            </div>
            <div className="promo-feature promo-feature-disabled">
              <Lock size={14} />
              <span>Pay Period Start/End Dates</span>
            </div>
            <div className="promo-feature promo-feature-disabled">
              <Lock size={14} />
              <span>Launch Date</span>
            </div>
            <div className="promo-feature promo-feature-disabled">
              <Lock size={14} />
              <span>Users/Permissions</span>
            </div>
            <div className="promo-feature promo-feature-disabled">
              <Lock size={14} />
              <span>Scenario Sand Box</span>
            </div>
          </div>
        </div>
      )}

      {/* Secondary features are now in modals, opened via Header "More" menu */}

      {/* Navigation */}
      <div className="nav-buttons nav-buttons-between">
        <button
          onClick={goToDistribution}
          className="btn btn-primary btn-lg"
        >
          Go To Distribution Table
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Print Footer — hidden on screen, shown on print */}
      <div className="print-footer">
        <span className="print-footer-brand">TipSharePro</span>
        <span className="print-footer-date">
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>

      {/* Print Dialog */}
      {showPrintDialog && (
        <PrintDialog
          target="settings"
          onClose={() => setShowPrintDialog(false)}
        />
      )}

      {/* Scenario Sandbox is now opened from the header "More" menu */}
    </div>
  );
}

function ContactEditor({ contact, onSave, onCancel }: { contact: AuthorizedContact; onSave: (name: string, company: string, email: string) => void; onCancel: () => void }) {
  const [name, setName] = useState(contact.name);
  const [company, setCompany] = useState(contact.company || '');
  const [email, setEmail] = useState(contact.email);
  return (
    <div style={{ width: '100%' }} data-testid={`contact-editor-${contact.id}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <input type="text" className="form-input loc-input" value={name} onChange={e => setName(e.target.value)} placeholder="Name" autoFocus style={{ fontSize: '0.65rem' }} data-testid={`contact-edit-name-${contact.id}`} />
        <input type="text" className="form-input loc-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" style={{ fontSize: '0.65rem' }} data-testid={`contact-edit-company-${contact.id}`} />
        <input type="email" className="form-input loc-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ fontSize: '0.65rem' }} data-testid={`contact-edit-email-${contact.id}`} />
      </div>
      <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
        <button className="pay-save-btn" style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem' }} onClick={() => onSave(name, company, email)} data-testid={`contact-edit-save-${contact.id}`}>Save</button>
        <button className="pay-reset-btn" style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem' }} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function TeamNameEditor({ user, onSave, onCancel }: { user: OrgUser; onSave: (fn: string, ln: string) => void; onCancel: () => void }) {
  const [fn, setFn] = useState(user.firstName || '');
  const [ln, setLn] = useState(user.lastName || '');
  return (
    <div className="team-name-editor" data-testid={`team-name-editor-${user.id}`}>
      <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
        <input
          type="text"
          className="form-input loc-input"
          value={fn}
          onChange={e => setFn(e.target.value)}
          placeholder="First"
          autoFocus
          data-testid={`team-edit-first-${user.id}`}
          style={{ fontSize: '0.65rem' }}
        />
        <input
          type="text"
          className="form-input loc-input"
          value={ln}
          onChange={e => setLn(e.target.value)}
          placeholder="Last"
          data-testid={`team-edit-last-${user.id}`}
          style={{ fontSize: '0.65rem' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
        <button className="pay-save-btn" style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem' }} onClick={() => onSave(fn, ln)} data-testid={`team-edit-save-${user.id}`}>Save</button>
        <button className="pay-reset-btn" style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem' }} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
