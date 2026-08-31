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

function validateField(field, form) {
  switch (field) {
    case "fullName":
      if (!form.fullName || form.fullName.trim().length < 2) {
        return "Enter the applicant's full name.";
      }
      return null;
    case "monthlyIncome":
      if (form.monthlyIncome === "" || Number(form.monthlyIncome) <= 0) {
        return "Monthly income must be greater than 0.";
      }
      return null;
    case "creditScore": {
      const v = Number(form.creditScore);
      if (form.creditScore === "" || v < 300 || v > 850) {
        return "Credit score must be between 300 and 850.";
      }
      return null;
    }
    case "requestedLoanAmount":
      if (form.requestedLoanAmount === "" || Number(form.requestedLoanAmount) <= 0) {
        return "Loan amount must be greater than 0.";
      }
      return null;
    case "employmentYears":
      if (form.employmentYears === "" || Number(form.employmentYears) < 0) {
        return "Enter years of employment (0 or more).";
      }
      return null;
    default:
      return null;
  }
}

const VALIDATED_FIELDS = [
  "fullName",
  "monthlyIncome",
  "creditScore",
  "requestedLoanAmount",
  "employmentYears",
];

export default function LoanForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState(initialState);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  function update(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, next) }));
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form) }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {};
    VALIDATED_FIELDS.forEach((field) => {
      nextErrors[field] = validateField(field, form);
    });
    setErrors(nextErrors);
    setTouched(Object.fromEntries(VALIDATED_FIELDS.map((f) => [f, true])));

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    onSubmit({
      fullName: form.fullName.trim(),
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

  function fieldClass(field) {
    return touched[field] && errors[field] ? "invalid" : "";
  }

  return (
    <div className="paper form-panel">
      <h2>Application Particulars</h2>
      <p className="sub">Fill in the fields below exactly as they appear on your records.</p>

      {error && <div className="form-error-banner">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            className={fieldClass("fullName")}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            placeholder="As per ID"
          />
          {touched.fullName && errors.fullName && <div className="error">{errors.fullName}</div>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="monthlyIncome">Monthly income (₹)</label>
            <input
              id="monthlyIncome"
              type="number"
              min="0"
              className={fieldClass("monthlyIncome")}
              value={form.monthlyIncome}
              onChange={(e) => update("monthlyIncome", e.target.value)}
              onBlur={() => handleBlur("monthlyIncome")}
              placeholder="60000"
            />
            {touched.monthlyIncome && errors.monthlyIncome && (
              <div className="error">{errors.monthlyIncome}</div>
            )}
          </div>
          <div className="field">
            <label htmlFor="creditScore">Credit score (300-850)</label>
            <input
              id="creditScore"
              type="number"
              min="300"
              max="850"
              className={fieldClass("creditScore")}
              value={form.creditScore}
              onChange={(e) => update("creditScore", e.target.value)}
              onBlur={() => handleBlur("creditScore")}
              placeholder="720"
            />
            {touched.creditScore && errors.creditScore && (
              <div className="error">{errors.creditScore}</div>
            )}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="requestedLoanAmount">Requested loan amount (₹)</label>
            <input
              id="requestedLoanAmount"
              type="number"
              min="0"
              className={fieldClass("requestedLoanAmount")}
              value={form.requestedLoanAmount}
              onChange={(e) => update("requestedLoanAmount", e.target.value)}
              onBlur={() => handleBlur("requestedLoanAmount")}
              placeholder="500000"
            />
            {touched.requestedLoanAmount && errors.requestedLoanAmount && (
              <div className="error">{errors.requestedLoanAmount}</div>
            )}
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
              className={fieldClass("employmentYears")}
              value={form.employmentYears}
              onChange={(e) => update("employmentYears", e.target.value)}
              onBlur={() => handleBlur("employmentYears")}
              placeholder="2.5"
            />
            {touched.employmentYears && errors.employmentYears && (
              <div className="error">{errors.employmentYears}</div>
            )}
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
          {loading ? "Stamping\u2026" : "Submit application"}
        </button>
      </form>
    </div>
  );
}
