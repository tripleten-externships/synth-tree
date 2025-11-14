# Client Frontend

React 19 + Vite 7 + TS + Tailwind. Uses `@skilltree/ui` and `@skilltree/theme`.

## Scripts

- `pnpm dev --filter ./apps/client-frontend` — start dev server (http://localhost:5174)
- `pnpm build --filter ./apps/client-frontend` — build
- `pnpm preview --filter ./apps/client-frontend` — preview production build

## Routing Features

- React Router v7 with protected routes
- 5 main pages: Home, Dashboard, Lessons, Skill Trees, Profile
- 404 Not Found page for invalid routes
- Simple navigation component

## Testing the Routes

1. **Start the app**: `cd apps/client-frontend && pnpm dev`
2. **Test navigation**: Click links in the navigation bar to visit different pages
3. **Test 404 page**: Visit a fake URL like `http://localhost:5174/fake-page`
4. **Test protected routes**:
   - Open `src/components/ProtectedRoute.tsx`
   - Change `const isLoggedIn = true` to `const isLoggedIn = false`
   - Visit any route to see the "Please Log In" message
   - Change back to `true` to restore normal access

## Available Routes

- `/` - Home page
- `/dashboard` - User dashboard (protected)
- `/lessons` - Lessons page (protected)
- `/skill-trees` - Skill trees page (protected)
- `/profile` - User profile page (protected)
- Any other URL - 404 Not Found

## Env

Copy .env.example to .env and adjust VITE_API_URL if needed.
