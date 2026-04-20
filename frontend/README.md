# Restroom Finder Frontend

Modern React web application for finding and managing public restroom locations with interactive map, search, and theme support.

## Tech Stack

- **Vite** - Lightning fast build tool
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running on `http://localhost:3000`

## Installation

```bash
npm install
```

## Development Server

```bash
npm run dev
```

App runs on `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # React components
│   ├── LandingPage.tsx
│   ├── MapComponent.tsx
│   ├── AddRestroomModal.tsx
│   ├── RestroomCard.tsx
│   ├── RestroomDetails.tsx
│   ├── SearchBar.tsx
│   ├── SummaryBadge.tsx
│   └── ThemeToggle.tsx
├── api/               # API utilities
│   └── index.ts
├── store/             # Zustand store
│   └── restroomStore.ts
├── types/             # TypeScript types
│   └── index.ts
├── App.tsx            # Main app
├── main.tsx           # Entry point
└── App.css            # Global styles
```

## Features

- 🗺️ Interactive map with Leaflet
- 🔍 Search by name or address
- ➕ Add new restrooms
- ✏️ Edit your entries
- 🗑️ Delete your entries
- 🌓 Light/Dark mode
- 📍 Dynamic summary badge
- 📱 Responsive design
- ♿ Accessible components

## Environment Variables

Create `.env.local`:

```
VITE_API_URL=http://localhost:3000
```

## Component Guide

### LandingPage
Onboarding screen with "How-to-use" guide

### MapComponent
Interactive Leaflet map with markers

### AddRestroomModal
Form for creating/editing restrooms

### RestroomCard
Compact display of restroom info

### RestroomDetails
Detailed sidebar with full information

### SearchBar
Search input for filtering

### SummaryBadge
Floating badge showing visible count

### ThemeToggle
Light/Dark mode switcher

## API Integration

All API calls go through `src/api/index.ts`:

```typescript
// Get all restrooms
restroomAPI.getAll()

// Get by bounds
restroomAPI.getByBounds(bounds)

// Create
restroomAPI.create(data)

// Update
restroomAPI.update(id, data)

// Delete
restroomAPI.delete(id)
```

## State Management

Zustand store at `src/store/restroomStore.ts`:

```typescript
const {
  restrooms,
  selectedRestroom,
  theme,
  setRestrooms,
  toggleTheme,
} = useRestroomStore()
```

## Styling

- Tailwind CSS utilities
- Dark mode with `dark:` prefix
- Custom Leaflet overrides in App.css
- Responsive breakpoints

## Dark Mode

- Toggle via theme button
- Persisted to localStorage
- Automatic Leaflet theme switching
- Full component support

## Development Tips

1. **Hot Module Reload** - Changes auto-refresh
2. **TypeScript Checking** - Built-in validation
3. **Component Isolation** - Test components independently
4. **API Debugging** - Check browser console
5. **Map Debugging** - Inspect browser DevTools

## Common Issues

### API Connection Failed
- Ensure backend runs on port 3000
- Check VITE_API_URL in .env.local
- Verify CORS is enabled

### Map Not Showing
- Check Leaflet CSS is imported
- Verify map container has height
- Check browser console for errors

### Dark Mode Not Working
- Clear browser cache
- Check localStorage theme value
- Verify Tailwind dark: classes

## Performance

- React Compiler enabled
- Tree-shaking enabled
- Code splitting by route
- Lazy loading for components
- Optimized images

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Linting

```bash
npm run lint
```

## Future Features

- User authentication
- Reviews/ratings
- Photo uploads
- Favorites
- Advanced filters
- Mobile app

// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
