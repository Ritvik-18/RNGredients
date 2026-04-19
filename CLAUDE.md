
## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, save state, save my work → invoke context-save
- Resume, where was I, pick up where I left off → invoke context-restore
- Code quality, health check → invoke health

---

## Project: RNGredients — Gamified Meal Prep App

### Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18 + Vite | Tailwind CSS, Framer Motion (gacha animation), Zustand (state) |
| Backend | FastAPI (Python 3.11+) | Loot table RNG, Spoonacular caching, inventory CRUD |
| Database | Supabase (PostgreSQL) | Hosted Postgres + built-in REST/auth if needed later |
| Deployment | Vercel (frontend) + Supabase (DB) | FastAPI also deployed on Vercel as serverless Python functions |
| API | Spoonacular | Recipe data (seeded/cached, 0 live calls during demo) |

### Deployment: Vercel + Supabase

**Supabase Setup:**
1. Create a Supabase project at https://supabase.com/dashboard
2. Note your project credentials:
   - `SUPABASE_URL` — Project URL (e.g., `https://<project-ref>.supabase.co`)
   - `SUPABASE_ANON_KEY` — Public anon key (safe for client-side)
   - `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only, never expose to client)
   - `DATABASE_URL` — Direct Postgres connection string (Settings → Database → Connection string → URI)
3. Database schema migration: run SQL migrations against Supabase via the SQL Editor or `supabase db push`
4. Use `supabase-py` (Python) in FastAPI for DB access, or connect via `asyncpg`/`sqlmodel` using `DATABASE_URL`
5. Use `@supabase/supabase-js` on the frontend only if using Supabase Auth or Realtime (optional for MVP)

**Vercel Setup:**
1. Frontend: standard Vite React deploy — `vercel.json` with `{ "framework": "vite" }`
2. Backend: FastAPI deployed as Vercel Serverless Functions under `/api/` directory
   - Each endpoint is a Python file in `api/` exporting a handler
   - Or use a single `api/index.py` with `mangum` adapter wrapping the FastAPI app
3. Environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (backend only)
   - `SPOONACULAR_API_KEY` (backend only)
4. Frontend env vars (prefixed `VITE_`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL` (points to `/api` in production)

**Linking Database:**
- FastAPI connects to Supabase Postgres via `DATABASE_URL` environment variable
- Use SQLModel/SQLAlchemy for ORM with the direct connection string
- For serverless (Vercel), use Supabase's connection pooler URL (port 6543) instead of direct connection (port 5432) to avoid connection exhaustion
- Schema tables: `player`, `inventory_item`, `recipe`, `roll` (see `docs/DESIGN.md` for full schemas)

---

## Execution Phases

### Phase 1: Functional Mockup (Frontend Only)
**Goal:** Pixel-perfect UI with mock data. No backend, no database. Everything runs locally with hardcoded/mock JSON.

Build order:
1. **Scaffold** — `npm create vite@latest` with React + TypeScript, install Tailwind, Framer Motion, Zustand
2. **Theme system** — Implement retro pixel theme from `docs/themes.md` and `Refrences/` design specs. CSS variables for palette swapping.
3. **Onboarding screens** — Character creation flow (username, dietary prefs, allergens, meals/day). Store in Zustand, persist to localStorage.
4. **Inventory screen** — Add/remove items with decay HP bars. Mock data: 5-8 grocery items with various expiry dates. Form: item name + expiry date.
5. **Tavern screen (centerpiece)** — Roll button, gacha slot-machine animation (Framer Motion), dish cards with rarity flash. Use mock recipe data (8-10 hardcoded recipes).
6. **Quest Log screen** — Crafting queue (flat ordered list) + meal cards with calorie/protein/carb/fat stat chips.
7. **Re-roll mechanic** — Counter (3/day), button state, animation replay.
8. **Navigation** — Tab bar or sidebar: Inventory → Tavern → Quest Log → Settings.

