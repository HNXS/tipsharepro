/**
 * Settings Service
 *
 * Manages organization settings including contribution method,
 * contribution rate, pay period type, and estimated monthly sales.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { NotFoundError } from '../utils/errors';

// ============================================================================
// Types
// ============================================================================

export type ContributionMethod = 'CC_SALES' | 'CC_TIPS' | 'ALL_TIPS' | 'ALL_SALES';
export type PayPeriodType = 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY';

export interface OrganizationSettingsData {
  contributionMethod: ContributionMethod;
  contributionRate: number;
  payPeriodType: PayPeriodType;
  estimatedMonthlySales: number;
  autoArchiveDays: number;
  roundingMode: 'NEAREST' | 'DOWN';
}

export interface SettingsResponse {
  organizationId: string;
  organizationName: string;
  settings: OrganizationSettingsData;
  updatedAt: string;
}

// Default settings for new organizations
const DEFAULT_SETTINGS: OrganizationSettingsData = {
  contributionMethod: 'ALL_SALES',
  contributionRate: 3.25,
  payPeriodType: 'BIWEEKLY',
  estimatedMonthlySales: 80000,
  autoArchiveDays: 1,
  roundingMode: 'NEAREST',
};

// ============================================================================
// Settings Service Class
// ============================================================================

export class SettingsService {
  /**
   * Get organization settings
   */
  async getSettings(organizationId: string): Promise<SettingsResponse> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new NotFoundError('Organization', organizationId);
    }

    // Parse stored settings, merge with defaults
    const storedSettings = (org.settings as Partial<OrganizationSettingsData>) || {};
    const settings: OrganizationSettingsData = {
      ...DEFAULT_SETTINGS,
      ...storedSettings,
    };

    return {
      organizationId: org.id,
      organizationName: org.name,
      settings,
      updatedAt: org.updatedAt.toISOString(),
    };
  }

  /**
   * Update organization settings
   */
  async updateSettings(
    organizationId: string,
    updates: Partial<OrganizationSettingsData>
  ): Promise<SettingsResponse> {
    // First, get current settings
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new NotFoundError('Organization', organizationId);
    }

    // Merge current settings with updates
    const currentSettings = (org.settings as Partial<OrganizationSettingsData>) || {};
    const newSettings: OrganizationSettingsData = {
      ...DEFAULT_SETTINGS,
      ...currentSettings,
      ...updates,
    };

    // Validate contribution rate based on method
    this.validateContributionRate(newSettings.contributionMethod, newSettings.contributionRate);

    // Update organization
    const updatedOrg = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        settings: newSettings as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      organizationId: updatedOrg.id,
      organizationName: updatedOrg.name,
      settings: newSettings,
      updatedAt: updatedOrg.updatedAt.toISOString(),
    };
  }

  /**
   * Validate contribution rate based on contribution method
   * - Tips-based (CC_SALES, CC_TIPS, ALL_TIPS): 5-25% in 0.5 increments
   * - Sales-based (ALL_SALES): 1-5% in 0.25 increments
   */
  private validateContributionRate(method: ContributionMethod, rate: number): void {
    if (method === 'ALL_SALES') {
      // 1-5% in 0.25 increments
      if (rate < 1 || rate > 5) {
        throw new Error('For All Sales, contribution rate must be between 1% and 5%');
      }
      if ((rate * 4) % 1 !== 0) {
        throw new Error('For All Sales, contribution rate must be in 0.25% increments');
      }
    } else {
      // 5-25% in 0.5 increments
      if (rate < 5 || rate > 25) {
        throw new Error('For Tips-based methods, contribution rate must be between 5% and 25%');
      }
      if ((rate * 2) % 1 !== 0) {
        throw new Error('For Tips-based methods, contribution rate must be in 0.5% increments');
      }
    }
  }

  /**
   * Get valid contribution rate options based on method
   */
  getContributionRateOptions(method: ContributionMethod): number[] {
    if (method === 'ALL_SALES') {
      // 1-5% in 0.25 increments
      const options: number[] = [];
      for (let rate = 1; rate <= 5; rate += 0.25) {
        options.push(rate);
      }
      return options;
    } else {
      // 5-25% in 0.5 increments
      const options: number[] = [];
      for (let rate = 5; rate <= 25; rate += 0.5) {
        options.push(rate);
      }
      return options;
    }
  }
}

// Export singleton instance
export const settingsService = new SettingsService();
