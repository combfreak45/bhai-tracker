import { useLeetCode } from './hooks/useLeetCode';
import { useGitHub } from './hooks/useGitHub';
import StatusCard from './components/StatusCard';
import ActivityHeatmap from './components/ActivityHeatmap';
import { LEETCODE_USERNAME, GITHUB_USERNAME } from './config';

export default function App() {
  const leetcode = useLeetCode();
  const github = useGitHub();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: '#f1f5f9',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Bhai Tracker 👀
          </h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Is Samarth grinding today?
          </p>
        </header>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <StatusCard
            platform="leetcode"
            username={LEETCODE_USERNAME}
            done={leetcode.solvedToday}
            loading={leetcode.loading}
            error={leetcode.error}
          />
          <StatusCard
            platform="github"
            username={GITHUB_USERNAME}
            done={github.committedToday}
            loading={github.loading}
            error={github.error}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ActivityHeatmap
            title="LeetCode Submissions — Last 365 Days"
            values={leetcode.calendarData}
          />
          <ActivityHeatmap
            title="GitHub Commits — Last 30 Days"
            values={github.calendarData}
            note="(GitHub public API limited to ~30 days)"
          />
        </div>
      </div>
    </div>
  );
}
