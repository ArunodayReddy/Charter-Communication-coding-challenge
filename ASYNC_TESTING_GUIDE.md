# Async Testing Guide (Reviewer Steps)

## Purpose

This guide explains how to validate the simulated asynchronous API behavior used in the rewards coding challenge.

Scope covered:

- Success path (data loads and tables render)
- Loading state behavior
- Failure path behavior
- Console logging visibility
- Automated async test verification

## Where Async Is Implemented

- Data fetch simulation: coding-challenge/rewards/rewardsCalculator.js
  - Function: fetchTransactions({ delayMs, shouldFail })
  - Uses Promise + setTimeout to mimic API latency
- UI usage: coding-challenge/rewards/RewardsChallengeApp.js
  - Calls fetchTransactions inside useEffect
  - Manages loading, error, and success states

## Prerequisites

1. Install dependencies from repo root:
   npm install
2. Start the app using your normal local startup command for this workspace.
3. Open the challenge route:
   /shop/rewards-challenge-demo

Note:

- This workspace uses Next.js basePath '/shop', so include '/shop' in the URL.

## Manual Reviewer Test Steps

### 1. Success Path (default)

1. Open /shop/rewards-challenge-demo
2. Expected behavior:
   - Loading text appears briefly
   - Rewards summary table renders
   - Sample transaction dataset table renders
3. Expected result:
   - No error message shown

### 2. Loading State Visibility

1. Open browser DevTools > Network
2. Set throttling to Slow 3G (or similar)
3. Hard refresh the page
4. Expected behavior:
   - "Loading reward transactions..." remains visible longer before table render

### 3. Simulate Slow API (explicit)

1. In coding-challenge/rewards/RewardsChallengeApp.js, locate:
   fetchTransactions({ delayMs: 350 })
2. Temporarily change delayMs to 3000
3. Refresh page
4. Expected behavior:
   - Loading state visible for around 3 seconds
   - Data eventually renders
5. Revert delayMs back to 350 after demo

### 4. Simulate API Failure

1. In coding-challenge/rewards/RewardsChallengeApp.js, temporarily change fetch call to:
   fetchTransactions({ delayMs: 350, shouldFail: true })
2. Refresh page
3. Expected behavior:
   - Error message shown: "Unable to load reward transactions. Please retry."
   - Console includes simulated API failure log
4. Revert shouldFail back to false/removed after demo

### 5. Logger Verification

1. Open browser console while loading page
2. Expected logs include entries scoped by:
   [RewardsCalculator]
3. Typical log checkpoints:
   - Fetching transactions (simulated API)
   - Building report
   - Report ready

## Automated Async Test Validation

Run this from repo root:

npx vitest run --config coding-challenge/rewards/vitest.challenge.config.mjs

Expected result:

- 1 test file passed
- Async success test passed
- Async failure test passed

## Reviewer Acceptance Checklist

- Success flow loads and renders both tables
- Loading behavior is visible under throttled or delayed conditions
- Failure flow displays user-friendly error state
- Async logs are visible in console for traceability
- Dedicated async tests pass via Vitest
