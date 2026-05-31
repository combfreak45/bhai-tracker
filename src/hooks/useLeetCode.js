import { useState, useEffect } from 'react';
import { LEETCODE_USERNAME, LEETCODE_API } from '../config';

function todayString() {
  return new Date().toISOString().split('T')[0];
}

function unixToDateString(ts) {
  return new Date(Number(ts) * 1000).toISOString().split('T')[0];
}

export function useLeetCode() {
  const [solvedToday, setSolvedToday] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = todayString();

    async function fetchData() {
      try {
        const [subRes, calRes] = await Promise.all([
          fetch(`${LEETCODE_API}/${LEETCODE_USERNAME}/submission?limit=20`),
          fetch(`${LEETCODE_API}/${LEETCODE_USERNAME}/calendar`),
        ]);

        if (!subRes.ok || !calRes.ok) throw new Error('LeetCode API error');

        const subData = await subRes.json();
        const calData = await calRes.json();

        const submissions = subData.submission ?? subData.recentSubmissionList ?? [];
        const solved = submissions.some(
          (s) =>
            (s.statusDisplay === 'Accepted' || s.status === 'Accepted') &&
            unixToDateString(s.timestamp) === today
        );
        setSolvedToday(solved);

        const rawCalendar =
          typeof calData.submissionCalendar === 'string'
            ? JSON.parse(calData.submissionCalendar)
            : calData.submissionCalendar ?? {};

        const values = Object.entries(rawCalendar).map(([ts, count]) => ({
          date: unixToDateString(ts),
          count,
        }));
        setCalendarData(values);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { solvedToday, calendarData, loading, error };
}
