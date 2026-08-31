const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export async function getHistory() {
  const res = await fetch(`${API_BASE}/history`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Could not load history.");
  }

  return data;
}

export async function checkEligibility(payload) {
  const res = await fetch(`${API_BASE}/check-eligibility`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data?.details?.join(", ") || data?.message || "Request failed.";
    throw new Error(message);
  }

  return data;
}
