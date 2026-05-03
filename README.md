# SkillMatch - Skill Recommendation System

> Full-stack Node.js, Express, EJS, MySQL  
> FSBD Jury Project - Harsh | Roll No: __________ | Date: 2026-05-02

---

## Problem Statement

Modern learners struggle to identify which skills to learn next given their current knowledge, target career role, and the overwhelming number of available resources. SkillMatch solves this by profiling a user's existing skills, accepting a target role, and generating a personalised ranked learning plan instead of a generic course catalogue.

User Roles:

- Learner - registers, profiles skills, views personalised recommendations.
- Admin - manages the skills catalogue by adding, editing, and deleting skills.

Functional Requirements:

1. User registration and login with hashed passwords and session management.
2. Profile page to select known skills and proficiency level per skill.
3. Recommendation engine that ranks unlearned skills by category overlap, difficulty progression, and role alignment.
4. Skills catalogue with search, category filter, and difficulty filter.
5. Admin CRUD operations on skills via the same EJS UI.
6. RESTful JSON API under `/api/*` exposing skills, categories, recommendations, current user, and health check.

Non-Functional Requirements:

- Secure: bcrypt password hashing, session regeneration on login, HTTP-only cookies, helmet headers, rate limiting.
- Responsive: mobile-first CSS with hamburger nav at the 640px breakpoint.
- Performant: gzip compression, static asset caching, MySQL connection pooling.
- Maintainable: route, controller, model, middleware, utility, and view responsibilities are separated.
- Reliable: centralized 404/error handling and `/api/health` database connectivity check.

---

## System Architecture

### Client-Server Interaction

