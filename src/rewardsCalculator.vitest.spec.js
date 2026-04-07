import { describe, expect, it } from 'vitest';
import {
  buildRewardsReport,
  calculateTransactionPoints,
  fetchTransactions,
  formatMonthKey,
  SAMPLE_TRANSACTIONS
} from './rewardsCalculator';

describe('rewardsCalculator', () => {
  it('returns zero points for amounts at or below 50', () => {
    expect(calculateTransactionPoints(10)).toBe(0);
    expect(calculateTransactionPoints(50)).toBe(0);
  });

  it('returns one point per dollar between 51 and 100', () => {
    expect(calculateTransactionPoints(75)).toBe(25);
    expect(calculateTransactionPoints(100)).toBe(50);
  });

  it('returns two points per dollar above 100 plus lower-band points', () => {
    expect(calculateTransactionPoints(120)).toBe(90);
    expect(calculateTransactionPoints(200)).toBe(250);
  });

  it('uses whole-dollar logic for decimal transaction amounts', () => {
    expect(calculateTransactionPoints(120.99)).toBe(90);
  });

  it('formats month keys as YYYY-MM', () => {
    expect(formatMonthKey('2026-03-19')).toBe('2026-03');
    expect(formatMonthKey('invalid-date')).toBeNull();
  });

  it('builds monthly and total points per customer', () => {
    const report = buildRewardsReport([
      {
        id: '1',
        customerId: 'c-1',
        customerName: 'Alice',
        transactionDate: '2026-01-01',
        amount: 120
      },
      {
        id: '2',
        customerId: 'c-1',
        customerName: 'Alice',
        transactionDate: '2026-01-22',
        amount: 80
      },
      {
        id: '3',
        customerId: 'c-1',
        customerName: 'Alice',
        transactionDate: '2026-02-02',
        amount: 51
      },
      {
        id: '4',
        customerId: 'c-2',
        customerName: 'Bob',
        transactionDate: '2026-02-10',
        amount: 200
      },
      {
        id: '5',
        customerId: 'c-2',
        customerName: 'Bob',
        transactionDate: '2026-03-01',
        amount: 50
      }
    ]);

    expect(report.months).toEqual(['2026-01', '2026-02', '2026-03']);

    expect(report.customers).toEqual([
      {
        customerId: 'c-1',
        customerName: 'Alice',
        monthlyPoints: {
          '2026-01': 120,
          '2026-02': 1,
          '2026-03': 0
        },
        totalPoints: 121,
        transactionCount: 3,
        totalSpend: 251
      },
      {
        customerId: 'c-2',
        customerName: 'Bob',
        monthlyPoints: {
          '2026-01': 0,
          '2026-02': 250,
          '2026-03': 0
        },
        totalPoints: 250,
        transactionCount: 2,
        totalSpend: 250
      }
    ]);

    expect(report.totals).toEqual({
      allCustomersPoints: 371,
      allTransactions: 5
    });
  });

  it('ignores malformed transactions safely', () => {
    const report = buildRewardsReport([
      {
        id: '1',
        customerId: 'c-1',
        customerName: 'A',
        transactionDate: '2026-01-01',
        amount: 120
      },
      {
        id: '2',
        customerId: '',
        customerName: 'B',
        transactionDate: '2026-01-02',
        amount: 90
      },
      {
        id: '3',
        customerId: 'c-3',
        customerName: 'C',
        transactionDate: 'bad-date',
        amount: 200
      }
    ]);

    expect(report.months).toEqual(['2026-01']);
    expect(report.customers).toHaveLength(1);
    expect(report.customers[0].totalPoints).toBe(90);
  });

  it('simulates asynchronous API data fetching', async () => {
    const transactions = await fetchTransactions({ delayMs: 1 });

    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBe(SAMPLE_TRANSACTIONS.length);
    expect(transactions[0]).toHaveProperty('customerId');
  });

  it('rejects when simulated API failure is requested', async () => {
    await expect(
      fetchTransactions({ delayMs: 1, shouldFail: true })
    ).rejects.toThrow('Failed to fetch transactions');
  });
});