Mock data files:
- `src/mocks/recipes.json` — 10+ recipes with nutrition, rarity, ingredients
- `src/mocks/inventory.json` — 5-8 items with expiry dates
- `src/mocks/player.json` — default player profile

**Deliverable:** A fully clickable frontend app running on `localhost:5173`. All screens navigate, animations play, mock data populates every view. No API calls.

### Phase 2: Backend + Database
**Goal:** FastAPI backend connected to Supabase. Real CRUD, real loot table logic.

Build order:
1. **Supabase project** — Create project, run schema SQL (Player, InventoryItem, Recipe, Roll tables)
2. **FastAPI scaffold** — Project structure under `api/` or `backend/`
3. **Seed script** — Fetch recipes from Spoonacular, cache to Supabase `recipe` table (run once)
4. **Endpoints** — `POST /api/player`, `GET/POST/DELETE /api/inventory`, `POST /api/roll`, `GET /api/player/:id/rerolls`
5. **Loot table** — Port scoring logic from `docs/DESIGN.md` pseudocode to real Python
6. **Ingredient normalization** — Synonym dict + `normalize()` function

**Deliverable:** All API endpoints working, testable via curl/Postman. Recipes seeded. Loot table returns scored results.

### Phase 3: Integration
**Goal:** Connect React frontend to live FastAPI + Supabase backend.

Build order:
1. **API client** — Replace mock data imports with `fetch()` calls to `/api/*`
2. **Zustand stores** — Wire up to real API (inventory store, player store, roll store)
3. **Character creation** — `POST /api/player` on submit, store `player_id` in localStorage
4. **Inventory** — Real CRUD against `/api/inventory`
5. **Roll** — `POST /api/roll` triggers backend loot table, animate result
6. **Error states** — Handle API failures, empty pools, reroll exhaustion

**Deliverable:** End-to-end working app. Add items → roll → see recipes that use your ingredients → quest log shows the plan.

### Phase 4: Polish + Deploy
**Goal:** Demo-ready, deployed to Vercel + Supabase.

Build order:
1. **Vercel deploy** — Configure `vercel.json`, set env vars, deploy frontend
2. **Serverless backend** — Deploy FastAPI via Vercel serverless (mangum adapter) or separate service
3. **Supabase connection pooler** — Switch to pooler URL for serverless compatibility
4. **Demo rehearsal** — Run through the 2-min demo path: create character → add 5 items → roll → show quest log
5. **Bug fixes** — Fix anything that breaks in production
6. **README** — Setup instructions for judges/reviewers

**Deliverable:** Live URL that judges can visit. Complete demo flow works end to end.

---

## Key Design Docs

| Document | Purpose |
|---|---|
| `docs/DESIGN.md` | Master implementation spec — schemas, API, loot table, animation timing |
| `docs/architecture.md` | Core architecture, game loop, data models, algorithm |
| `docs/features.md` | Feature tree, all screens, wireframes, priorities (P0-P2) |
| `docs/themes.md` | 15 retro color palettes with CSS variables |
| `docs/calorie_calc.md` | BMR/TDEE formulas, fitness targets, meal calorie splits |
| `docs/user_preferences.md` | Dietary profiles, allergens, meal structures |
| `docs/ingredients.md` | Ingredient taxonomy, pantry staples, normalization, substitutions |
| `docs/appliances.md` | Kitchen equipment, cooking methods, substitution logic |
| `docs/data.md` | Consolidated data reference |
| `Refrences/` | Pixel art, animation, color palette, sound design specs |

---

## Build Commands

```bash
# Frontend
cd frontend && npm install && npm run dev     # dev server on :5173
cd frontend && npm run build                  # production build

# Backend (local)
cd backend && pip install -r requirements.txt
cd backend && uvicorn main:app --reload       # dev server on :8000

# Seed recipes (run once)
cd backend && python seed_recipes.py

# Database migrations
supabase db push                              # or run SQL in Supabase dashboard
```
