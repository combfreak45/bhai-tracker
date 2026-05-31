# Bhai Tracker 👀

A personal dashboard to track whether my brother **Samarth** is grinding daily — did he solve a LeetCode problem today, and did he push any code to GitHub?

## Features

- **Today's status** — instant yes/no cards for LeetCode and GitHub activity
- **Activity heatmaps** — full year of LeetCode submissions, last 30 days of GitHub commits
- **Timezone-aware** — all dates computed in local time (no UTC offset bugs)
- **Pure frontend** — no backend needed, runs entirely in the browser

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [react-tooltip](https://react-tooltip.com/) for heatmap hover tooltips
- LeetCode data via [alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api) (public proxy)
- GitHub data via the [GitHub public REST API](https://docs.github.com/en/rest/activity/events)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── config.js                  # Usernames and API base URLs
├── hooks/
│   ├── useLeetCode.js         # Fetches LeetCode submissions + calendar
│   └── useGitHub.js           # Fetches GitHub push events
└── components/
    ├── StatusCard.jsx          # "Did he do it today?" card
    ├── ActivityHeatmap.jsx     # Custom heatmap grid with day/month labels
    └── LoadingSpinner.jsx
```

## Configuration

To track a different person, update `src/config.js`:

```js
export const LEETCODE_USERNAME = 'your_username';
export const GITHUB_USERNAME = 'your_username';
```

## Limitations

- GitHub heatmap only covers the last ~30 days — the public events API doesn't return older data
- LeetCode proxy (`alfa-leetcode-api`) is hosted on Render's free tier and may take ~30s to wake up on first load
