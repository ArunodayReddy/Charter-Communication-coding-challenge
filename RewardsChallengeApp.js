import { useEffect, useMemo, useState } from 'react';
import {
  buildRewardsReport,
  calculateTransactionPoints,
  fetchTransactions,
  rewardsLogger
} from './rewardsCalculator';

/**
 * Rewards Challenge UI
 *
 * Scope:
 * - Loads transaction data via simulated async API.
 * - Renders customer reward totals by month and grand totals.
 * - Keeps logic separated in rewardsCalculator for scalability.
 */
const RewardsChallengeApp = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactions({ delayMs: 350 });
        if (!cancelled) {
          setTransactions(data);
        }
      } catch (fetchError) {
        rewardsLogger.error('UI failed to load transactions', fetchError);
        if (!cancelled) {
          setError('Unable to load reward transactions. Please retry.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const report = useMemo(
    () => buildRewardsReport(transactions),
    [transactions]
  );
  const transactionRows = useMemo(
    () =>
      transactions.map(transaction => ({
        ...transaction,
        points: calculateTransactionPoints(transaction.amount)
      })),
    [transactions]
  );

  if (loading) {
    return <div>Loading reward transactions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section>
      <h1>Customer Rewards Report</h1>
      <p>Three-month reward points summary per customer.</p>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Customer</th>
            {report.months.map(month => (
              <th key={month}>{month}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {report.customers.map(customer => (
            <tr key={customer.customerId}>
              <td>{customer.customerName}</td>
              {report.months.map(month => (
                <td key={`${customer.customerId}-${month}`}>
                  {customer.monthlyPoints[month]}
                </td>
              ))}
              <td>{customer.totalPoints}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={report.months.length + 1}>Grand Total Points</td>
            <td>{report.totals.allCustomersPoints}</td>
          </tr>
        </tfoot>
      </table>

      <h2 style={{ marginTop: '24px' }}>
        Sample Transaction Dataset (Used In Calculation)
      </h2>
      <p>
        This table shows the exact transaction inputs used to compute the
        rewards report above.
      </p>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Amount ($)</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {transactionRows.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.customerId}</td>
              <td>{row.customerName}</td>
              <td>{row.transactionDate}</td>
              <td>{row.amount}</td>
              <td>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default RewardsChallengeApp;
