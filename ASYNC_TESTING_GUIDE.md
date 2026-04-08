# Async Testing Guide (Reviewer Steps)

## Purpose

This guide explains how to validate the simulated asynchronous API behavior used in the rewards coding challenge.

Scope covered:

- Success path (data loads correctly)
- Loading state behavior
- Failure path behavior
- Console logging visibility
- Automated async test verification

## Where Async Is Implemented

- **Data fetch simulation:** `src/rewardsCalculator.js`
  - Function: `fetchTransactions({ delayMs, shouldFail })`
  - Uses Promise + setTimeout to mimic API latency
- **UI usage:** `src/RewardsChallengeApp.jsx`
  - Calls `fetchTransactions` inside `useEffect`
  - Manages loading, error, and success states

## Prerequisites

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/ArunodayReddy/Charter-Communication-coding-challenge.git
   cd Charter-Communication-coding-challenge
   npm install
   ```

## Automated Async Test Validation

Run from the repository root:

```bash
npm test
```

Expected result:

- 1 test file passed
- All 9 tests passed, including:
  - Async success test (`simulates asynchronous API data fetching`)
  - Async failure test (`rejects when simulated API failure is requested`)

## Manual Review Steps

### 1. Simulate Slow API

1. In `src/RewardsChallengeApp.jsx`, locate:

   ```js
   fetchTransactions({ delayMs: 350 })
   ```

2. Temporarily change `delayMs` to `3000`
3. When integrated into a React app, the loading state should be visible for ~3 seconds
4. Revert `delayMs` back to `350` after demo

### 2. Simulate API Failure

1. In `src/RewardsChallengeApp.jsx`, temporarily change the fetch call to:

   ```js
   fetchTransactions({ delayMs: 350, shouldFail: true })
   ```

2. When integrated into a React app, the error message should display:
   `"Unable to load reward transactions. Please retry."`
3. Console includes simulated API failure log
4. Revert `shouldFail` back to `false` / remove after demo

### 3. Logger Verification

1. Open browser console while loading the page (when integrated into a React app)
2. Expected logs include entries scoped by: `[RewardsCalculator]`
3. Typical log checkpoints:
   - `Fetching transactions (simulated API)`
   - `Building report`
   - `Report ready`

## Reviewer Acceptance Checklist

- [ ] All 9 tests pass when running `npm test`
- [ ] Async success test resolves with correct transaction data
- [ ] Async failure test rejects with expected error
- [ ] Malformed transaction handling skips invalid entries
- [ ] Reward calculation covers boundary cases ($50, $51, $100, $120, $200)
- [ ] Code is well-structured with clear separation of concerns
