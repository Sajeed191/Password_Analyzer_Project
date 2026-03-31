import type { VercelRequest, VercelResponse } from '@vercel/node'

function calculateEntropy(password: string): number {
  let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/[0-9]/.test(password)) pool += 10
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32

  return Math.round(password.length * Math.log2(pool || 1))
}

function getStrength(entropy: number): string {
  if (entropy < 28) return 'Very Weak'
  if (entropy < 36) return 'Weak'
  if (entropy < 60) return 'Moderate'
  if (entropy < 80) return 'Strong'
  return 'Very Strong'
}

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Password required' })
  }

  const entropy = calculateEntropy(password)
  const strength = getStrength(entropy)

  return res.status(200).json({
    entropy,
    strength
  })
}