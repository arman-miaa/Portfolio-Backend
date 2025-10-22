

## 🚀 Portfolio Backend (Express + Prisma + JWT)

📖 Overview

This is the backend server for my personal portfolio project.
It handles all authentication, blog management, and data APIs for the frontend.
Built using Express.js, Prisma ORM, and PostgreSQL, this backend is designed with TypeScript for type safety, scalability, and maintainability.

The architecture follows a modular structure, separating each feature (like auth, blog) into independent modules for cleaner and reusable code.
It also includes secure JWT-based authentication, bcrypt password hashing, and centralized error handling to ensure robust API performance.

---

### 🌐 Live Server

🔗 **Backend API:** [https://arman-portfolio-backend.vercel.app/](https://arman-portfolio-backend.vercel.app/)

---

### 🧰 Tech Stack

| Category       | Technology                 |
| -------------- | -------------------------- |
| Runtime        | Node.js                    |
| Framework      | Express.js                 |
| Language       | TypeScript                 |
| ORM            | Prisma                     |
| Database       | PostgreSQL                 |
| Authentication | JWT + bcrypt               |
| Deployment     | Vercel                     |
| Notifications  | react-hot-toast (frontend) |

---

### 🗂️ Features

#### 🔐 Authentication & Authorization

* Secure **JWT-based authentication**
* **bcrypt** password hashing
* Middleware for **protected routes** (only admin can manage blogs)
* Admin user seeded automatically for login

#### 📝 Blog Management (Admin Only)

* **CRUD APIs** for blogs (`Create`, `Read`, `Update`, `Delete`)
* Each blog includes `title`, `content`, `author`, and `createdAt`
* Public endpoints for reading blogs

#### 🌍 Public Endpoints

* Fetch all blogs or a single blog
* Display blogs dynamically via ISR in frontend

#### ⚙️ Error Handling

* Centralized global error handler
* Validation for all inputs
* Clear, user-friendly API error messages

---

### 👤 Admin Credentials (for testing)

| Email               | Password     |
| ------------------- | ------------ |
| `admin@example.com` | `Admin@1234` |

> 🧩 *This is a demo admin account seeded automatically for testing.*

---

### 📁 Folder Structure

```
Portfolio-Backend/
├── .env.example
├── prisma/
│   ├── migrations/
│   │   ├── 20251014122738_test_db/
│   │   ├── 20251015025417_user_table/
│   │   ├── 20251015025753_table/
│   │   ├── 20251015030013_make_email_unique/
│   │   ├── 20251021154655_add_blog_table/
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public/
│   └── index.html
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/db.ts
│   ├── helpers/seed.ts
│   ├── middleware/auth.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.service.ts
│   │   └── blog/
│   │       ├── blogs.controller.ts
│   │       ├── blogs.routes.ts
│   │       └── blogs.service.ts
│   ├── routes/index.ts
│   └── types/index.ts
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

---

### ⚙️ Installation & Setup

#### 🔸 Prerequisites

* Node.js ≥ 18
* PostgreSQL Database

#### 🔸 Steps

```bash
# 1. Clone the repository
git clone https://github.com/arman-miaa/Portfolio-Backend.git

# 2. Navigate into the project
cd Portfolio-Backend

# 3. Install dependencies
pnpm install

# 4. Create environment file
cp .env.example .env

# 5. Update .env with your configuration
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
JWT_SECRET="your_jwt_secret"

# 6. Run Prisma migrations
npx prisma migrate dev --name init

# 7. Seed admin user
pnpm ts-node src/helpers/seed.ts

# 8. Start the server
pnpm run dev
```

---

### 📡 API Endpoints

#### 🔓 Public Routes

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/blogs`     | Get all blogs   |
| GET    | `/api/blogs/:id` | Get single blog |

#### 🔒 Private Routes (Admin Only)

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| POST   | `/api/auth/login` | Admin login     |
| POST   | `/api/blogs`      | Create new blog |
| PUT    | `/api/blogs/:id`  | Update blog     |
| DELETE | `/api/blogs/:id`  | Delete blog     |

---

### 🧩 Environment Variables

Example `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
JWT_SECRET="your_jwt_secret_key"
PORT=5000
```

---

### 🧪 Testing API with Postman

**Login:**

```
POST https://arman-portfolio-backend.vercel.app/api/auth/login
{
  "email": "admin@example.com",
  "password": "Admin@1234"
}
```

**Create Blog:**

```
POST https://arman-portfolio-backend.vercel.app/api/blogs
Headers: { Authorization: "Bearer <token>" }
Body: {
  "title": "My First Blog",
  "content": "This is a sample blog post."
}
```

---

### 🧱 Prisma Schema Example

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String?
  email     String   @unique
  password  String
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  blogs     Blog[]
}

model Blog {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

---

### 🧱 Error Handling Example

Example of standardized API response:

```json
{
  "success": false,
  "message": "Unauthorized: Invalid token"
}
```

---

### 🌍 Deployment

Deployed on **Vercel** using `vercel.json` config for custom Express entry.
All environment variables are configured securely through the Vercel dashboard.

---

### 🎥 Demo Video

🎬 *10–15 minute walkthrough coming soon — showing login, blog management, API testing, and deployment overview.*

---

### 📎 Useful Links

* 🔗 **Live Backend:** [https://arman-portfolio-backend.vercel.app/](https://arman-portfolio-backend.vercel.app/)
* 💻 **GitHub Repo:** [https://github.com/arman-miaa/Portfolio-Backend](https://github.com/arman-miaa/Portfolio-Backend)
* 🌐 **Frontend Repo:** *Coming soon*

---

### 👨‍💻 Author

**Md Arman Mia**
💼 MERN Stack Developer
📧 Email: [your-email@example.com](mailto:your-email@example.com)
🌍 Portfolio: *Coming soon*

---

### 📜 License

This project is licensed under the **MIT License** – free to use and modify with proper attribution.

---

### ✅ Status

✔️ Backend Completed & Live
🚧 Frontend (Next.js + ISR) in progress