```text
Browser (EJS rendered HTML + CSS + JS)
        <-> HTTP/HTTPS
Express Server (app.js)
  |-- Session Middleware (express-session + MySQL store)
  |-- Static Assets (frontend/public/)
  |-- Page Routes     -> EJS render responses
  |-- Auth Routes     -> login/register/logout
  |-- Skill Routes    -> catalogue + admin CRUD
  |-- Recommend Route -> ranked recommendation page
  `-- API Routes      -> JSON responses (/api/*)
        <-> mysql2 pool
MySQL Database (skills_db)
```

### Module Breakdown

| Layer | Directory | Responsibility |
| --- | --- | --- |
| Entry | `app.js` | Middleware stack, route mounting, server bootstrap |
| Config | `backend/config/` | DB pool, session store, env loader |
| Routes | `backend/routes/` | URL mapping, validation rules |
| Controllers | `backend/controllers/` | Request/response logic |
| Models | `backend/models/` | SQL queries, data access |
| Middleware | `backend/middleware/` | Auth guards, error handler, rate limiters |
| Utils | `backend/utils/` | Recommendation engine, async wrapper |
| Views | `frontend/views/` | EJS templates and partials |
| Styles | `frontend/public/css/style.css` | Single-file design system |
| Client JS | `frontend/public/js/main.js` | Progressive enhancement |
| Tests | `tests/` | Node test suite for pure recommendation logic |

### Database Schema (ERD Summary)

```text
users
  id PK
  name
  email UNIQUE
  password_hash
  role ENUM
  target_role
  created_at
      |
      | 1:N
      v
user_skills
  id PK
  user_id FK -> users.id
  skill_id FK -> skills.id
  proficiency ENUM
  created_at
      ^
      | N:1
skills
  id PK
  name
  category_id FK -> categories.id
  difficulty ENUM
  description
  resource_url
  created_at
  updated_at
      ^
      | N:1
categories
  id PK
  name
  slug

user_sessions
  session_id PK
  expires
  data
  managed by express-mysql-session
```

Normalisation: the schema is in 3NF. Skills reference categories by foreign key, and users reference skills through the junction table `user_skills` with a uniqueness rule per user/skill pair. Session data is separated into `user_sessions`.

---

## Setup & Installation

### Prerequisites

- Node.js >= 18
- MySQL 8.x running locally
- npm >= 9

### Steps

```bash
# 1. Open the project
cd "FSBD PROJECT-RECOMMENDATION SYSTEM"

# 2. Install dependencies
npm install

# 3. Create the database
mysql -u root -p < database/mysql.sql

# 4. Configure environment
cp .env.example .env
# Edit .env and set your MySQL credentials

# 5. Start the server
npm run dev
npm start
```

### .env Variables

```text
NODE_ENV=development
PORT=3000
SESSION_SECRET=change_this_to_a_long_random_string

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=FSBD-FINALJURY
DB_PASSWORD=harsh@321
DB_NAME=skills_db
```

### Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@skillmatch.local` | `admin123` |
| Learner | `harsh@gmail.com` | `123456` |

---

## Backend Development

### RESTful API Endpoints

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | None | Server and DB health check |
| GET | `/api/categories` | None | List all categories |
| GET | `/api/skills` | None | List all skills |
| GET | `/api/skills/:id` | None | Get single skill |
| POST | `/api/skills` | Admin | Create skill |
| PUT | `/api/skills/:id` | Admin | Update skill |
| DELETE | `/api/skills/:id` | Admin | Delete skill |
| GET | `/api/recommendations` | Auth | Get user's recommendations |
| GET | `/api/users/me` | Auth | Get current user profile |

### Page Routes

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | None | Landing page, redirects to dashboard if logged in |
| GET | `/auth/login` | None | Login form |
| POST | `/auth/login` | None | Process login |
| GET | `/auth/register` | None | Register form |
| POST | `/auth/register` | None | Process registration |
| GET | `/auth/logout` | None | Destroy session, redirect home |
| GET | `/dashboard` | Auth | Dashboard with profile form |
| POST | `/profile` | Auth | Save profile and skills |
| GET | `/skills` | None | Skills catalogue |
| GET | `/skills/new` | Admin | New skill form |
| POST | `/skills` | Admin | Create skill |
| GET | `/skills/:id` | None | Skill detail |
| GET | `/skills/:id/edit` | Admin | Edit skill form |
| PUT | `/skills/:id` | Admin | Update skill |
| DELETE | `/skills/:id` | Admin | Delete skill |
| GET | `/recommend` | Auth | Personalised recommendations |

### Middleware Stack (In Order)

1. `helmet` - security headers.
2. `compression` - gzip compression.
3. `morgan` - request logging.
4. `express.urlencoded` and `express.json` - body parsing.
5. `method-override` - PUT/DELETE from HTML forms.
6. `express-session` with MySQL store - session management.
7. `express.static` - serves `frontend/public/`.
8. Custom locals middleware - injects `currentUser`, `flash`, and `currentPath`.
9. Route handlers.
10. `notFound` - branded 404 handling.
11. `errorHandler` - centralised HTML/JSON error rendering.

---

## Authentication & Security

- Password hashing: bcrypt with cost factor 10 through `bcryptjs`.
- Session regeneration: `req.session.regenerate()` creates a fresh session ID after login to prevent session fixation.
- Session storage: MySQL-backed `express-mysql-session`, so sessions survive restarts.
- Cookie flags: `httpOnly: true`, `secure: true` in production, `sameSite: 'lax'`, 4-hour `maxAge`.
- Rate limiting: auth routes limited to 20 requests per 15 minutes; API limited to 60 requests per minute.
- Role-based access: `requireAuth` protects learner routes, `requireAdmin` protects catalogue management.
- Input validation: `express-validator` trims, validates, and escapes profile/skill text inputs.
- SQL injection defense: every model uses parameterized placeholders (`?`), never SQL string concatenation.
- Security headers: `helmet` hardens browser-facing responses. CSP is disabled in app configuration to keep the Google Fonts CDN simple for this academic UI.

---

## Recommendation Engine

File: `backend/utils/recommendationEngine.js`

The engine is a pure function, `buildRecommendations({ skills, ownedSkills, targetRole })`. It performs no database calls, which makes it easy to unit test.

### Scoring Algorithm

| Signal | Points |
| --- | --- |
| Base difficulty score | Beginner: 10, Intermediate: 20, Advanced: 30 |
| Category overlap with owned skills | +45 if beginner, +40 if intermediate, +30 if advanced in that category |
| Target role keyword match | +35 if skill name, category, or description contains a goal token |
| Empty profile plus Beginner skill | +25 cold-start bonus |

Skills already owned by the user are filtered out. Remaining skills are sorted by descending score, with stable deterministic ordering for ties, and the top 8 are returned. Each item includes a human-readable reason string built from the matched signals.

Flow:

```text
load all skills
  -> load owned skills
  -> filter owned
  -> apply difficultyBase
  -> apply categoryBonus
  -> apply goalMatchBonus
  -> apply beginnerBonus
  -> sort descending
  -> slice top 8
```

---

## Frontend (EJS)

All views are EJS templates. Core functionality is server-rendered: controllers pass data through `res.render(view, locals)`, then EJS outputs escaped values with `<%= %>`.

Shared partials:

- `partials/header.ejs` - document shell, metadata, CSS link.
- `partials/navbar.ejs` - sticky navbar, active links, flash toast, mobile hamburger.
- `partials/footer.ejs` - brand footer, stack attribution, JS include.

The custom stylesheet in `frontend/public/css/style.css` defines the complete design system: variables, layout utilities, cards, badges, forms, auth layout, home page, dashboard, catalogue, recommendations, detail pages, and responsive states.

The client script in `frontend/public/js/main.js` is progressive enhancement only:

- synchronizes skill checkbox state with proficiency selects;
- confirms destructive delete actions;
- filters the skills catalogue by search, category, and difficulty;
- shows password strength feedback;
- handles flash toast polish.

---

## Testing

```bash
npm test
```

The suite uses Node.js built-in `node:test`. `tests/recommendationEngine.test.js` covers the recommendation engine pure function without requiring a database.

Syntax checks:

```bash
npm run check
```

---

## Deployment Readiness

Environment:

- Set `NODE_ENV=production` for secure cookies, combined Morgan logs, and static asset caching.
- Set a strong random `SESSION_SECRET` of at least 32 characters.
- Use a managed MySQL instance and production database credentials.
- Keep `.env` out of source control.

Process management:

```bash
npm run start:prod
pm2 start app.js --name skillmatch
```

Verification:

```bash
curl http://localhost:3000/api/health
```

Expected shape:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-05-02T00:00:00.000Z"
}
```

Checklist:

- [x] Helmet hardened headers.
- [x] Compression enabled.
- [x] Rate limiting on auth and API routes.
- [x] Session secret loaded from environment.
- [x] Passwords bcrypt hashed.
- [x] SQL injection prevented by parameterized queries.
- [x] Stored XSS reduced by validation escaping and EJS auto-escaping.
- [x] CSRF risk reduced through `sameSite: 'lax'` cookies and form method override pattern.
- [x] MySQL connection pooling enabled.
- [x] Branded error page for 404/500 responses.

---

## Viva-Voce Notes

### Why call `req.session.regenerate()` on login?

It prevents session fixation. If an attacker tricks a user into using a known session ID before login, regenerating the session after successful authentication invalidates that pre-login ID.

### Why store sessions in MySQL?

The default memory store loses sessions on restart and is not suitable for production. MySQL sessions persist across restarts, avoid memory growth in the Node process, and support multiple server instances sharing one session store.

### Why parameterized queries?

Parameterized queries prevent SQL injection because user input is sent as bound data, not executable SQL. Inputs like `' OR 1=1 --` cannot change the SQL statement structure.

### What does `asyncHandler` do?

Express route handlers that return rejected promises need their errors passed to `next(err)`. `asyncHandler` wraps async routes and forwards failures to the central error middleware.

### Why use method override?

HTML forms only support GET and POST. `method-override` lets forms submit `?_method=PUT` or `?_method=DELETE`, enabling REST-style update and delete routes from standard forms.

---

## Project Structure

```text
FSBD PROJECT-RECOMMENDATION SYSTEM/
|-- app.js
|-- package.json
|-- .env.example
|-- README.md
|-- backend/
|   |-- config/
|   |   |-- db.js
|   |   |-- env.js
|   |   `-- sessionStore.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- recommendationController.js
|   |   `-- skillController.js
|   |-- middleware/
|   |   |-- authMiddleware.js
|   |   |-- errorHandler.js
|   |   |-- notFound.js
|   |   `-- rateLimiters.js
|   |-- models/
|   |   |-- recommendationModel.js
|   |   |-- skillModel.js
|   |   `-- userModel.js
|   |-- routes/
|   |   |-- apiRoutes.js
|   |   |-- authRoutes.js
|   |   |-- pageRoutes.js
|   |   |-- recommendationRoutes.js
|   |   `-- skillRoutes.js
|   `-- utils/
|       |-- asyncHandler.js
|       `-- recommendationEngine.js
|-- database/
|   |-- mysql.sql
|   |-- schema.sql
|   `-- seed.sql
|-- frontend/
|   |-- public/
|   |   |-- css/style.css
|   |   `-- js/main.js
|   `-- views/
|       |-- auth/
|       |-- dashboard/
|       |-- partials/
|       |-- skills/
|       |-- error.ejs
|       `-- home.ejs
|-- logs/
`-- tests/
    `-- recommendationEngine.test.js
```

---

Built with Node.js, Express 5, EJS 5, MySQL 8, bcryptjs, and express-session.
