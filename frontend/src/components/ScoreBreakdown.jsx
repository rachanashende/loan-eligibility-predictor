export default function ScoreBreakdown({ breakdown }) {
  return (
    <div className="ledger-table">
      {breakdown.map((factor) => (
        <div className="ledger-row" key={factor.key}>
          <span className="label">{factor.label}</span>
          <span className="points">
            {factor.score} / {factor.maxScore}
          </span>
          <span className="note">{factor.note}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
