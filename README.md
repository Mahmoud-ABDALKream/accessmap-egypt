<div align="center">

<!-- Logo / Icon -->
<img src="https://raw.githubusercontent.com/Mahmoud-ABDALKream/accessmap-egypt/main/public/favicon.svg" alt="AccessMap Egypt Logo" width="100" height="100" />

# ♿ AccessMap Egypt

**A crowdsourced accessibility map for Egyptian cities**

Discover, rate, and review the physical accessibility of public places for people with disabilities — in Arabic and English.

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-accessmap--egypt.vercel.app-teal?style=for-the-badge)](https://accessmap-egypt.vercel.app)
[![CI](https://github.com/Mahmoud-ABDALKream/accessmap-egypt/actions/workflows/ci.yml/badge.svg)](https://github.com/Mahmoud-ABDALKream/accessmap-egypt/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)


</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Available Scripts](#-available-scripts)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [CI/CD](#-cicd)
- [Contributing](#-contributing)

---

## 🗺️ About the Project

**AccessMap Egypt** is an open-source, community-driven web application that helps people with disabilities find and evaluate the physical accessibility of public places across Egyptian cities including **Cairo**, **Alexandria**, and **Giza**.

Users can:
- Browse an interactive map with **46+ seeded locations**
- Rate places on 5 accessibility dimensions
- Leave reviews and suggest edits
- Switch seamlessly between **Arabic 🇪🇬** and **English 🌍** (full RTL support)

The project was built as a social-good initiative to improve urban accessibility awareness in Egypt.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Map** | Leaflet-powered map with color-coded pin markers (🟢 good / 🟡 moderate / 🔴 poor) |
| 🔍 **Search & Filter** | Debounced search, city filter, and category filter |
| 📊 **Accessibility Scores** | 5-dimensional ratings: Wheelchair Ramp, Elevator, Restroom, Parking, Entrance |
| 📝 **Submit Places** | Community submissions with photo upload and score sliders |
| 💬 **Reviews** | Users can leave reviews on any listed place |
| ✏️ **Edit Suggestions** | Suggest corrections for existing place information |
| 📈 **Stats Dashboard** | Aggregated accessibility statistics per city and category |
| 🔐 **Admin Panel** | Password-protected admin view to approve/reject pending submissions |
| 🌐 **Bilingual** | Full Arabic/English toggle with RTL layout support |
| 📱 **Responsive** | Mobile-first design with bottom navigation and glassmorphism UI |
| ♿ **PWA Ready** | Manifest.json, SEO metadata, Open Graph, and Twitter Card support |

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) — App Router, React 19
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) + [Leaflet MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster)
- [Zustand](https://zustand-demo.pmnd.rs/) — state management
- [Framer Motion](https://www.framer.com/motion/) — animations
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — form validation
- [TanStack Query](https://tanstack.com/query) — data fetching
- [next-intl](https://next-intl-docs.vercel.app/) — i18n / translations

**Backend**
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma ORM](https://www.prisma.io/) with SQLite
- [Multer](https://github.com/expressjs/multer) — file uploads
- [NextAuth.js](https://next-auth.js.org/) — authentication

**Testing & CI**
- [Vitest](https://vitest.dev/) — unit tests with jsdom
- [Playwright](https://playwright.dev/) — end-to-end browser tests
- [MSW](https://mswjs.io/) — API mocking for unit tests
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipeline

**Tooling**
- [Bun](https://bun.sh/) — package manager & runtime
- [Caddy](https://caddyserver.com/) — reverse proxy (`Caddyfile`)
- [ESLint](https://eslint.org/)

---

## 📁 Project Structure

```
accessmap-egypt/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── places/             # CRUD for places
│   │   │   │   └── [id]/
│   │   │   │       ├── reviews/    # Review submission
│   │   │   │       └── edit-suggest/
│   │   │   ├── admin/              # Admin management
│   │   │   ├── stats/              # Aggregated statistics
│   │   │   └── upload/             # File upload handler
│   │   ├── layout.tsx              # Root layout + SEO metadata
│   │   ├── page.tsx                # Main SPA entry point
│   │   └── globals.css             # Global styles + animations
│   ├── components/
│   │   └── accessibility-map/
│   │       ├── MapView.tsx         # Leaflet map with clustering
│   │       ├── PlaceSidebar.tsx    # Place detail panel
│   │       ├── PlacesListPanel.tsx # Left sidebar place list
│   │       ├── SearchFilterBar.tsx # Search + filter controls
│   │       ├── SubmitForm.tsx      # New place submission
│   │       ├── StatsDashboard.tsx  # Stats & charts
│   │       ├── AboutSection.tsx    # About / mission page
│   │       └── AdminSection.tsx    # Admin panel
│   ├── lib/
│   │   ├── i18n.ts                 # English / Arabic translations
│   │   └── store.ts                # Zustand global state
│   └── types/
│       └── leaflet.markercluster.d.ts
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # 46 seeded locations
├── public/                         # Static assets, favicon, OG image
├── db/                             # SQLite database file
├── upload/                         # Uploaded place photos
├── .env                            # Environment variables
├── Caddyfile                       # Caddy reverse proxy config
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `>= 1.0` (recommended) — or Node.js `>= 18`
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Mahmoud-ABDALKream/accessmap-egypt.git
cd accessmap-egypt

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and update DATABASE_URL if needed

# 4. Set up the database
bun run db:push
bun run prisma/seed.ts   # Seeds 46 locations across Cairo, Alexandria & Giza

# 5. Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# SQLite database path (relative or absolute)
DATABASE_URL=file:./db/custom.db

# NextAuth secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# Admin panel password
ADMIN_PASSWORD=accessmap2024
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

---

## 🗄️ Database Setup

The project uses **Prisma ORM** with **SQLite** for zero-configuration local development.

```bash
# Push schema to database (creates tables)
bun run db:push

# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate

# Seed database with 46 sample locations
bun run prisma/seed.ts

# Reset database (wipes all data)
bun run db:reset
```

The seed script populates the database with **46 real locations** across:
- 🏙️ **Cairo** — 20 places (hospitals, malls, museums, government buildings, transport hubs)
- 🌊 **Alexandria** — 18 places (mosques, beaches, shopping centers, train station)
- 🏛️ **Giza** — 8 places (university, zoo, malls, landmarks)

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start development server on port 3000 |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run test` | Run unit tests (Vitest) |
| `bun run test:watch` | Run unit tests in watch mode |
| `bun run test:coverage` | Run unit tests with coverage report |
| `bun run test:e2e` | Run end-to-end tests (Playwright) |
| `bun run type-check` | Run TypeScript type checking |
| `bun run db:push` | Sync Prisma schema to database |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run database migrations |
| `bun run db:reset` | Reset and re-migrate the database |

---

## 🔌 API Reference

All API routes live under `/api/`.

### Places

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/places` | List all places (supports `?search=`, `?city=`, `?category=`) |
| `POST` | `/api/places` | Submit a new place |
| `GET` | `/api/places/:id` | Get a single place by ID |
| `PUT` | `/api/places/:id` | Update a place |
| `DELETE` | `/api/places/:id` | Delete a place |

### Reviews & Suggestions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/places/:id/reviews` | Submit a review for a place |
| `POST` | `/api/places/:id/edit-suggest` | Submit an edit suggestion |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin` | List pending submissions (password-protected) |
| `PUT` | `/api/admin` | Approve a submission |
| `DELETE` | `/api/admin` | Reject a submission |

### Other

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Aggregated accessibility statistics |
| `POST` | `/api/upload` | Upload a place photo |

---

## 🗺️ Accessibility Score Dimensions

Each place is rated 1–5 on five dimensions:

| Dimension | Emoji | Description |
|---|---|---|
| Wheelchair Ramp | 🦽 | Ramp availability and quality |
| Elevator | 🛗 | Lift or stair-free access |
| Accessible Restroom | 🚻 | Disability-friendly bathroom |
| Parking | 🅿️ | Dedicated accessible parking spaces |
| Entrance | 🚪 | Wide, step-free entry points |

Map markers are color-coded by **overall score**:
- 🟢 **Green** — Score ≥ 3.5 (Good Accessibility)
- 🟡 **Yellow** — Score 2–3.5 (Moderate Accessibility)
- 🔴 **Red** — Score < 2 (Poor Accessibility)

---

## 🧪 Testing

### Unit Tests (Vitest)

Unit tests use [Vitest](https://vitest.dev/) with [jsdom](https://github.com/jsdom/jsdom) environment and [MSW](https://mswjs.io/) for API mocking.

```bash
# Run all unit tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run with coverage report
bun run test:coverage

# Run a specific test file
bunx vitest run src/__tests__/api/places.test.ts
```

Test files are located in `src/__tests__/`:
- `api/places.test.ts` — GET/POST /api/places, GET /api/places/:id, POST reviews
- `api/stats.test.ts` — GET /api/stats
- `components/PlaceSidebar.test.tsx` — Place detail panel rendering
- `store/useSearchFilter.test.ts` — Zustand store search/filter logic

### End-to-End Tests (Playwright)

E2E tests run a real browser against the dev server.

```bash
# Install Playwright browsers (first time only)
bunx playwright install --with-deps chromium

# Run E2E tests
bun run test:e2e

# Run with interactive UI
bun run test:e2e:ui

# Run a specific test file
bunx playwright test e2e/homepage.spec.ts
```

E2E test files are in `e2e/`:
- `homepage.spec.ts` — Page load, map, navigation
- `search.spec.ts` — Search and filter functionality
- `language.spec.ts` — Arabic/English toggle, RTL
- `admin.spec.ts` — Admin login, auth protection
- `submit.spec.ts` — Submit form validation

### Test Environment

A separate `.env.test` file configures the test environment:
- Uses `file:./db/test.db` as test database
- Sets `AUTH_SECRET` for NextAuth
- Sets `NODE_ENV=test`

---

## 🔄 CI/CD

GitHub Actions runs on every push and PR to `main`:

[![CI](https://github.com/Mahmoud-ABDALKream/accessmap-egypt/actions/workflows/ci.yml/badge.svg)](https://github.com/Mahmoud-ABDALKream/accessmap-egypt/actions/workflows/ci.yml)

**Pipeline Jobs:**

| Job | Description |
|---|---|
| **Lint** | ESLint code quality check |
| **Type Check** | `tsc --noEmit` TypeScript validation |
| **Build** | `next build` production build |
| **Unit Tests** | Vitest with jsdom |
| **E2E Tests** | Playwright browser tests (Chromium) |

All jobs use **Bun** for dependency installation and caching.

---

## 🤝 Contributing

Contributions are very welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feat/your-feature`
5. **Open a Pull Request**

You can also contribute by:
- Adding more locations to `prisma/seed.ts`
- Improving Arabic translations in `src/lib/i18n.ts`
- Reporting accessibility issues in the [Issues tab](https://github.com/Mahmoud-ABDALKream/accessmap-egypt/issues)

---


<div align="center">

Built with ❤️ for accessibility in Egypt 🇪🇬

**[Mahmoud ABDALKream](https://github.com/Mahmoud-ABDALKream)**

[![GitHub](https://img.shields.io/badge/GitHub-Mahmoud--ABDALKream-181717?style=flat-square&logo=github)](https://github.com/Mahmoud-ABDALKream/accessmap-egypt)
[![Live](https://img.shields.io/badge/Live-accessmap--egypt.vercel.app-00C7B7?style=flat-square&logo=vercel)](https://accessmap-egypt.vercel.app)

</div>
