# Rewards Calculator Coding Challenge

## Overview

This folder contains a standalone React JS solution for the customer rewards assignment.

The implementation covers:

- Reward calculation per transaction
- Monthly and total points per customer
- Simulated asynchronous API call
- No Redux
- Sample dataset
- Unit tests for business logic and async behavior

## Reward Rules

For each transaction amount:

- 0 points for the first $50
- 1 point per dollar from $51 to $100
- 2 points per dollar above $100

Example:

- $120 purchase = (50 x 1) + (20 x 2) = 90 points

## Folder Contents

- rewardsCalculator.js: Domain logic, sample transactions, async API simulation, and debug logger
- RewardsChallengeApp.js: React UI component that loads data and renders monthly and total reward points
- rewardsCalculator.vitest.spec.js: Test suite for point calculation, report aggregation, malformed input handling, and API simulation
- vitest.challenge.config.mjs: Dedicated Vitest config for running this standalone JS challenge
- ASYNC_TESTING_GUIDE.md: Step-by-step reviewer guide for validating async behavior (success/loading/failure)

## Run Instructions

From repository root:

1. Run challenge tests
   npm run test:vitest -- --config coding-challenge/rewards/vitest.challenge.config.mjs

Alternative direct command:
npx vitest run --config coding-challenge/rewards/vitest.challenge.config.mjs

2. Use UI component
   Import and render RewardsChallengeApp.js from any React page/container as needed.

3. Quick preview route in this workspace
   Start the app and open /shop/rewards-challenge-demo to view the challenge UI directly.

## Architecture Notes

- Separation of concerns:
  - Calculation and aggregation are isolated in rewardsCalculator.js
  - UI rendering is isolated in RewardsChallengeApp.js
- Scalability:
  - Reward thresholds and rates are centralized in REWARD_RULES
  - Report output is normalized for table-based rendering and extension
  - Async API simulation supports delay and failure scenarios for realistic testing
- Maintainability:
  - Clear function boundaries
  - Input guardrails for malformed transactions
  - Scoped logging through rewardsLogger for debugging

## Test Coverage Scope

Current tests validate:

- Boundary and tiered rewards logic
- Whole-dollar behavior for decimal amounts
- Month key formatting
- Monthly and total customer aggregation
- Malformed transaction handling
- Async fetch success and failure paths

## GitHub Submission Checklist

1. Commit only the coding challenge folder changes if desired.
2. Push to your GitHub repository.
3. Ensure README and test command are included in the submission notes.
4. Share repository URL and branch/commit reference.
