/**
 * Rule-based loan eligibility engine.
 *
 * Five weighted factors add up to a score out of 100:
 *   - Credit score        (35 pts)
 *   - Loan-to-income ratio(25 pts)
 *   - Employment history  (20 pts)
 *   - Tax compliance      (10 pts)
 *   - Existing debt load  (10 pts)
 *
 * Score bands map to a final decision:
 *   >= 75  -> APPROVED
 *   50-74  -> CONDITIONAL (approved with conditions, e.g. co-signer / higher rate)
 *   < 50   -> REJECTED
 */

function scoreCreditScore(creditScore) {
  const max = 35;
  if (creditScore >= 750) return { score: max, note: "Excellent credit (750+)" };
  if (creditScore >= 700) return { score: 28, note: "Good credit (700-749)" };
  if (creditScore >= 650) return { score: 20, note: "Fair credit (650-699)" };
  if (creditScore >= 600) return { score: 10, note: "Weak credit (600-649)" };
  return { score: 0, note: "Poor credit (below 600)" };
}

function scoreLoanToIncome(requestedLoanAmount, monthlyIncome) {
  const max = 25;
  const annualIncome = monthlyIncome * 12;
  const ratio = annualIncome > 0 ? requestedLoanAmount / annualIncome : Infinity;

  if (ratio <= 2) return { score: max, note: `Loan is ${ratio.toFixed(1)}x annual income - comfortable` };
  if (ratio <= 4) return { score: 18, note: `Loan is ${ratio.toFixed(1)}x annual income - moderate` };
  if (ratio <= 6) return { score: 10, note: `Loan is ${ratio.toFixed(1)}x annual income - stretched` };
  return { score: 0, note: `Loan is ${ratio.toFixed(1)}x annual income - too high` };
}

function scoreEmployment(employmentType, employmentYears) {
  const max = 20;
  if (employmentType === "unemployed") {
    return { score: 0, note: "No current employment" };
  }
  if (employmentType === "salaried") {
    if (employmentYears >= 3) return { score: max, note: `Salaried, ${employmentYears}y - stable` };
    if (employmentYears >= 1) return { score: 14, note: `Salaried, ${employmentYears}y - building history` };
    return { score: 8, note: `Salaried, under 1y - limited history` };
  }
  // self_employed
  if (employmentYears >= 3) return { score: 14, note: `Self-employed, ${employmentYears}y - established` };
  return { score: 8, note: `Self-employed, under 3y - higher risk` };
}

function scoreTaxCompliance(taxFiled, annualTaxPaid, monthlyIncome) {
  const max = 10;
  if (!taxFiled) return { score: 0, note: "No tax returns filed" };

  const annualIncome = monthlyIncome * 12;
  // Very rough plausibility check: tax paid should be a believable slice of income.
  const impliedRate = annualIncome > 0 ? annualTaxPaid / annualIncome : 0;

  if (impliedRate >= 0.02 && impliedRate <= 0.4) {
    return { score: max, note: "Tax filings consistent with declared income" };
  }
  return { score: 5, note: "Tax filings present but inconsistent with declared income" };
}

function scoreExistingDebt(existingMonthlyDebt, monthlyIncome) {
  const max = 10;
  const ratio = monthlyIncome > 0 ? existingMonthlyDebt / monthlyIncome : Infinity;

  if (ratio < 0.2) return { score: max, note: `Existing debt is ${(ratio * 100).toFixed(0)}% of income - low` };
  if (ratio < 0.4) return { score: 6, note: `Existing debt is ${(ratio * 100).toFixed(0)}% of income - moderate` };
  return { score: 0, note: `Existing debt is ${(ratio * 100).toFixed(0)}% of income - high` };
}

export function computeEligibility(input) {
  const {
    monthlyIncome,
    creditScore,
    taxFiled,
    annualTaxPaid,
    requestedLoanAmount,
    existingMonthlyDebt,
    employmentType,
    employmentYears,
  } = input;

  const factors = [
    { key: "creditScore", label: "Credit Score", maxScore: 35, ...scoreCreditScore(creditScore) },
    { key: "loanToIncome", label: "Loan-to-Income Ratio", maxScore: 25, ...scoreLoanToIncome(requestedLoanAmount, monthlyIncome) },
    { key: "employment", label: "Employment History", maxScore: 20, ...scoreEmployment(employmentType, employmentYears) },
    { key: "taxCompliance", label: "Tax Compliance", maxScore: 10, ...scoreTaxCompliance(taxFiled, annualTaxPaid, monthlyIncome) },
    { key: "existingDebt", label: "Existing Debt Load", maxScore: 10, ...scoreExistingDebt(existingMonthlyDebt, monthlyIncome) },
  ];

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);

  let decision;
  if (totalScore >= 75) decision = "APPROVED";
  else if (totalScore >= 50) decision = "CONDITIONAL";
  else decision = "REJECTED";

  return { totalScore, decision, breakdown: factors };
}
