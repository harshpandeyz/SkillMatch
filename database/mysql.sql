DROP DATABASE IF EXISTS skills_db;
CREATE DATABASE skills_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skills_db;

CREATE USER IF NOT EXISTS 'FSBD-FINALJURY'@'localhost' IDENTIFIED BY 'harsh@321';
CREATE USER IF NOT EXISTS 'FSBD-FINALJURY'@'127.0.0.1' IDENTIFIED BY 'harsh@321';
GRANT ALL PRIVILEGES ON skills_db.* TO 'FSBD-FINALJURY'@'localhost';
GRANT ALL PRIVILEGES ON skills_db.* TO 'FSBD-FINALJURY'@'127.0.0.1';
FLUSH PRIVILEGES;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('learner', 'admin') NOT NULL DEFAULT 'learner',
  target_role VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category_id INT NOT NULL,
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  description TEXT NOT NULL,
  resource_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_skills_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT
);

CREATE TABLE user_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_id INT NOT NULL,
  proficiency ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_skill (user_id, skill_id),
  CONSTRAINT fk_user_skills_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_skills_skill
    FOREIGN KEY (skill_id) REFERENCES skills(id)
    ON DELETE CASCADE
);

CREATE TABLE user_sessions (
  session_id VARCHAR(128) NOT NULL PRIMARY KEY,
  expires INT UNSIGNED NOT NULL,
  data MEDIUMTEXT
);

INSERT INTO users (name, email, password_hash, role, target_role) VALUES
('Admin User', 'admin@skillmatch.local', '$2b$10$cBesen2DpscpkPh5iwBkreZlDN9QfRekgaglbO3Z225PCI7l.CezS', 'admin', 'Full Stack Developer'),
('Harsh Learner', 'student@skillmatch.local', '$2b$10$NOMF0z7aT9P.XJ6Iwxj31e/GyfjVfSJubYfBFqIgqtCS.58erOcd6', 'learner', 'Backend Developer'),
('Harsh Demo', 'harsh@gmail.com', '$2b$10$lb3OWIPnXERwYMpENbaVdenKaXr.hSvEhdlUMxrxS/dWMeSQ1YkIK', 'learner', 'Software Developer');

INSERT INTO categories (name, slug) VALUES
('Programming', 'programming'),
('Backend Development', 'backend-development'),
('Frontend Development', 'frontend-development'),
('Database', 'database'),
('DevOps', 'devops'),
('Design', 'design'),
('Data Analytics', 'data-analytics'),
('Cloud Computing', 'cloud-computing'),
('Testing and QA', 'testing-and-qa'),
('AI and Machine Learning', 'ai-and-machine-learning'),
('Mobile Development', 'mobile-development'),
('Cybersecurity', 'cybersecurity'),
('Career Skills', 'career-skills');

