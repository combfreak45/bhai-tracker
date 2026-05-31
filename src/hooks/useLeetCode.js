import { useState, useEffect } from 'react';
import { LEETCODE_USERNAME, LEETCODE_API } from '../config';

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function unixToDateString(ts) {
  const n = Number(ts);
  if (!Number.isFinite(n) || n <= 0) return null;
  const d = new Date(n * 1000);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseCalendar(raw) {
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [];
    return Object.entries(obj)
      .map(([ts, count]) => ({ date: unixToDateString(ts), count: Number(count) }))
      .filter((v) => v.date !== null && Number.isFinite(v.count));
  } catch {
    return [];
  }
}

export function useLeetCode() {
  const [solvedToday, setSolvedToday] = useState(false);
  const [rawSubmissions, setRawSubmissions] = useState([]);
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

        if (subRes.status === 429 || calRes.status === 429)
          throw new Error('LeetCode API rate limit exceeded, try again later');
        if (!subRes.ok || !calRes.ok)
          throw new Error('LeetCode API error');

        const subData = await subRes.json();
        const calData = await calRes.json();

        const submissions = Array.isArray(subData.submission)
          ? subData.submission
          : Array.isArray(subData.recentSubmissionList)
          ? subData.recentSubmissionList
          : [];

        const solved = submissions.some(
          (s) =>
            (s.statusDisplay === 'Accepted' || s.status === 'Accepted') &&
            unixToDateString(s.timestamp) === today
        );
        setSolvedToday(solved);
        setRawSubmissions(submissions);
        setCalendarData(parseCalendar(calData.submissionCalendar));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { solvedToday, rawSubmissions, calendarData, loading, error };
}
