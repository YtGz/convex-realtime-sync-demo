# Convex Realtime Sync Demo

A demonstration app showcasing Convex's realtime data synchronization capabilities. Open the app in multiple browser windows to see changes sync instantly across all connected clients.

## Features

- **Interactive Counters**: Click to increment/decrement values and watch them sync in realtime
- **Collaborative Notes**: Edit text fields and see changes appear instantly on other devices
- **Visual Feedback**: Smooth animations and gradient styling for an engaging experience

## Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 (with runes)
- **Backend**: Convex (realtime database)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Package Manager**: Bun
- **i18n**: Paraglide (English, German)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Convex account](https://convex.dev/) (free tier available)

### Installation

```bash
# Install dependencies
bun install --ignore-scripts

# Start Convex dev server (Terminal 1)
bunx convex dev

# Start SvelteKit dev server (Terminal 2)
bun run dev --host
```

### Testing Realtime Sync

1. Open http://localhost:5173 in two browser windows
2. Position windows side by side
3. Click counter buttons or edit notes in one window
4. Watch changes appear instantly in the other window!

## Project Structure

```
src/
├── convex/           # Convex backend functions
│   ├── schema.ts     # Database schema
│   ├── counters.ts   # Counter mutations & queries
│   └── notes.ts      # Notes mutations & queries
├── routes/
│   ├── +layout.svelte  # Convex client setup
│   └── +page.svelte    # Main demo UI
└── lib/              # Shared utilities
```

## Available Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `bun run dev`     | Start development server  |
| `bun run build`   | Build for production      |
| `bun run preview` | Preview production build  |
| `bun run check`   | Type-check the project    |
| `bun run lint`    | Run ESLint and Prettier   |
| `bun run format`  | Format code with Prettier |
| `bun run test`    | Run tests                 |

## License

MIT-0 (MIT No Attribution)
