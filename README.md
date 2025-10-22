
## 🚀 Portfolio Backend (Express + Prisma + JWT)

📖 **Overview**

This is the backend server for my personal portfolio project.
It handles all authentication, blog management, and data APIs for the frontend.
Built using **Express.js**, **Prisma ORM**, and **PostgreSQL**, this backend is designed with **TypeScript** for type safety, scalability, and maintainability.

The architecture follows a modular structure, separating each feature (like auth, blog, projects, skills, experiences, etc.) into independent modules for cleaner and reusable code.
It also includes secure **JWT-based authentication**, **bcrypt password hashing**, and **centralized error handling** to ensure robust API performance.

---

### 🌐 Live Server

🔗 **Backend API:** [https://portfolio-backend36.vercel.app/](https://portfolio-backend36.vercel.app/)

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


---

### 🗂️ Features

#### 🔐 Authentication & Authorization

* Secure **JWT-based authentication**
* **bcrypt** password hashing
* Middleware for **protected routes**
* Admin user **seeded automatically** for login

#### 📝 Blog Management (Admin Only)

* **CRUD APIs** for blogs (`Create`, `Read`, `Update`, `Delete`)
* Each blog includes `title`, `content`, `author`, and `createdAt`
* Public endpoints for reading blogs

#### 💼 Projects, Skills & Experience

* APIs for dynamic project showcase, skill list, and experience timeline
* Data fetched dynamically for frontend sections like *About Me* and *Projects*

#### 💬 Contact & Messages

* Public contact form integration
* Stores messages securely in database for admin view

#### ⚙️ Error Handling

* Centralized global error handler
* Validation for all inputs
* Clear, user-friendly API error messages

---



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
│   │   ├── 20251022013807_projects_tables/
│   │   ├── 20251022080403_add_skill_model/
│   │   ├── 20251022111925_add_contactinfo_model/
│   │   ├── 20251022113710_add_contact_message/
│   │   ├── 20251022122842_add_experence_model/
│   │   ├── 20251022124010_update_experience_model/
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
│   │   ├── blog/
│   │   ├── projects/
│   │   ├── skill/
│   │   ├── experiences/
│   │   ├── contact/
│   │   └── contactMessage/
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

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | `/api/blogs`       | Get all blogs        |
| GET    | `/api/blogs/:id`   | Get single blog      |
| GET    | `/api/projects`    | Get all projects     |
| GET    | `/api/skills`      | Get all skills       |
| GET    | `/api/experiences` | Get experiences      |
| POST   | `/api/contact`     | Send contact message |

#### 🔒 Private Routes (Admin Only)

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| POST   | `/api/auth/login` | Admin login     |
| POST   | `/api/blogs`      | Create new blog |
| PUT    | `/api/blogs/:id`  | Update blog     |
| DELETE | `/api/blogs/:id`  | Delete blog     |

---

### 🧩 Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
JWT_SECRET="your_jwt_secret_key"
PORT=5000
```

---

### 🧪 Testing API with Postman



**Create Blog**

```http
POST https://portfolio-backend36.vercel.app/api/blogs
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

### 🌍 Deployment

Deployed on **Vercel** using `vercel.json` config for Express entry point.
Environment variables securely managed in **Vercel dashboard**.



### 📎 Useful Links

* 🔗 **Live Backend:** [https://portfolio-backend36.vercel.app/](https://portfolio-backend36.vercel.app/)
* 💻 **GitHub Repo:** [https://github.com/arman-miaa/Portfolio-Backend](https://github.com/arman-miaa/Portfolio-Backend)


---

### 👨‍💻 Author

**Md Arman Mia**
💼 MERN Stack Developer
📧 Email: [arman.miaa36@gmail.com](mailto:arman.miaa36@gmail.com)
🌍 Portfolio: [https://arman-mia.vercel.app](https://arman-mia.vercel.app)

---

### 📜 License

Licensed under the **MIT License** – free to use and modify with attribution.


