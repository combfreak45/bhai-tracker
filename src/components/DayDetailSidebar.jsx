export default function DayDetailSidebar({ date, submissions, events, onClose }) {
  const leetcodeItems = submissions.filter((s) => {
    const d = new Date(Number(s.timestamp) * 1000);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return str === date;
  });

  const githubItems = events.filter((e) => e.created_at.startsWith(date));

  const totalCommits = githubItems.reduce(
    (sum, e) => sum + (e.payload?.commits?.length ?? 1),
    0
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '340px',
        height: '100vh',
        background: '#1e293b',
        borderLeft: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
        animation: 'slideIn 0.2s ease',
      }}
    >
      {/* header */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '2px' }}>
            Activity on
          </div>
          <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1rem' }}>{date}</div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '1.4rem',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '4px 8px',
            borderRadius: '6px',
          }}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </div>

      {/* content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {/* LeetCode section */}
        <Section
          icon="🟡"
          title="LeetCode"
          count={leetcodeItems.length}
          noun="submission"
        >
          {leetcodeItems.length === 0 ? (
            <Empty text="No submissions on this day" />
          ) : (
            leetcodeItems.map((s, i) => (
              <div key={i} style={itemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <StatusBadge status={s.statusDisplay ?? s.status} />
                  <span style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 500 }}>
                    {s.title ?? s.titleSlug ?? 'Problem'}
                  </span>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                  {s.lang} · {new Date(Number(s.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </Section>

        {/* GitHub section */}
        <div style={{ marginTop: '32px' }}>
        <Section
          icon="⚪"
          title="GitHub"
          count={totalCommits}
          noun="commit"
        >
          {githubItems.length === 0 ? (
            <Empty text="No pushes on this day" />
          ) : (
            githubItems.map((e, i) => (
              <div key={i} style={itemStyle}>
                <div style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 500, marginBottom: '4px' }}>
                  {e.repo?.name ?? 'unknown repo'}
                </div>
                {(e.payload?.commits ?? []).map((c, j) => (
                  <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.7rem', flexShrink: 0 }}>
                      {c.sha?.slice(0, 7)}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                      {c.message?.split('\n')[0]}
                    </span>
                  </div>
                ))}
                <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: '4px' }}>
                  {new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, count, noun, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span>{icon}</span>
        <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.875rem' }}>{title}</span>
        <span style={{ color: '#475569', fontSize: '0.75rem', marginLeft: 'auto' }}>
          {count} {noun}{count !== 1 ? 's' : ''}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const accepted = status === 'Accepted';
  return (
    <span
      style={{
        fontSize: '0.65rem',
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: '4px',
        background: accepted ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.15)',
        color: accepted ? '#22c55e' : '#f87171',
        flexShrink: 0,
      }}
    >
      {status}
    </span>
  );
}

function Empty({ text }) {
  return (
    <div style={{
      background: '#0f172a',
      borderRadius: '8px',
      padding: '10px 12px',
      border: '1px solid #1e293b',
      color: '#475569',
      fontSize: '0.8rem',
    }}>
      {text}
    </div>
  );
}

const itemStyle = {
  background: '#0f172a',
  borderRadius: '8px',
  padding: '10px 12px',
  border: '1px solid #1e293b',
};
