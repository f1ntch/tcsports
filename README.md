# TC Sports

A sports platform built with Vue 3 and Supabase. Users can sign up, sign in, and access a personal dashboard. The app is designed to support sports articles, user interests, saved articles, and AI-classified content—with authentication and core data model in place.

## What’s in the app

- **Home** – Landing page with a “Get Started” (login) or “Dashboard” link depending on auth state.
- **Login** – Sign in or sign up with email and password (Supabase Auth).
- **Dashboard** – Protected area showing the current user’s email, a list of recent sports articles (with infinite scroll), and a sign-out button. Click an article to open its detail page.
- **Article Detail** – Protected page at `/article/:id` showing the full article (title, sport, source, date, media, tags) with a back link to the dashboard.

The database schema supports (for future use):

- **Sports articles** – Title, source, language, sport, media, and tags.
- **AI classification** – Stored classification results that automatically update article sport and tags via a trigger.
- **User interests** – Favorite sports per user (Row Level Security).
- **Saved articles** – Per-user bookmarks (Row Level Security).

## How it works

### Frontend

- **Vue 3** (Composition API, `<script setup>`) with **Vite**.
- **Vuetify 3** for UI; **Vue Router** for routes; **Pinia** for state (auth store).
- **Router guards**:
  - Routes with `meta: { auth: true }` (e.g. `/dashboard`, `/article/:id`) redirect to `/login` if not signed in.
  - Routes with `meta: { guest: true }` (e.g. `/login`) redirect to `/dashboard` if already signed in.

### Auth

- **Supabase Auth** handles sign up, sign in, and sign out.
- `src/stores/auth.js` (Pinia) exposes `user`, `loading`, and methods: `init()`, `signIn()`, `signUp()`, `signOut()`.
- `src/stores/articles.js` (Pinia) exposes `articles`, `loading`, `loadingMore`, `totalCount`, and methods: `fetchArticles()`, `fetchNextPage()`, `fetchArticle(id)`, `hasMore()` for paginated article listing and single-article fetch.
- On load, the router waits for `auth.init()` (which restores session and subscribes to auth changes) before applying guards.
- Supabase client is created in `src/lib/supabase.js` from env vars; the app can run without Supabase (with limited functionality and warnings).

### Backend / data

- **Supabase** provides PostgreSQL and Auth.
- Tables: `sports`, `tag_types`, `articles`, `article_media`, `article_tags`, `classification`, `user_interests`, `user_articles`.
- **Row Level Security (RLS)** is enabled: users can only read/write their own `user_interests` and `user_articles`; articles, media, tags, sports, and tag types are readable by everyone.
- Inserting into `classification` with `article_id` and `json_response` runs a trigger that calls `process_article_classification()` to set the article’s sport and create/update tags.

### Deployment

- **Vercel**: `vercel.json` rewrites all routes to `/` so the Vue SPA handles client-side routing.

## Tech stack

| Layer     | Technology                   |
| --------- | ---------------------------- |
| Framework | Vue 3                        |
| Build     | Vite 5                       |
| UI        | Vuetify 3                    |
| State     | Pinia                        |
| Router    | Vue Router 4                 |
| Backend   | Supabase (Auth + PostgreSQL) |
| Deploy    | Vercel                       |

## Project structure

```
tcsports/
├── src/
│   ├── App.vue              # Root app, router-view
│   ├── main.js              # Vue app, Pinia, router, Vuetify
│   ├── lib/
│   │   └── supabase.js      # Supabase client and isSupabaseConfigured
│   ├── plugins/
│   │   └── vuetify.js       # Vuetify plugin
│   ├── router/
│   │   └── index.js         # Routes and auth guards
│   ├── stores/
│   │   ├── auth.js          # Auth state and methods
│   │   └── articles.js      # Articles list, pagination, single-article fetch
│   └── views/
│       ├── Home.vue         # Landing
│       ├── Login.vue        # Sign in / sign up
│       ├── Dashboard.vue    # Protected dashboard (articles list, infinite scroll)
│       └── ArticleDetail.vue # Article detail page (/article/:id)
├── database/
│   ├── supabase_migration.sql   # Full schema, RLS, classification trigger
│   └── *.sql                    # Optional per-table scripts
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## Setup

### Prerequisites

- Node.js (v18+ recommended)
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone <repo-url>
cd tcsports
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (or set these in your host, e.g. Vercel):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get the URL and anon key from the Supabase dashboard: **Project Settings → API**.

### 3. Database

In the Supabase SQL editor, run the migration so tables, RLS, and the classification trigger exist:

- Run `database/supabase_migration.sql` in order (it’s a single file with the full schema).

### 4. Run locally

```bash
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). You can sign up and sign in; after login you’ll be redirected to the dashboard.

### Build and preview

```bash
npm run build
npm run preview
```

## Scripts

| Command           | Description            |
| ----------------- | ---------------------- |
| `npm run dev`     | Start Vite dev server  |
| `npm run build`   | Production build       |
| `npm run preview` | Serve production build |

---

**Summary:** TC Sports is a Vue 3 + Supabase sports app with email auth, a dashboard that lists sports articles with infinite scroll, article detail pages, and a database ready for user interests, saved articles, and AI classification. Configure Supabase, run the migration, set env vars, and use `npm run dev` to run it locally.
