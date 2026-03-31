const API_BASE = "http://localhost:5000";

export interface AnalyzeResponse {
  length: number;
  entropy: number;
  score: number;
  strength: string;
}

export async function analyzePassword(password: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  if (!response.ok) {
    throw new Error("Failed to analyze password");
  }

  return response.json();
}