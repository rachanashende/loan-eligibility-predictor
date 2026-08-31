# Loan Eligibility Predictor

A rule-based loan eligibility checker. **Currently running frontend-only** — the
scoring logic lives directly in React and results are kept in memory for the session.
A full Express + MySQL backend is included in `backend/` and ready to wire back in
whenever you want persistence (see "Reconnecting the backend" below).

Given an applicant's income, credit score, tax compliance, existing debt, requested loan
amount, and employment history, the app scores them out of 100 across five weighted
factors and returns **Approved / Conditional / Rejected**, along with a full breakdown
of why.

## Why rule-based (not ML)?

This models exactly how a lot of real early-stage underwriting works: transparent,
auditable, deterministic thresholds — not a black box. It's also the right starting
point for this project; swapping the scoring function in `eligibilityEngine.js` for a
trained classifier later is a natural v2 if you want to extend it.

## Current architecture (frontend-only)

```
loan-eligibility-predictor/
├── backend/                  Express + MySQL API — not in use right now, kept for later
└── frontend/                 React (Vite) app — everything currently runs here
    ├── src/
    │   ├── App.jsx             Holds session state (current result + in-memory history)
    │   ├── logic/
    │   │   └── eligibilityEngine.js   <- the core scoring logic (pure function)
    │   ├── components/         LoanForm, ResultStamp, ScoreBreakdown, HistoryPanel
    │   └── api/eligibility.js  Fetch wrapper for the backend — unused for now
    └── .env.example
```

`frontend/src/logic/eligibilityEngine.js` and `backend/src/services/eligibilityEngine.js`
are currently identical copies — the frontend one is what actually runs.

## Scoring logic

| Factor | Max points | Rule |
|---|---|---|
| Credit score | 35 | Banded: 750+ excellent → <600 poor |
| Loan-to-income ratio | 25 | Requested amount vs. annual income multiplier |
| Employment history | 20 | Type (salaried/self-employed/unemployed) × years |
| Tax compliance | 10 | Filed, and tax paid plausible vs. declared income |
| Existing debt load | 10 | Existing monthly debt as % of monthly income |

**Decision bands:** ≥75 Approved · 50–74 Conditional · <50 Rejected.

All thresholds live in `eligibilityEngine.js` — tune them freely, it's a pure function
with no side effects, easy to unit test.

## Setup (frontend-only, current mode)

```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

That's it — no database, no backend process needed right now. History resets on page
refresh since it's held in React state, not persisted anywhere.

## Reconnecting the backend later

When you're ready to add real persistence:

1. Set up MySQL and run `mysql -u root -p < backend/src/db/schema.sql`
2. `cd backend && cp .env.example .env` (fill in MySQL credentials) → `npm install && npm run dev`
3. In `frontend/src/App.jsx`, swap the `computeEligibility` import for the
   `checkEligibility`/`getHistory` calls already written in `frontend/src/api/eligibility.js`
   — the request/response shapes already match what `ResultStamp` and `HistoryPanel` expect
4. `cd frontend && cp .env.example .env` → confirm `VITE_API_BASE` points at your backend

## API (backend, for later)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/check-eligibility` | Submit an application, get score + decision |
| GET | `/api/history` | Last 50 applications (summary) |
| GET | `/api/history/:id` | Full record for one application, incl. breakdown |

### Example request

```json
POST /api/check-eligibility
{
  "fullName": "Rach Mehta",
  "monthlyIncome": 60000,
  "creditScore": 720,
  "taxFiled": true,
  "annualTaxPaid": 40000,
  "requestedLoanAmount": 500000,
  "existingMonthlyDebt": 5000,
  "employmentType": "salaried",
  "employmentYears": 2.5
}
```

## Ideas to extend it

- Reconnect the backend for real persistence (see above)
- Add JWT auth so applicants can view their own history
- Swap `eligibilityEngine.js` for a trained logistic regression / decision tree model
  and compare its output against the rule engine
- Add unit tests for the engine (it's a pure function — very testable)

