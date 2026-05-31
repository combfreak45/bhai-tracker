import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

export default function ActivityHeatmap({ title, values, note }) {
  const today = new Date();
  const startDate = shiftDate(today, -365);

  return (
    <div
      style={{
        background: '#111827',
        borderRadius: '16px',
        padding: '24px 28px',
        marginTop: '0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: '1rem', fontWeight: 600 }}>
          {title}
        </h3>
        {note && <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{note}</span>}
      </div>

      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty';
          if (value.count <= 1) return 'color-scale-1';
          if (value.count <= 3) return 'color-scale-2';
          if (value.count <= 6) return 'color-scale-3';
          return 'color-scale-4';
        }}
        tooltipDataAttrs={(value) => ({
          'data-tooltip-id': 'heatmap-tip',
          'data-tooltip-content': value?.date
            ? `${value.date}: ${value.count ?? 0} submission${value.count === 1 ? '' : 's'}`
            : 'No activity',
        })}
        showWeekdayLabels
      />
      <Tooltip id="heatmap-tip" />
    </div>
  );
}
