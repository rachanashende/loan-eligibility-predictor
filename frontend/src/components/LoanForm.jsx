import { useState } from "react";

const initialState = {
  fullName: "",
  monthlyIncome: "",
  creditScore: "",
  taxFiled: false,
  annualTaxPaid: "",
  requestedLoanAmount: "",
  existingMonthlyDebt: "",
  employmentType: "salaried",
  employmentYears: "",
};

export default function LoanForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState(initialState);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      fullName: form.fullName,
      monthlyIncome: Number(form.monthlyIncome),
      creditScore: Number(form.creditScore),
      taxFiled: form.taxFiled,
      annualTaxPaid: Number(form.annualTaxPaid || 0),
      requestedLoanAmount: Number(form.requestedLoanAmount),
      existingMonthlyDebt: Number(form.existingMonthlyDebt || 0),
      employmentType: form.employmentType,
      employmentYears: Number(form.employmentYears),
    });
  }

  return (
    <div className="paper form-panel">
      <h2>Application Particulars</h2>
      <p className="sub">Fill in the fields below exactly as they appear on your records.</p>

      {error && <div className="form-error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="As per ID"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="monthlyIncome">Monthly income (₹)</label>
            <input
              id="monthlyIncome"
              type="number"
              min="0"
              required
              value={form.monthlyIncome}
              onChange={(e) => update("monthlyIncome", e.target.value)}
              placeholder="60000"
            />
          </div>
          <div className="field">
            <label htmlFor="creditScore">Credit score (300-850)</label>
            <input
              id="creditScore"
              type="number"
              min="300"
              max="850"
              required
              value={form.creditScore}
              onChange={(e) => update("creditScore", e.target.value)}
              placeholder="720"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="requestedLoanAmount">Requested loan amount (₹)</label>
            <input
              id="requestedLoanAmount"
              type="number"
              min="0"
              required
              value={form.requestedLoanAmount}
              onChange={(e) => update("requestedLoanAmount", e.target.value)}
              placeholder="500000"
            />
          </div>
          <div className="field">
            <label htmlFor="existingMonthlyDebt">Existing monthly debt (₹)</label>
            <input
              id="existingMonthlyDebt"
              type="number"
              min="0"
              value={form.existingMonthlyDebt}
              onChange={(e) => update("existingMonthlyDebt", e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="employmentType">Employment type</label>
            <select
              id="employmentType"
              value={form.employmentType}
              onChange={(e) => update("employmentType", e.target.value)}
            >
              <option value="salaried">Salaried</option>
              <option value="self_employed">Self-employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="employmentYears">Years in current employment</label>
            <input
              id="employmentYears"
              type="number"
              min="0"
              step="0.5"
              required
              value={form.employmentYears}
              onChange={(e) => update("employmentYears", e.target.value)}
              placeholder="2.5"
            />
          </div>
        </div>

        <div className="checkbox-field">
          <input
            id="taxFiled"
            type="checkbox"
            checked={form.taxFiled}
            onChange={(e) => update("taxFiled", e.target.checked)}
          />
          <label htmlFor="taxFiled">Tax returns filed for the last financial year</label>
        </div>

        {form.taxFiled && (
          <div className="field">
            <label htmlFor="annualTaxPaid">Annual tax paid (₹)</label>
            <input
              id="annualTaxPaid"
              type="number"
              min="0"
              value={form.annualTaxPaid}
              onChange={(e) => update("annualTaxPaid", e.target.value)}
              placeholder="25000"
            />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Evaluating\u2026" : "Submit application"}
        </button>
      </form>
    </div>
  );
}
