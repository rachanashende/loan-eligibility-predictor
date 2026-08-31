const TONE_CLASS = {
  APPROVED: "approved",
  CONDITIONAL: "conditional",
  REJECTED: "rejected",
};

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`toast ${TONE_CLASS[toast.tone] || ""}`} role="status">
      {toast.message}
    </div>
  );
}
