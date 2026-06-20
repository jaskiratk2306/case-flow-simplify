# Project Walkthrough - Full-Stack CaseFlow System

We have successfully transformed the static CaseFlow client mockup into a full-stack, production-ready application.

---

## 🛠️ Summary of Changes

### 1. Backend Service (`server/`)
We created a clean Node.js / Express backend inside the [server/](file:///c:/case-flow-simplify/server) folder:
* **Database Setup**: Defined a Prisma schema in [schema.prisma](file:///c:/case-flow-simplify/server/prisma/schema.prisma) mapping Users, Cases, and Hearings.
* **Authentication**: Implemented password hashing (`bcryptjs`) and secure session state tokens (`jsonwebtoken`) inside [auth.controller.js](file:///c:/case-flow-simplify/server/src/controllers/auth.controller.js) and [auth.middleware.js](file:///c:/case-flow-simplify/server/src/middleware/auth.middleware.js).
* **Endpoints Configured**:
  * Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
  * Cases: `/api/cases` (GET/POST), `/api/cases/:id` (GET/PUT).
  * Hearings: `/api/cases/:id/hearings` (POST/GET).
  * Analytics: `/api/analytics` (GET).
  * Judges list: `/api/judges` (GET).

### 2. Frontend Integration (`src/`)
We connected the React frontend pages to interact with the backend service API:
* **Vite Proxy**: Configured [vite.config.ts](file:///c:/case-flow-simplify/vite.config.ts) to proxy `/api` calls.
* **State Management**: Built [AuthContext.jsx](file:///c:/case-flow-simplify/src/context/AuthContext.jsx) to automatically parse JWT sessions and store tokens in browser localStorage.
* **Views Added/Updated**:
  * [Login.jsx](file:///c:/case-flow-simplify/src/pages/Login.jsx) & [Register.jsx](file:///c:/case-flow-simplify/src/pages/Register.jsx): Fully functional forms styled with Tailwind CSS.
  * [Cases.jsx](file:///c:/case-flow-simplify/src/pages/Cases.jsx): Refactored to fetch case items from the backend and support async query search and filter dropdowns.
  * [CaseDetail.jsx](file:///c:/case-flow-simplify/src/pages/CaseDetail.jsx): A brand new page showcasing docket details, timeline logs of scheduled hearings, and judicial actions (updating status/track, assigning judges).
  * [Navbar.jsx](file:///c:/case-flow-simplify/src/components/Navbar.jsx) & [App.jsx](file:///c:/case-flow-simplify/src/App.jsx): Updated navigation links and routing tables.

### 3. Deployments & DevOps
* **Configurations**: Created [vercel.json](file:///c:/case-flow-simplify/vercel.json) to handle URL rewriting proxies.
* **Documentation**: Prepared a detailed deployment instruction manual in [DEPLOYMENT.md](file:///c:/case-flow-simplify/DEPLOYMENT.md) for setting up Neon DB, Render, and Vercel.

---

## 🚀 How to Run and Verify Locally

1. **Start Backend**:
   ```bash
   cd server
   npm install
   npx prisma db push
   npm run dev
   ```
2. **Start Frontend** (in a separate terminal):
   ```bash
   npm install
   npm run dev
   ```
3. **Register/Login Flow**:
   * Navigate to the app in your browser (usually `http://localhost:8080`).
   * Click **Register** and create a new Lawyer profile.
   * Click **Register New Case** in the Case Registry, and verify that the database generates a sequential case ID (e.g. `CF-2026-001`).
   * Log out, and register a new **Judge** profile.
   * Open the case row you created, and test applying a judicial order (change track to `Complex`, assign yourself as judge) or scheduling a trial hearing docket.
