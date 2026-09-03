import { useRef, useState } from "react";
import ScoreBreakdown from "./ScoreBreakdown.jsx";
import Certificate from "./Certificate.jsx";

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

export default function ResultStamp({ result, loading, onReset }) {
  const certificateRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  async function handleDownload() {
    if (!certificateRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#faf6ec",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If the certificate is taller than one page, scale it down to fit
      // rather than cropping it off.
      const finalHeight = Math.min(imgHeight, pageHeight);
      const finalWidth = imgHeight > pageHeight ? (canvas.width * finalHeight) / canvas.height : imgWidth;

      pdf.addImage(imgData, "PNG", (pageWidth - finalWidth) / 2, 0, finalWidth, finalHeight);

      const safeName = result.fullName.trim().replace(/\s+/g, "-").toLowerCase();
      pdf.save(`${safeName || "applicant"}-loan-certificate.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      window.alert("Couldn't generate the PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="result-empty stamping">
        <span className="glyph pulse">§</span>
        <p>Stamping application&hellip;</p>
      </div>
    );
  }

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
        <span className={`stamp ${meta.className}`} key={result.decision + result.totalScore + result.id}>
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

      <div className="result-actions">
        <button type="button" className="download-btn" onClick={handleDownload} disabled={exporting}>
          {exporting ? "Preparing PDF\u2026" : "Download certificate (PDF)"}
        </button>
        {onReset && (
          <button type="button" className="reset-btn" onClick={onReset}>
            Evaluate another application
          </button>
        )}
      </div>

      {/* Off-screen certificate used only as a source for the PDF export */}
      <div className="certificate-offscreen" aria-hidden="true">
        <Certificate result={result} ref={certificateRef} />
      </div>
    </>
  );
}
