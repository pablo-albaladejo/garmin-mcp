export interface QueryResult {
  date?: string;
  intent: 'steps' | 'activities' | 'unknown';
}

/**
 * Very naive NLP parser to extract simple queries about Garmin data.
 * This mimics using an LLM agent but works offline.
 */
export function parseQuery(query: string): QueryResult {
  const lower = query.toLowerCase();
  const result: QueryResult = { intent: 'unknown' };

  if (lower.includes('step')) {
    result.intent = 'steps';
  } else if (lower.includes('activit')) {
    result.intent = 'activities';
  }

  // Recognize "today" or "yesterday" or explicit YYYY-MM-DD
  const today = new Date();
  if (lower.includes('today')) {
    result.date = today.toISOString().substring(0, 10);
  } else if (lower.includes('yesterday')) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    result.date = yesterday.toISOString().substring(0, 10);
  } else {
    const match = lower.match(/(\d{4}-\d{2}-\d{2})/);
    if (match) {
      result.date = match[1];
    }
  }

  return result;
}
