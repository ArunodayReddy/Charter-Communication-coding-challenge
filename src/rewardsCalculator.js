/**
 * Rewards Calculator Domain Module
 *
 * Scope:
 * - Calculate reward points per transaction.
 * - Aggregate points by customer and month.
 * - Provide a simulated async API for UI consumption.
 *
 * Notes for maintainability/scalability:
 * - Reward thresholds are centralized in REWARD_RULES.
 * - Aggregation output is normalized for table rendering.
 * - Logging is scoped and can be toggled through DEBUG_LOGS_ENABLED.
 */

const DEBUG_LOGS_ENABLED = true;
const LOG_SCOPE = '[RewardsCalculator]';

export const rewardsLogger = {
  debug: (...args) => {
    if (DEBUG_LOGS_ENABLED) {
      console.debug(LOG_SCOPE, ...args);
    }
  },
  info: (...args) => {
    if (DEBUG_LOGS_ENABLED) {
      console.info(LOG_SCOPE, ...args);
    }
  },
  error: (...args) => {
    console.error(LOG_SCOPE, ...args);
  }
};

export const REWARD_RULES = Object.freeze({
  LOWER_THRESHOLD: 50,
  UPPER_THRESHOLD: 100,
  LOWER_RATE: 1,
  UPPER_RATE: 2
});

export const SAMPLE_TRANSACTIONS = Object.freeze([
  {
    id: 't-1001',
    customerId: 'c-101',
    customerName: 'Alice',
    transactionDate: '2026-01-05',
    amount: 120
  },
  {
    id: 't-1002',
    customerId: 'c-101',
    customerName: 'Alice',
    transactionDate: '2026-01-18',
    amount: 80
  },
  {
    id: 't-1003',
    customerId: 'c-101',
    customerName: 'Alice',
    transactionDate: '2026-02-03',
    amount: 51
  },
  {
    id: 't-1004',
    customerId: 'c-102',
    customerName: 'Bob',
    transactionDate: '2026-02-10',
    amount: 200
  },
  {
    id: 't-1005',
    customerId: 'c-102',
    customerName: 'Bob',
    transactionDate: '2026-03-01',
    amount: 50
  },
  {
    id: 't-1006',
    customerId: 'c-103',
    customerName: 'Carla',
    transactionDate: '2026-03-08',
    amount: 170
  }
]);

const toWholeDollars = amount => Math.max(0, Math.floor(Number(amount) || 0));

export const formatMonthKey = dateInput => {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Calculates rewards for a single transaction amount.
 *
 * Rule:
 * - 0 points for first $50
 * - 1 point per $1 between $51 and $100
 * - 2 points per $1 above $100
 */
export const calculateTransactionPoints = amount => {
  const dollars = toWholeDollars(amount);
  const { LOWER_THRESHOLD, UPPER_THRESHOLD, LOWER_RATE, UPPER_RATE } =
    REWARD_RULES;

  if (dollars <= LOWER_THRESHOLD) {
    return 0;
  }

  if (dollars <= UPPER_THRESHOLD) {
    return (dollars - LOWER_THRESHOLD) * LOWER_RATE;
  }

  const lowerBandPoints = (UPPER_THRESHOLD - LOWER_THRESHOLD) * LOWER_RATE;
  const upperBandPoints = (dollars - UPPER_THRESHOLD) * UPPER_RATE;
  return lowerBandPoints + upperBandPoints;
};

/**
 * Builds a normalized rewards report.
 *
 * Output shape:
 * {
 *   months: ['YYYY-MM', ...],
 *   customers: [{ customerId, customerName, monthlyPoints, totalPoints, transactionCount, totalSpend }],
 *   totals: { allCustomersPoints, allTransactions }
 * }
 */
export const buildRewardsReport = (transactions = []) => {
  rewardsLogger.info('Building report', {
    transactionCount: transactions.length
  });

  const monthsSet = new Set();
  const customerMap = new Map();

  for (const transaction of transactions) {
    const monthKey = formatMonthKey(transaction?.transactionDate);
    if (!monthKey || !transaction?.customerId) {
      rewardsLogger.debug('Skipping invalid transaction', transaction);
      continue;
    }

    monthsSet.add(monthKey);

    const points = calculateTransactionPoints(transaction.amount);
    const spend = toWholeDollars(transaction.amount);
    const customerId = transaction.customerId;

    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        customerId,
        customerName: transaction.customerName || customerId,
        monthlyPoints: {},
        totalPoints: 0,
        transactionCount: 0,
        totalSpend: 0
      });
    }

    const customerRecord = customerMap.get(customerId);
    customerRecord.monthlyPoints[monthKey] =
      (customerRecord.monthlyPoints[monthKey] || 0) + points;
    customerRecord.totalPoints += points;
    customerRecord.transactionCount += 1;
    customerRecord.totalSpend += spend;
  }

  const months = [...monthsSet].sort();
  const customers = [...customerMap.values()]
    .map(customer => {
      const normalizedMonthlyPoints = months.reduce((acc, monthKey) => {
        acc[monthKey] = customer.monthlyPoints[monthKey] || 0;
        return acc;
      }, {});

      return {
        ...customer,
        monthlyPoints: normalizedMonthlyPoints
      };
    })
    .sort((a, b) => a.customerName.localeCompare(b.customerName));

  const totals = {
    allCustomersPoints: customers.reduce(
      (acc, customer) => acc + customer.totalPoints,
      0
    ),
    allTransactions: transactions.length
  };

  rewardsLogger.info('Report ready', {
    customerCount: customers.length,
    months,
    allCustomersPoints: totals.allCustomersPoints
  });

  return {
    months,
    customers,
    totals
  };
};

/**
 * Simulates an asynchronous API call that returns transaction data.
 */
export const fetchTransactions = ({
  delayMs = 300,
  shouldFail = false
} = {}) => {
  rewardsLogger.info('Fetching transactions (simulated API)', {
    delayMs,
    shouldFail
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        const error = new Error('Failed to fetch transactions');
        rewardsLogger.error('Simulated API failure', error);
        reject(error);
        return;
      }

      const cloned = SAMPLE_TRANSACTIONS.map(item => ({ ...item }));
      resolve(cloned);
    }, delayMs);
  });
};
