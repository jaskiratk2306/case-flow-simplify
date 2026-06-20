# Implementation Plan - Full-Stack Judiciary Case Flow Management System

This plan outlines the implementation of a full-stack system. Since the IDE's internal `brain` directory is restricted, this workspace file serves as our plan and progress log.

## Proposed Architecture

- **Backend**: Node.js & Express (JavaScript) running on Port `5000` (or `process.env.PORT`).
- **Database**: PostgreSQL hosted on Supabase or Neon, integrated via Prisma ORM.
- **Authentication**: JWT-based authentication with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `JUDGE` and `LAWYER` roles.
- **Frontend Integration**: Vite proxy configuration to redirect `/api` requests to the Node backend.

---

## 1. Backend Structure (in `c:/case-flow-simplify/server`)

We will create a self-contained Node.js app:
- `server/package.json`: Holds dependencies (`express`, `cors`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `@prisma/client`).
- `server/prisma/schema.prisma`: Relational database schema with models:
  - `User` (id, email, passwordHash, name, role [JUDGE, LAWYER])
  - `Case` (id, title, description, track [FAST, STANDARD, COMPLEX], status [PENDING, ACTIVE, RESOLVED], parties, filedDate, assignedJudgeId)
  - `Hearing` (id, caseId, hearingDate, purpose, notes)
- `server/src/server.js`: Core Express server entry.
- `server/src/controllers/auth.controller.js`: User login, registration, and profile route.
- `server/src/controllers/case.controller.js`: CRUD endpoints for cases, judge assignment, and track assignment.
- `server/src/middleware/auth.middleware.js`: JWT token verification and role restriction helper.

---

## 2. Frontend Connection

- **Vite Proxy**: Update `vite.config.ts` to include:
  ```typescript
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
  ```
- **Authentication State**: Add `AuthContext` to manage state, saving the JWT in `localStorage`.
- **Role-Based UI Rules**:
  - **Lawyer Dashboard**: Can register a new case, view their filed cases.
  - **Judge Dashboard**: Can view all cases, assign judges, update case status, and schedule hearings.
- **Connected Case Listing**: Modify `Cases.jsx` to perform `fetch('/api/cases')` and post requests to `/api/cases`.

---

## 3. Verification Plan

### Local Testing
1. Install backend dependencies and run database migrations.
2. Start Node server (`npm run dev` / `node src/server.js`).
3. Start Vite frontend (`npm run dev`).
4. Register a lawyer account, submit a case, verify it appears as `PENDING`.
5. Register a judge account, approve/assign the case to active, schedule a hearing.

### Production Deployment
1. Create a PostgreSQL instance on Neon or Supabase and get the connection string.
2. Deploy backend to Render, setting the database connection string and JWT secret in environment variables.
3. Deploy frontend to Vercel, pointing it to the Render API url (or proxy setup).
