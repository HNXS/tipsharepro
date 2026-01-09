/**
 * Unit Tests for Tip Calculation Engine
 *
 * These tests verify the core Hours × Rate × Weight algorithm,
 * rounding reconciliation, and edge cases.
 */

import { describe, it, expect } from 'vitest';
import { calculatePoolDistribution } from '../src/services/tip-calculation.service.js';
import { EmployeeCalculationInput } from '../src/types/index.js';

// Helper to create employee input
function createEmployee(
  id: string,
  name: string,
  hours: number,
  rateCents: number,
  weight: number
): EmployeeCalculationInput {
  return {
    employeeId: id,
    employeeName: name,
    locationId: 'loc-1',
    locationName: 'Downtown',
    jobCategoryId: `cat-${weight}`,
    jobCategoryName: weight === 1 ? 'Server' : weight === 2.5 ? 'Cook' : 'Other',
    badgeColor: '#4A90D9',
    hoursWorked: hours,
    hourlyRateCents: rateCents,
    weight,
  };
}

describe('TipCalculationEngine', () => {
  describe('calculatePoolDistribution', () => {
    it('should distribute pool correctly based on hours × rate × weight', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1500, 1.0),  // Server: 40 × 1500 × 1.0 = 60,000
        createEmployee('2', 'Jose', 40, 2000, 2.5),   // Cook: 40 × 2000 × 2.5 = 200,000
      ];
      const totalPoolCents = 100000; // $1,000.00

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // Total basis: 60,000 + 200,000 = 260,000
      // Maria: 60,000 / 260,000 = 23.08%
      // Jose: 200,000 / 260,000 = 76.92%

      expect(result).toHaveLength(2);

      const maria = result.find(r => r.employeeId === '1');
      const jose = result.find(r => r.employeeId === '2');

      expect(maria).toBeDefined();
      expect(jose).toBeDefined();

      // Check percentages (approximately)
      expect(maria!.percentage).toBeCloseTo(23.08, 1);
      expect(jose!.percentage).toBeCloseTo(76.92, 1);

      // Check that total equals pool exactly
      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('should give 100% to single employee', () => {
      const employees = [
        createEmployee('1', 'Maria', 20, 1500, 1.0),
      ];
      const totalPoolCents = 50000; // $500.00

      const result = calculatePoolDistribution(employees, totalPoolCents);

      expect(result).toHaveLength(1);
      expect(result[0].percentage).toBe(100);
      expect(result[0].receivedCents).toBe(50000);
    });

    it('should give $0 to employee with 0 hours', () => {
      const employees = [
        createEmployee('1', 'Maria', 0, 1500, 1.0),   // 0 hours
        createEmployee('2', 'Jose', 40, 1500, 1.0),   // 40 hours
      ];
      const totalPoolCents = 50000;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      const maria = result.find(r => r.employeeId === '1');
      const jose = result.find(r => r.employeeId === '2');

      expect(maria!.receivedCents).toBe(0);
      expect(maria!.percentage).toBe(0);
      expect(jose!.receivedCents).toBe(50000);
      expect(jose!.percentage).toBe(100);
    });

    it('should handle equal distribution among identical employees', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1500, 1.0),
        createEmployee('2', 'Jose', 40, 1500, 1.0),
        createEmployee('3', 'Ana', 40, 1500, 1.0),
      ];
      const totalPoolCents = 90000; // $900.00 - divisible by 3

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // Each should get exactly 1/3
      result.forEach(r => {
        expect(r.receivedCents).toBe(30000);
        expect(r.percentage).toBeCloseTo(33.33, 1);
      });

      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('should handle rounding reconciliation correctly', () => {
      // Create a scenario that will require rounding adjustment
      const employees = [
        createEmployee('1', 'Maria', 33, 1500, 1.0),  // Odd hours
        createEmployee('2', 'Jose', 37, 1800, 1.5),   // Different rate/weight
        createEmployee('3', 'Ana', 29, 1600, 1.25),
      ];
      const totalPoolCents = 100000; // $1,000.00

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // The key assertion: total must EXACTLY equal the pool
      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('should return empty results for empty employee list', () => {
      const result = calculatePoolDistribution([], 50000);
      expect(result).toHaveLength(0);
    });

    it('should return zero shares when pool is zero', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1500, 1.0),
        createEmployee('2', 'Jose', 40, 2000, 2.5),
      ];
      const totalPoolCents = 0;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      result.forEach(r => {
        expect(r.receivedCents).toBe(0);
        expect(r.shareCents).toBe(0);
        expect(r.percentage).toBe(0);
      });
    });

    it('should handle very small pool amounts', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1500, 1.0),
        createEmployee('2', 'Jose', 40, 1500, 1.0),
      ];
      const totalPoolCents = 1; // Only 1 cent

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // One employee should get 1 cent, other gets 0
      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(1);
    });

    it('should handle very large pool amounts', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1500, 1.0),
        createEmployee('2', 'Jose', 40, 2000, 2.5),
      ];
      const totalPoolCents = 10000000; // $100,000.00

      const result = calculatePoolDistribution(employees, totalPoolCents);

      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('should respect different weights correctly', () => {
      // Same hours, same rate, different weights
      const employees = [
        createEmployee('1', 'Server', 40, 1500, 1.0),    // Weight 1.0
        createEmployee('2', 'Busser', 40, 1500, 1.5),    // Weight 1.5
        createEmployee('3', 'Cook', 40, 1500, 2.5),      // Weight 2.5
      ];
      const totalPoolCents = 100000;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // Basis: Server=60000, Busser=90000, Cook=150000, Total=300000
      // Server: 20%, Busser: 30%, Cook: 50%
      const server = result.find(r => r.employeeId === '1');
      const busser = result.find(r => r.employeeId === '2');
      const cook = result.find(r => r.employeeId === '3');

      expect(server!.percentage).toBeCloseTo(20, 1);
      expect(busser!.percentage).toBeCloseTo(30, 1);
      expect(cook!.percentage).toBeCloseTo(50, 1);

      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('should respect different hourly rates correctly', () => {
      // Same hours, same weight, different rates
      const employees = [
        createEmployee('1', 'Junior', 40, 1000, 1.0),   // $10/hr
        createEmployee('2', 'Senior', 40, 2000, 1.0),   // $20/hr
      ];
      const totalPoolCents = 90000;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // Basis: Junior=40000, Senior=80000, Total=120000
      // Junior: 33.33%, Senior: 66.67%
      const junior = result.find(r => r.employeeId === '1');
      const senior = result.find(r => r.employeeId === '2');

      expect(junior!.percentage).toBeCloseTo(33.33, 1);
      expect(senior!.percentage).toBeCloseTo(66.67, 1);

      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('should handle decimal hours correctly', () => {
      const employees = [
        createEmployee('1', 'Maria', 32.5, 1500, 1.0),
        createEmployee('2', 'Jose', 37.75, 1500, 1.0),
      ];
      const totalPoolCents = 70000;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // Verify hours are preserved
      expect(result[0].hoursWorked).toBe(32.5);
      expect(result[1].hoursWorked).toBe(37.75);

      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('should NEVER include basis in results', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1500, 1.0),
        createEmployee('2', 'Jose', 40, 2000, 2.5),
      ];
      const totalPoolCents = 100000;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // Verify no result has a 'basis' property
      result.forEach(r => {
        expect(r).not.toHaveProperty('basis');
        expect(r).not.toHaveProperty('_basis');
      });

      // Also check stringified version
      const jsonStr = JSON.stringify(result);
      expect(jsonStr).not.toContain('basis');
    });

    it('should handle many employees efficiently', () => {
      // Create 100 employees
      const employees: EmployeeCalculationInput[] = [];
      for (let i = 0; i < 100; i++) {
        employees.push(
          createEmployee(
            `emp-${i}`,
            `Employee ${i}`,
            20 + Math.random() * 40, // 20-60 hours
            1000 + Math.floor(Math.random() * 2000), // $10-$30/hr
            1 + Math.random() * 4 // 1-5 weight
          )
        );
      }
      const totalPoolCents = 500000; // $5,000.00

      const startTime = Date.now();
      const result = calculatePoolDistribution(employees, totalPoolCents);
      const endTime = Date.now();

      // Should complete in under 100ms
      expect(endTime - startTime).toBeLessThan(100);

      expect(result).toHaveLength(100);

      const totalDistributed = result.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(totalDistributed).toBe(totalPoolCents);
    });

    it('should handle mixed employees with some having 0 hours', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1500, 1.0),
        createEmployee('2', 'Jose', 0, 2000, 2.5),    // Off this period
        createEmployee('3', 'Ana', 35, 1800, 1.5),
        createEmployee('4', 'Luis', 0, 1500, 1.0),   // Off this period
      ];
      const totalPoolCents = 100000;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      const workingEmployees = result.filter(r => r.hoursWorked > 0);
      const offEmployees = result.filter(r => r.hoursWorked === 0);

      expect(workingEmployees).toHaveLength(2);
      expect(offEmployees).toHaveLength(2);

      // All off employees should have 0
      offEmployees.forEach(e => {
        expect(e.receivedCents).toBe(0);
        expect(e.percentage).toBe(0);
      });

      // Working employees should receive all the pool
      const workingTotal = workingEmployees.reduce((sum, r) => sum + r.receivedCents, 0);
      expect(workingTotal).toBe(totalPoolCents);
    });
  });

  describe('Currency Formatting', () => {
    it('should convert hourly rate from cents to dollars correctly', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1850, 1.0), // $18.50/hr
      ];
      const totalPoolCents = 50000;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      expect(result[0].hourlyRate).toBe(18.50);
    });
  });

  describe('Percentage Formatting', () => {
    it('should return percentage in 0-100 format', () => {
      const employees = [
        createEmployee('1', 'Maria', 40, 1500, 1.0),
        createEmployee('2', 'Jose', 60, 1500, 1.0),
      ];
      const totalPoolCents = 100000;

      const result = calculatePoolDistribution(employees, totalPoolCents);

      // Percentages should be in 0-100 format, not 0-1
      result.forEach(r => {
        expect(r.percentage).toBeGreaterThanOrEqual(0);
        expect(r.percentage).toBeLessThanOrEqual(100);
      });

      // Total percentage should be ~100
      const totalPercentage = result.reduce((sum, r) => sum + r.percentage, 0);
      expect(totalPercentage).toBeCloseTo(100, 0);
    });
  });
});
