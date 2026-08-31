const DECISION_CLASS = {
  APPROVED: "approved",
  CONDITIONAL: "conditional",
  REJECTED: "rejected",
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function HistoryPanel({ history }) {
  return (
    <div className="paper history-panel">
      <h2>Register of Applications</h2>
      <p className="sub">
        {history.length === 0
          ? "No applications yet this session."
          : `${history.length} submission${history.length === 1 ? "" : "s"} this session, most recent first.`}
      </p>

      {history.length === 0 ? (
        <div className="result-empty">
          <span className="glyph">§</span>
          <p>Submit an application from the New Application tab to see it listed here.</p>
        </div>
      ) : (
        <div className="history-table">
          <div className="history-head">
            <span>Applicant</span>
            <span>Requested</span>
            <span>Score</span>
            <span>Decision</span>
            <span>Filed</span>
          </div>
          {history.map((row) => (
            <div className="history-row" key={row.id}>
              <span className="hist-name">{row.fullName}</span>
              <span className="hist-mono">{currency.format(row.requestedLoanAmount)}</span>
              <span className="hist-mono">{row.totalScore}/100</span>
              <span className={`decision-pill ${DECISION_CLASS[row.decision]}`}>{row.decision}</span>
              <span className="hist-mono hist-date">{dateFmt.format(row.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
