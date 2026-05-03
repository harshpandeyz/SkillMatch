# SkillMatch — Skill Recommendation System

A full-stack web application that helps learners identify which skills to learn next based on their existing knowledge and target career role.

Built using **Node.js**, **Express.js**, **EJS**, and **MySQL**, this project follows a modular MVC architecture and implements secure authentication, role-based access control, and a custom recommendation engine.

---

## 🚀 Features

### 👤 Learner
- Register and login securely
- Create and update profile
- Select known skills
- Set a target role
- Get personalized skill recommendations
- Browse skill details

### 🛠️ Admin
- Manage skill catalogue (CRUD operations)
- Manage categories
- Access all learner features

### 🧠 Recommendation Engine
Skills are ranked based on:
- **Category Match** – similarity with existing skills
- **Target Role Relevance** – keyword-based matching
- **Difficulty Level** – ensures progressive learning

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Frontend | EJS (Server-side rendering) |
| Database | MySQL |
| Authentication | Express Sessions + bcrypt |
| Architecture | MVC Pattern |

---

## 📁 Project Structure

```
SkillMatch/
|-- app.js
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   `-- utils/
|-- frontend/
|   |-- views/
|   `-- public/
|-- database/
|-- tests/
|-- package.json
`-- README.md
```

---

## 🔄 Request Flow

```
Browser → Routes → Controllers → Models → MySQL
Browser ← Views / JSON ← Controllers ← Models
```

---

## 🗄️ Database Design

**Tables:** `users`, `skills`, `categories`, `user_skills` (junction table)

```
users 1---* user_skills *---1 skills *---1 categories
```

---

## 🔐 Security & Best Practices

- ✅ Password hashing using `bcrypt`
- ✅ Session-based authentication
- ✅ Role-based access control
- ✅ Parameterized SQL queries
- ✅ Server-side validation
- ✅ Centralized error handling

---

## ⚙️ Production Enhancements

- `helmet` for secure HTTP headers
- `compression` for faster responses
- `express-rate-limit` for API protection
- `express-mysql-session` for persistent sessions
- Health check endpoint at `/api/health`
- Static asset caching

---

## 📡 REST API

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/health` | Public |
| GET | `/api/categories` | Public |
| GET | `/api/skills` | Public |
| GET | `/api/skills/:id` | Public |
| POST | `/api/skills` | Admin only |
| PUT | `/api/skills/:id` | Admin only |
| DELETE | `/api/skills/:id` | Admin only |
| GET | `/api/recommendations` | Authenticated |

---

## 🛠️ Setup Instructions

**1. Install dependencies**
```bash
npm install
```

**2. Setup MySQL database**
```bash
mysql -u root -p < database/mysql.sql
```

**3. Create `.env` file**
```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=skills_db
SESSION_SECRET=your_secret_key
```

**4. Run the application**
```bash
npm start
```

Visit: `http://localhost:3000`

---

## 🧪 Testing & Checks

```bash
npm run check
npm test
```

---

## 🌟 Highlights

- ✅ Clean and scalable MVC architecture
- ✅ Secure authentication system
- ✅ Personalized recommendation logic
- ✅ Full CRUD operations with role-based access
- ✅ Production-ready backend practices

---

## 🔮 Future Improvements

- Machine learning-based recommendations
- Skill roadmap visualization
- Integration with job platforms
- User progress tracking

---

## 👨‍💻 Author

**Harsh Pandey** · [github.com/harshpandeyz](https://github.com/harshpandeyz)
