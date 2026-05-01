# Skill Recommendation System

Full stack FSBD jury project built with Node.js, Express.js, EJS, MySQL, sessions, validation, role-based access control, and REST APIs.

## Problem Statement

Students often know a few technologies but do not know which skill to learn next for a target role. This system lets a learner create a profile, select known skills, set a target role, and receive ranked recommendations. Admin users manage the skill catalogue.

## User Roles

- Learner: register, login, update profile, choose known skills, view recommendations, browse skill details.
- Admin: all learner features plus create, update, and delete catalogue skills.

## Functional Requirements

- Secure registration and login with hashed passwords.
- Session-based authentication and logout.
- Role-based access control for admin CRUD.
- Learner profile with target role and known skill selection.
- Recommendation engine using category match, target-role keyword match, and difficulty score.
- Dynamic EJS pages with reusable partials.
- MySQL persistence with normalized relationships.
- REST API endpoints for skills, categories, health, and recommendations.

## Non-Functional Requirements

- Modular MVC-style folder structure.
- Parameterized SQL queries.
- Server-side validation and centralized error handling.
- Environment-based configuration.
- Deployment-ready scripts and setup documentation.
- Security headers, rate limiting, compressed responses, and persistent MySQL sessions.
- Database-aware health check for operational readiness.

## Architecture

```text
FSBD PROJECT-RECOMMENDATION SYSTEM
|-- app.js                  Express application entry point
|-- backend/                Server-side MVC code
|   |-- config/             MySQL connection
|   |-- controllers/        Request handling and response rendering
|   |-- middleware/         Auth, admin guard, rate limits, 404, error handling
|   |-- models/             Parameterized SQL queries
|   |-- routes/             Web and REST route definitions
|   `-- utils/              Recommendation engine
|-- frontend/               User interface layer
|   |-- views/              EJS pages and partials
|   `-- public/             CSS and browser JavaScript
|-- database/               MySQL schema and seed script
|-- tests/                  Node test files
|-- package.json            Scripts and dependencies
`-- README.md               Setup, rubric mapping, viva notes
```

## Request Flow

```text
Browser -> Express routes -> Controllers -> Models -> MySQL
Browser <- EJS views / JSON responses <- Controllers <- Models
```

## Database Relationship Overview

```text
users 1---* user_skills *---1 skills *---1 categories
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create the MySQL database and seed demo data:

```bash
mysql -u root -p < database/mysql.sql
```

For MySQL Workbench, create or use this connection:

```text
Connection Name: FSBD-FINALJURY
Hostname: 127.0.0.1
Port: 3306
Username: FSBD-FINALJURY
Password: harsh@321
```

Then open `database/mysql.sql` in Workbench and run the full script.

3. Create `.env` from `.env.example` and update your MySQL password:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=FSBD-FINALJURY
DB_PASSWORD=harsh@321
DB_NAME=skills_db
SESSION_SECRET=replace-with-a-long-random-secret
```

4. Start the app:

```bash
npm start
```

Open `http://localhost:3000`.

Useful developer checks:

```bash
npm run check
npm test
```

## Demo Accounts

- Admin: `admin@skillmatch.local` / `admin123`
- Harsh demo learner: `harsh@gmail.com` / `123456`
- Learner: `student@skillmatch.local` / `student123`

## REST API

- `GET /api/health`
- `GET /api/categories`
- `GET /api/skills`
- `GET /api/skills/:id`
- `POST /api/skills` admin session required
- `PUT /api/skills/:id` admin session required
- `DELETE /api/skills/:id` admin session required
- `GET /api/recommendations` learner/admin session required

## Rubric Mapping

| Rubric Criteria | Project Evidence |
| --- | --- |
| Problem Identification & Requirement Analysis | README problem statement, roles, functional and non-functional requirements |
| System Design & Architecture | Architecture flow and database relationship overview |
| Backend Development | Express server, route modules, middleware, controllers, REST APIs |
| Database Design & Integration | Normalized MySQL schema and persistent CRUD |
| Frontend Integration & UI Rendering | EJS views, partials, loops, dynamic dashboard and recommendations |
| Authentication & Security | bcrypt password hashing, sessions, role-based admin access, validation |
| End-to-End Functionality | Register/login, profile, recommendations, admin skill CRUD, REST API |
| Viva-Voce | Technical notes below |

## Production-Level Additions

- `helmet` sets safer HTTP response headers.
- `compression` reduces response size.
- `express-rate-limit` protects auth and API routes from repeated abuse.
- `express-mysql-session` stores sessions in MySQL instead of memory.
- Central 404 and error middleware returns clean HTML or JSON responses.
- `/api/health` verifies both the server and database connection.
- Static assets are served from `frontend/public` with caching support.

## Viva Notes

- Express handles request routing and middleware, while controllers keep route files clean.
- MySQL schema is normalized: categories are separated from skills, and user skills are stored in a junction table.
- Passwords are never stored directly; bcrypt hashes are stored in `password_hash`.
- Recommendation score combines known skill category match, target role keyword relevance, and difficulty.
- Admin-only routes are protected by `requireAdmin`; learner routes use `requireAuth`.
