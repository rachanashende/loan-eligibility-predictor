import { pool } from "../config/db.js";
import { computeEligibility } from "../services/eligibilityEngine.js";

export async function checkEligibility(req, res) {
  try {
    const input = req.body;
    const result = computeEligibility(input);

    const [dbResult] = await pool.execute(
      `INSERT INTO applications
        (full_name, monthly_income, credit_score, tax_filed, annual_tax_paid,
         requested_loan_amount, existing_monthly_debt, employment_type, employment_years,
         total_score, decision, breakdown_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.fullName,
        input.monthlyIncome,
        input.creditScore,
        input.taxFiled,
        input.annualTaxPaid,
        input.requestedLoanAmount,
        input.existingMonthlyDebt,
        input.employmentType,
        input.employmentYears,
        result.totalScore,
        result.decision,
        JSON.stringify(result.breakdown),
      ]
    );

    res.status(201).json({
      id: dbResult.insertId,
      fullName: input.fullName,
      ...result,
    });
  } catch (err) {
    console.error("checkEligibility error:", err);
    res.status(500).json({ message: "Something went wrong while evaluating eligibility." });
  }
}

export async function getHistory(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, full_name, requested_loan_amount, total_score, decision, created_at
       FROM applications
       ORDER BY created_at DESC
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    console.error("getHistory error:", err);
    res.status(500).json({ message: "Could not fetch history." });
  }
}

export async function getApplicationById(req, res) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM applications WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Application not found." });
    }
    const row = rows[0];
    res.json({ ...row, breakdown_json: JSON.parse(row.breakdown_json) });
  } catch (err) {
    console.error("getApplicationById error:", err);
    res.status(500).json({ message: "Could not fetch application." });
  }
}
