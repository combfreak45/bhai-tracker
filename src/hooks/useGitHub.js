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

        if (res.status === 403) throw new Error('GitHub rate limit exceeded');
        if (!res.ok) throw new Error('GitHub API error');

        const events = await res.json();
        const pushEvents = events.filter((e) => e.type === 'PushEvent');

        setCommittedToday(pushEvents.some((e) => e.created_at.startsWith(today)));
        setRawEvents(pushEvents);

        const countsByDate = {};
        for (const e of pushEvents) {
          const date = e.created_at.split('T')[0];
          countsByDate[date] = (countsByDate[date] ?? 0) + (e.payload?.commits?.length ?? 1);
        }

        const values = Object.entries(countsByDate).map(([date, count]) => ({ date, count }));
        setCalendarData(values);
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