INSERT INTO skills (name, category_id, difficulty, description, resource_url) VALUES
('JavaScript Fundamentals', 1, 'Beginner', 'Core JavaScript syntax, functions, arrays, objects, and asynchronous programming basics.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'),
('Node.js', 2, 'Intermediate', 'Server-side JavaScript runtime used to build scalable backend applications and APIs.', 'https://nodejs.org/en/learn'),
('Express.js', 2, 'Intermediate', 'Minimal Node.js framework for routing, middleware, REST APIs, and server-side web applications.', 'https://expressjs.com/'),
('REST API Design', 2, 'Intermediate', 'Designing resource-based endpoints using HTTP methods, status codes, validation, and JSON responses.', 'https://restfulapi.net/'),
('EJS Templates', 3, 'Beginner', 'Dynamic server-rendered views with partials, loops, conditionals, and backend data binding.', 'https://ejs.co/'),
('Responsive CSS', 3, 'Beginner', 'Creating usable layouts for desktop and mobile screens with modern CSS techniques.', 'https://web.dev/learn/design/'),
('MySQL Schema Design', 4, 'Intermediate', 'Relational database design with keys, normalization, joins, indexes, and constraints.', 'https://dev.mysql.com/doc/'),
('SQL CRUD Operations', 4, 'Beginner', 'Creating, reading, updating, and deleting persistent records with structured SQL queries.', 'https://dev.mysql.com/doc/refman/8.4/en/sql-statements.html'),
('Authentication Security', 2, 'Advanced', 'Password hashing, sessions, access control, validation, and secure request handling.', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
('Git and GitHub', 5, 'Beginner', 'Version control workflows, branching, collaboration, and source code management.', 'https://docs.github.com/en/get-started'),
('Deployment Readiness', 5, 'Intermediate', 'Environment variables, production configuration, dependency installation, and deployment checks.', 'https://12factor.net/config'),
('UI Wireframing', 6, 'Beginner', 'Planning user flows and screen layouts before implementing full stack application views.', 'https://www.figma.com/resource-library/what-is-wireframing/'),
('Data Visualization', 7, 'Intermediate', 'Presenting analyzed data with charts, dashboards, and clear visual summaries.', 'https://www.tableau.com/learn/articles/data-visualization'),
('TypeScript Essentials', 1, 'Intermediate', 'Typed JavaScript fundamentals, interfaces, generics, and safer full stack application code.', 'https://www.typescriptlang.org/docs/'),
('Data Structures in JavaScript', 1, 'Intermediate', 'Arrays, stacks, queues, linked lists, maps, trees, and problem solving patterns for interviews.', 'https://www.freecodecamp.org/news/data-structures-in-javascript-with-examples/'),
('Object Oriented Programming', 1, 'Beginner', 'Classes, objects, encapsulation, inheritance, and practical modeling for maintainable applications.', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming'),
('Advanced Node.js Patterns', 2, 'Advanced', 'Streams, worker threads, clustering, dependency boundaries, and production-grade backend architecture.', 'https://nodejs.org/api/'),
('JWT and OAuth Basics', 2, 'Advanced', 'Token-based authentication, authorization flows, refresh tokens, scopes, and identity provider integration.', 'https://oauth.net/2/'),
('React Fundamentals', 3, 'Beginner', 'Components, props, state, effects, and modern frontend composition for interactive applications.', 'https://react.dev/learn'),
('Frontend State Management', 3, 'Intermediate', 'Managing client state, async data, forms, and predictable UI flows in large interfaces.', 'https://redux.js.org/tutorials/essentials/part-1-overview-concepts'),
('Accessibility Foundations', 3, 'Intermediate', 'Semantic HTML, keyboard flows, color contrast, ARIA basics, and inclusive interface testing.', 'https://web.dev/learn/accessibility/'),
('Database Indexing', 4, 'Advanced', 'Indexes, query plans, cardinality, slow query analysis, and performance tuning for relational databases.', 'https://dev.mysql.com/doc/refman/8.4/en/mysql-indexes.html'),
('Transactions and ACID', 4, 'Intermediate', 'Atomicity, consistency, isolation, durability, locking, and safe multi-step data operations.', 'https://dev.mysql.com/doc/refman/8.4/en/mysql-transactions.html'),
('Docker Fundamentals', 5, 'Beginner', 'Containers, images, Dockerfiles, volumes, networks, and repeatable local development environments.', 'https://docs.docker.com/get-started/'),
('CI/CD Pipelines', 5, 'Intermediate', 'Automated checks, builds, tests, deployment stages, secrets, and release confidence for teams.', 'https://docs.github.com/en/actions'),
('AWS Cloud Basics', 8, 'Beginner', 'Cloud computing concepts, regions, IAM basics, compute, storage, and managed service fundamentals.', 'https://aws.amazon.com/getting-started/'),
('Serverless Functions', 8, 'Intermediate', 'Event-driven backend design with cloud functions, triggers, managed scaling, and deployment workflows.', 'https://aws.amazon.com/lambda/getting-started/'),
('Unit Testing with Node.js', 9, 'Beginner', 'Writing focused tests for JavaScript functions, backend services, and confidence-building refactors.', 'https://nodejs.org/api/test.html'),
('API Testing with Postman', 9, 'Beginner', 'Collections, environments, assertions, request flows, and repeatable API validation.', 'https://learning.postman.com/'),
('Machine Learning Basics', 10, 'Beginner', 'Supervised learning, model training, evaluation metrics, and practical AI vocabulary for developers.', 'https://developers.google.com/machine-learning/crash-course'),
('Prompt Engineering', 10, 'Beginner', 'Writing clear AI prompts, setting constraints, evaluating responses, and building reliable AI-assisted workflows.', 'https://platform.openai.com/docs/guides/prompt-engineering'),
('Python for Data Analysis', 10, 'Intermediate', 'Python data workflows using notebooks, pandas, cleaning, grouping, and exploratory analysis.', 'https://pandas.pydata.org/docs/getting_started/index.html'),
('Android Development Basics', 11, 'Beginner', 'Mobile app structure, screens, navigation, data handling, and Android development fundamentals.', 'https://developer.android.com/courses'),
('React Native Foundations', 11, 'Intermediate', 'Cross-platform mobile UI, components, navigation, device APIs, and app deployment basics.', 'https://reactnative.dev/docs/getting-started'),
('Web Security Basics', 12, 'Beginner', 'Common web risks including XSS, CSRF, injection, secure headers, and defensive coding habits.', 'https://owasp.org/www-project-top-ten/'),
('Secure Coding Practices', 12, 'Intermediate', 'Input validation, dependency hygiene, secret handling, access control, and secure application design.', 'https://cheatsheetseries.owasp.org/'),
('Technical Resume Building', 13, 'Beginner', 'Writing project-driven resumes that highlight outcomes, stack ownership, and measurable engineering work.', 'https://www.freecodecamp.org/news/writing-a-killer-software-engineering-resume-b11c91ef699d/'),
('System Design Foundations', 13, 'Advanced', 'Scalability, caching, queues, databases, APIs, reliability, and tradeoff-based architecture decisions.', 'https://github.com/donnemartin/system-design-primer');

INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES
(2, 1, 'beginner'),
(2, 8, 'beginner'),
(3, 1, 'beginner'),
(3, 3, 'beginner'),
(3, 8, 'beginner');
