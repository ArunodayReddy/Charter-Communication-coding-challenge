# Rewards Calculator Coding Challenge

## Overview

A standalone JavaScript solution for the customer rewards points assignment.

The implementation covers:

- Reward calculation per transaction
- Monthly and total points per customer
- Simulated asynchronous API call
- Sample dataset
- Unit tests for business logic and async behavior

## Reward Rules

For each transaction amount:

- 0 points for the first $50
- 1 point per dollar from $51 to $100
- 2 points per dollar above $100

Example:

- $120 purchase = (50 × 1) + (20 × 2) = 90 points

## Folder Structure

```
├── package.json                          # Project dependencies and scripts
├── vitest.challenge.config.mjs           # Vitest test configuration
├── README.md                             # This file
├── ASYNC_TESTING_GUIDE.md                # Step-by-step async testing guide
└── src/
    ├── rewardsCalculator.js              # Domain logic, sample data, async API simulation, logger
    ├── RewardsChallengeApp.jsx           # React UI component for rendering the rewards report
    └── rewardsCalculator.vitest.spec.js  # Test suite (points, aggregation, malformed input, async)
```

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

## Getting Started (Local Setup)

1. **Clone the repository**

   ```bash
   git clone https://github.com/ArunodayReddy/Charter-Communication-coding-challenge.git
   cd Charter-Communication-coding-challenge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the tests**

   ```bash
   npm test
   ```

   You should see output like:

   ```
   ✓ src/rewardsCalculator.vitest.spec.js (9 tests)

   Test Files  1 passed (1)
        Tests  9 passed (9)
   ```

4. **Run tests in watch mode** (re-runs on file changes)

   ```bash
   npm run test:watch
   ```

## What the Tests Validate

| Test | What it checks |
|------|---------------|
| Points at or below $50 | Returns 0 points |
| Points between $51–$100 | Returns 1 point per dollar over $50 |
| Points above $100 | Returns 2 points per dollar over $100, plus lower-band points |
| Decimal amounts | Uses whole-dollar (floor) logic |
| Month key formatting | Produces `YYYY-MM` format; returns null for invalid dates |
| Monthly & total aggregation | Builds correct per-customer, per-month, and grand total report |
| Malformed transactions | Skips entries with missing customer ID or invalid date |
| Async fetch success | Resolves with sample transaction data |
| Async fetch failure | Rejects with error message when `shouldFail` is true |

## Architecture Notes

- **Separation of concerns:**
  - Calculation and aggregation are isolated in `src/rewardsCalculator.js`
  - UI rendering is isolated in `src/RewardsChallengeApp.jsx`
- **Scalability:**
  - Reward thresholds and rates are centralized in `REWARD_RULES`
  - Report output is normalized for table-based rendering and extension
  - Async API simulation supports delay and failure scenarios for realistic testing
- **Maintainability:**
  - Clear function boundaries
  - Input guardrails for malformed transactions
  - Scoped logging through `rewardsLogger` for debugging
