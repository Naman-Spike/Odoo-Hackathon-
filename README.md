# Dayflow HRMS 🚀

**Dayflow** is a modern, responsive Human Resource Management System (HRMS) built with React (Vite), TypeScript, Tailwind CSS, Node.js (Express), and SQLite with Prisma ORM.

---

## 👥 Engineering Team & Core Contributors

| Name | Role / Subsystem Area | GitHub Profile |
| :--- | :--- | :--- |
| **Naman** | Team Lead & Full-Stack Architect (Layout, Shell, Core Routing) | [@Naman-Spike](https://github.com/Naman-Spike) |
| **Vanshika** | Auth, Personnel Profiles & Compensation Ledger | [@Vanshika-01-M](https://github.com/Vanshika-01-M) |
| **Vaishnavi** | UI Kit, White Crystal Design System & Executive Dashboards | [@Vaishnavi1143](https://github.com/Vaishnavi1143) |
| **Varnit** | Attendance Telemetry & Leave Quota Management Engine | [@Varnit-T](https://github.com/Varnit-T) |

---

## 🌟 Key Features

### 1. 🔐 Authentication & Role-Based Access Control (RBAC)
- **Sign In / Sign Up**: JWT token-based authentication with bcrypt password hashing.
- **Dual Roles**: `ADMIN` (HR Manager) and `EMPLOYEE` (Standard Staff).
- **Session Persistence**: Persistent local authentication state with automatic token expiration handling and protected route guards.

### 2. 📊 Role-Tailored Dashboards
- **Employee Dashboard**:
  - Personalized time-of-day greeting.
  - Live check-in/out interactive timer widget with digital stopwatch telemetry.
  - Leave balance snapshot cards (Paid, Sick, Unpaid).
  - Monthly work hours and attendance tracking.
  - Recent activity feed and one-click quick navigation cards.
- **Admin / HR Dashboard**:
  - High-level KPIs: Total Headcount, Today's Attendance %, Pending Leave Requests, Monthly Payroll Summary.
  - Quick action buttons (Leave Approvals, Attendance, Payroll).
  - Real-time leave approvals queue & team status overview.

### 3. 👤 Employee Profile Management
- **Employee Portal**: View personal details & editable contact information (Phone, Address, Avatar URL).
- **Admin Portal**: Full directory of all employees with drill-down views and administrative editing permissions (Department, Designation, Joining Date, Role).

### 4. ⏰ Attendance Tracking Module
- **One-Click Check-In / Check-Out**:
  - Real-time running elapsed timer.
  - Automatic work hours calculation and half-day status detection (< 4 hours).
- **Calendar & Timecard Views**:
  - Color-coded monthly calendar view (Present, Absent, Half-day, Leave).
  - Detailed daily/weekly tabular logs with check-in/out timestamps, CSV export, and total hours.
  - Admin team-wide attendance overview with date filters.

### 5. 🌴 Leave Management & Approval Engine
- **Employee Application**: Type selector (`PAID`, `SICK`, `UNPAID`), date range picker with automatic day calculations, and reason notes.
- **Quota Validation**: Automatic annual quota tracking (12 Paid, 6 Sick, Unlimited Unpaid).
- **Admin Approvals**: Dedicated queue to review, approve, or reject requests with admin remarks.
- **Attendance Synchronization**: Approved leaves automatically populate attendance records for the date range (excluding weekends).

### 6. 💵 Payroll Management & Payslips
- **Employee View**: Itemized breakdown of Basic Salary, Allowances, Deductions, and Net Salary.
- **Printable Salary Slip**: Formal, print-ready payslip template with company branding and breakdown.
- **Admin Control**: Live employee payroll table with modal to update compensation structures and auto-calculate net pay.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router v6, Axios
- **Backend**: Node.js, Express, TypeScript, Zod, JWT (`jsonwebtoken`), `bcryptjs`, CORS
- **Database**: SQLite with Prisma ORM 6 (zero external setup required)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Fast 1-Command Launch
```bash
# In the root directory:
node start.js
```
*(Or double-click `start-dayflow.bat` on Windows)*

### 3. Manual Setup & Seeding
```bash
# Server setup
cd server
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev

# Client setup (in second terminal)
cd ../client
npm install
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 🔑 Pre-seeded Demo Accounts

| Role | Email | Password | Employee ID | Designation |
| :--- | :--- | :--- | :--- | :--- |
| **Admin / HR** | `admin@dayflow.com` | `Admin@123` | `EMP-001` | HR Manager |
| **Employee** | `employee@dayflow.com` | `User@123` | `EMP-002` | Software Developer |

---

## 📁 Project Structure

```
dayflow-hrms/
├── start.js                         # Unified single-command launcher
├── start-dayflow.bat                # Windows 1-click launcher
├── client/                          # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── api/                     # Axios API client with auth interceptor
│   │   ├── context/                 # AuthContext (state, login, logout, refresh)
│   │   ├── hooks/                   # useAuth, useApi custom hooks
│   │   ├── lib/                     # utils (date/currency formatters, helpers)
│   │   ├── components/
│   │   │   ├── layout/              # Sidebar, Topbar, AppLayout
│   │   │   ├── ui/                  # Button, Card, Badge, Modal, Input, Select, Table
│   │   │   ├── attendance/          # CheckInOutWidget, AttendanceCalendar, AttendanceTable
│   │   │   ├── leave/               # LeaveForm, LeaveList, LeaveApprovalCard
│   │   │   ├── payroll/             # SalaryBreakdown, SalarySlip
│   │   │   └── profile/             # ProfileView, ProfileEditForm
│   │   ├── pages/                   # All 9 core application pages
│   │   └── routes/                  # ProtectedRoute, AppRouter
│   └── package.json
│
├── server/                          # Express + TypeScript + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma            # Database models & relationships
│   │   └── seed.ts                  # Seed script with demo accounts
│   ├── src/
│   │   ├── controllers/             # Auth, Profile, Attendance, Leave, Payroll
│   │   ├── middleware/              # JWT auth guard & Zod validator
│   │   ├── routes/                  # Express route handlers
│   │   ├── schemas/                 # Zod validation schemas
│   │   ├── lib/prisma.ts            # Prisma client singleton
│   │   ├── config.ts                # Server configuration
│   │   └── index.ts                 # Express entrypoint
│   └── package.json
│
└── README.md
```
