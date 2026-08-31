import ScoreBreakdown from "./ScoreBreakdown.jsx";

const DECISION_META = {
  APPROVED: {
    className: "approved",
    label: "Approved",
    note: "This applicant clears the threshold on every major factor. In a production system this would route to underwriting for final documentation.",
  },
  CONDITIONAL: {
    className: "conditional",
    label: "Conditional",
    note: "Borderline profile \u2014 typically approved with adjustments: a co-signer, a smaller principal, or a higher interest rate to offset risk.",
  },
  REJECTED: {
    className: "rejected",
    label: "Rejected",
    note: "One or more factors fall too far below threshold, most often credit score or debt load. Reapplication is usually possible once those improve.",
  },
};

export default function ResultStamp({ result }) {
  if (!result) {
    return (
      <div className="result-empty">
        <span className="glyph">§</span>
        <p>Submit the application form to generate a decision and a full factor-by-factor breakdown.</p>
      </div>
    );
  }

  const meta = DECISION_META[result.decision];

  return (
    <>
      <div className="stamp-wrap">
        <span className={`stamp ${meta.className}`} key={result.decision + result.totalScore}>
          {meta.label}
        </span>
      </div>
      <p className="applicant-line">
        {result.fullName} &mdash; application #{result.id ?? "\u2014"}
      </p>

      <div className="score-summary">
        <span className="score">{result.totalScore}</span>
        <span className="of">/ 100</span>
      </div>

      <ScoreBreakdown breakdown={result.breakdown} />

      <p className="decision-note">{meta.note}</p>
    </>
  );
}
