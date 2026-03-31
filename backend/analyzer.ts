export function analyzePassword(password: string) {
  const length = password.length;

  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;

  const entropy = length * Math.log2(pool || 1);
  const score = Math.min(100, Math.round(entropy));

  let strength = "Weak";
  if (score > 80) strength = "Very Strong";
  else if (score > 60) strength = "Strong";
  else if (score > 40) strength = "Moderate";

  return {
    length,
    entropy: entropy.toFixed(2),
    score,
    strength
  };
}