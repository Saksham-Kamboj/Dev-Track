## 🌐 Frontend Documentation — **DevTrack Web**

### 📁 Project Structure

```
devtrack-frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── tasks/
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── main.tsx
├── tailwind.config.ts
├── index.html
├── vite.config.ts
```

---

### 🧩 Tech Stack

* **React.js (Vite)**
* **TypeScript**
* **Tailwind CSS**
* **ShadCN UI**
* **React Router DOM**
* **Redux Toolkit (for state)**
* **Axios**
* **Zod / React Hook Form (validation)**

---

### 🧠 Pages & Routes

| Path               | Role      | Description             |
| ------------------ | --------- | ----------------------- |
| `/login`           | All       | Login form              |
| `/admin`           | Admin     | Admin dashboard         |
| `/admin/users`     | Admin     | Developer creation/view |
| `/developer`       | Developer | Developer dashboard     |
| `/developer/tasks` | Developer | Task CRUD interface     |

---

### 🔐 Authentication Flow

* Login → API returns JWT.
* Store JWT in `localStorage`.
* `axios.interceptors` injects token.
* Route protection with role-based check.

---

### ⚙️ Key Features

#### ✅ Login Page

* Auth via `/api/auth/login`
* Redirect to dashboard based on role

#### 🧑‍💼 Admin Dashboard

* View all developers
* Create new developer accounts
* View all tasks submitted by developers

#### 🧑‍💻 Developer Dashboard

* View own tasks
* Add/Edit/Delete tasks (title, description, status)
* Task table with filters

---

### 💡 UI Library: ShadCN + Tailwind

* Use ShadCN UI components for:

  * Form
  * Table
  * Modal
  * Button
* Custom styles extended via Tailwind

---

### 📦 Sample Folder - `pages/developer/tasks/TaskPage.tsx`

```tsx
export default function TaskPage() {
  const tasks = useAppSelector((state) => state.tasks);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">My Tasks</h1>
      <TaskTable data={tasks} />
    </div>
  );
}
```

---

### 🧪 Testing

* Protected route tests
* CRUD operation tests
* Manual QA of role-based access

---

### 🔜 Future Features

* File upload for tasks
* Notification panel
* Real-time status updates (WebSocket)
* Dark mode toggle

---