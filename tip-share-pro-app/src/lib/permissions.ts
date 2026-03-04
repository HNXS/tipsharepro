/**
 * Role-Based Permissions
 *
 * Centralized permission checks for UI feature gating.
 * Roles: ADMIN > MANAGER > DATA
 */

export type UserRole = 'ADMIN' | 'MANAGER' | 'DATA';

export type Feature =
  | 'settings.method'
  | 'settings.rate'
  | 'settings.categories'
  | 'settings.weights'
  | 'settings.rounding'
  | 'settings.perLocation'
  | 'users'
  | 'locations'
  | 'billing'
  | 'payPeriod.create'
  | 'payPeriod.finalize'
  | 'payPeriod.archive'
  | 'dailyEntry'
  | 'viewArchived'
  | 'scenarioSandbox'
  | 'twoFactorSetup'
  | 'auditLogs';

const PERMISSION_MAP: Record<Feature, UserRole[]> = {
  'settings.method':      ['ADMIN'],
  'settings.rate':        ['ADMIN'],
  'settings.categories':  ['ADMIN'],
  'settings.weights':     ['ADMIN'],
  'settings.rounding':    ['ADMIN'],
  'settings.perLocation': ['ADMIN', 'MANAGER'],
  'users':                ['ADMIN'],
  'locations':            ['ADMIN'],
  'billing':              ['ADMIN'],
  'payPeriod.create':     ['ADMIN', 'MANAGER'],
  'payPeriod.finalize':   ['ADMIN', 'MANAGER'],
  'payPeriod.archive':    ['ADMIN', 'MANAGER'],
  'dailyEntry':           ['ADMIN', 'MANAGER', 'DATA'],
  'viewArchived':         ['ADMIN', 'MANAGER'],
  'scenarioSandbox':      ['ADMIN', 'MANAGER'],
  'twoFactorSetup':       ['ADMIN', 'MANAGER', 'DATA'],
  'auditLogs':            ['ADMIN'],
};

/**
 * Check if a role has access to a feature.
 */
export function canAccess(role: string | undefined, feature: Feature): boolean {
  if (!role) return false;
  const allowed = PERMISSION_MAP[feature];
  return allowed ? allowed.includes(role as UserRole) : false;
}

/**
 * Check if a role is at least a given level.
 */
export function isAtLeast(role: string | undefined, minRole: UserRole): boolean {
  if (!role) return false;
  const hierarchy: UserRole[] = ['DATA', 'MANAGER', 'ADMIN'];
  const userLevel = hierarchy.indexOf(role as UserRole);
  const minLevel = hierarchy.indexOf(minRole);
  return userLevel >= minLevel;
}
