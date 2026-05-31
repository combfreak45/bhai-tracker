import { Tooltip } from 'react-tooltip';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildGrid(values, numDays) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countMap = {};
  for (const v of values) {
    countMap[v.date] = v.count;
  }

  // go back numDays, then rewind to the start of that week (Sunday)
  const start = new Date(today);
  start.setDate(start.getDate() - numDays);
  start.setDate(start.getDate() - start.getDay()); // back to Sunday

  const weeks = [];
  let week = [];
  const cur = new Date(start);

  while (cur <= today) {
    const dateStr = toLocalDateStr(cur);
    const isFuture = cur > today;
    week.push({
      date: dateStr,
      count: countMap[dateStr] ?? 0,
      isFuture,
      month: cur.getMonth(),
      day: cur.getDay(),
    });
    if (cur.getDay() === 6) {
      weeks.push(week);
      week = [];
    }
    cur.setDate(cur.getDate() + 1);
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}

function cellColor(count, isFuture) {
  if (isFuture || count === 0) return '#1e293b';
  if (count <= 1) return '#1d4ed8';
  if (count <= 3) return '#2563eb';
  if (count <= 6) return '#3b82f6';
  return '#60a5fa';
}

function getMonthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstReal = week.find(Boolean);
    if (firstReal && firstReal.month !== lastMonth) {
      labels.push({ index: i, label: MONTHS[firstReal.month] });
      lastMonth = firstReal.month;
    }
  });
  return labels;
}

const CELL = 18;
const GAP = 4;

export default function ActivityHeatmap({ title, values, note, numDays = 365, onDayClick, selectedDate }) {
  const weeks = buildGrid(values, numDays);
  const monthLabels = getMonthLabels(weeks);
  const gridWidth = weeks.length * (CELL + GAP);

  return (
    <div style={{ background: '#111827', borderRadius: '16px', padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
        {note && <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{note}</span>}
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', gap: 0, minWidth: gridWidth + 36 }}>
          {/* day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20, marginRight: 6, gap: GAP }}>
            {DAYS.map((d) => (
              <div key={d} style={{ height: CELL, fontSize: 10, color: '#6b7280', lineHeight: `${CELL}px`, textAlign: 'right', whiteSpace: 'nowrap' }}>
                {d}
              </div>
            ))}
          </div>

          {/* grid + month labels */}
          <div style={{ flex: 1 }}>
            {/* month labels row */}
            <div style={{ display: 'flex', height: 18, position: 'relative', marginBottom: 2 }}>
              {monthLabels.map(({ index, label }) => (
                <div
                  key={`${label}-${index}`}
                  style={{
                    position: 'absolute',
                    left: index * (CELL + GAP),
                    fontSize: 10,
                    color: '#9ca3af',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* week columns */}
            <div style={{ display: 'flex', gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                  {week.map((cell, di) =>
                    cell ? (
                      <div
                        key={cell.date}
                        onClick={() => onDayClick?.(cell.date)}
                        data-tooltip-id="heatmap-tip"
                        data-tooltip-content={`${cell.date}: ${cell.count} submission${cell.count === 1 ? '' : 's'}`}
                        style={{
                          width: CELL,
                          height: CELL,
                          borderRadius: 3,
                          background: cellColor(cell.count, cell.isFuture),
                          cursor: 'pointer',
                          outline: cell.date === selectedDate ? '2px solid #f1f5f9' : 'none',
                          outlineOffset: '1px',
                        }}
                      />
                    ) : (
                      <div key={`empty-${wi}-${di}`} style={{ width: CELL, height: CELL }} />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tooltip id="heatmap-tip" />
    </div>
  );
}
