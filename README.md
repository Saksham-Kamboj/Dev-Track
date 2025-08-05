## ✅ **Project**

**DevTrack**
*Tagline: "Keep the team in sync with every task"*
---

## 📘 **Project Documentation for DevTrack**

### 📌 Project Overview

**DevTrack** is a team productivity and task-tracking dashboard for software development teams.
It enables **Admins** to manage developers and monitor their progress via a task management table.
**Developers** can log in and perform CRUD operations on their assigned tasks.

---

### 🧩 Tech Stack

| Area        | Tech                                                 |
| ----------- | ---------------------------------------------------- |
| Frontend    | React.js (Vite), TypeScript, Tailwind CSS, ShadCN UI |
| Backend     | Node.js, Express.js                                  |
| Database    | MongoDB                                              |
| Auth        | JWT                                                  |
| Styling     | TailwindCSS + Shadcn                                 |
| API Testing | Postman                                              |

---

### 👥 User Roles

1. **Admin**

   * Can create Developer accounts.
   * Can view all task records submitted by developers.
2. **Developer**

   * Can log in using email and password.
   * Can perform CRUD on task details.

---

### 📂 Folder Structure

#### Frontend (`client/`)

```
src/
├── assets/
├── components/
├── layouts/
├── pages/
├── routes/
├── services/
├── redux/
├── types/
├── utils/
└── main.tsx
```

#### Backend (`server/`)

```
src/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
└── index.ts
```

---

### 🔐 Authentication Flow

1. JWT-based login system.
2. Roles defined in token: `admin` or `developer`.
3. Protected routes based on role.

---

### ⚙️ Core Features (Step-by-Step Functionality)

#### 1. Admin Login

* Admin logs in using hardcoded credentials or seeded admin in DB.
* Redirected to Admin Dashboard.

#### 2. Developer Account Creation

* Admin can add new developers via a form (name, email, password).
* API saves developer to MongoDB and sends credentials.

#### 3. Developer Login

* Developer logs in using email/password.
* JWT is stored in localStorage.
* Redirected to Developer Dashboard.

#### 4. Developer Task Management (CRUD)

* Create task:

  * Fields: Task title, description, date, status (pending/completed), optional file.
* Read task:

  * Developer can see a table of all tasks they created.
* Update task:

  * Developer can edit task details.
* Delete task:

  * Developer can delete their own tasks.

#### 5. Admin Monitoring

* Admin can view:

  * List of all developers.
  * Task tables of each developer.
  * Filter/sort by developer, status, date, etc.

#### 6. Authorization Middleware

* Protect all routes using role-based auth.
* Example: `/admin/*` only accessible to Admin.

---

### 🛠 API Endpoints (Sample)

**Auth**

```
POST   /api/auth/login
GET    /api/auth/profile
```

**Admin**

```
GET   /api/admin/dashboard   // Get dashboard stats and charts
POST   /api/admin/developer   // Create developer
GET    /api/admin/developers  // List all developers
GET    /api/admin/tasks       // Get all tasks
```

**Developer Tasks**

```
POST   /api/tasks/
GET    /api/tasks/
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

### 🧪 Testing

* Postman collection for API testing.
* Auth, role-based access, and task CRUD tested.

---

### 🎯 Future Enhancements

* File upload with cloud storage.
* Real-time updates using WebSocket (e.g., socket.io).
* Task status notifications.
* Analytics dashboard for admins.

---