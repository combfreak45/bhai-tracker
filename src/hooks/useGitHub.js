import { useState, useEffect } from 'react';
import { GITHUB_USERNAME } from '../config';

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useGitHub() {
  const [committedToday, setCommittedToday] = useState(false);
  const [rawEvents, setRawEvents] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = todayString();

    async function fetchData() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`
        );

        if (res.status === 429 || res.status === 403) {
          const resetAt = res.headers.get('X-RateLimit-Reset');
          const resetTime = resetAt
            ? new Date(Number(resetAt) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null;
          throw new Error(
            resetTime
              ? `GitHub rate limit exceeded — resets at ${resetTime}`
              : 'GitHub rate limit exceeded, try again later'
          );
        }
        if (!res.ok) throw new Error('GitHub API error');

        const events = await res.json();
        if (!Array.isArray(events)) throw new Error('Unexpected response from GitHub API');

        const pushEvents = events.filter((e) => e?.type === 'PushEvent' && e.created_at);

        setCommittedToday(pushEvents.some((e) => e.created_at.startsWith(today)));
        setRawEvents(pushEvents);

        const countsByDate = {};
        for (const e of pushEvents) {
          const date = e.created_at.split('T')[0];
          const commitCount = Array.isArray(e.payload?.commits) ? e.payload.commits.length : 1;
          countsByDate[date] = (countsByDate[date] ?? 0) + commitCount;
        }

        setCalendarData(Object.entries(countsByDate).map(([date, count]) => ({ date, count })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { committedToday, rawEvents, calendarData, loading, error };
}
