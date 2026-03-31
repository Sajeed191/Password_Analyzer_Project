export interface HistoryEntry {
  id: string;
  password: string;
  maskedPassword: string;
  score: number;
  strength: string;
  crackTime: string;
  entropy: number;
  timestamp: number;
  type: 'analyzed' | 'generated';
}

const STORAGE_KEY = 'password-analyzer-history';

export function getHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'maskedPassword'>): void {
  const history = getHistory();
  const masked = entry.password.length <= 3
    ? '*'.repeat(entry.password.length)
    : entry.password[0] + '*'.repeat(entry.password.length - 2) + entry.password[entry.password.length - 1];
  
  history.unshift({
    ...entry,
    id: crypto.randomUUID(),
    maskedPassword: masked,
    timestamp: Date.now(),
  });

  // Keep last 100
  if (history.length > 100) history.length = 100;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
