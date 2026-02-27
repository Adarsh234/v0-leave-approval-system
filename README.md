---

# 🌐 Leave Approval System

![GitHub language count](https://img.shields.io/github/languages/count/Adarsh234/v0-leave-approval-system)
![GitHub top language](https://img.shields.io/github/languages/top/Adarsh234/v0-leave-approval-system)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript) 
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)
![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![GitHub last commit](https://img.shields.io/github/last-commit/Adarsh234/v0-leave-approval-system)
![License](https://img.shields.io/badge/license-MIT-blue)

A **comprehensive full-stack platform** for managing leave requests, approvals, and records across your organization — complete with **department-based access**, **email notifications**, and **dashboard analytics**.

---

## ✨ Key Features

* 🔐 **Role-Based Access Control (RBAC):** Separate logins for Employees, Managers, Coordinators, and Admins.
* 📝 **Leave Request Management:** Employees can submit detailed leave requests with reasons and duration.
* ✅ **Structured Approval Flow:** Managers can review, approve, or reject requests with comments.
* 📊 **Dashboard Analytics:** Track leave trends, balances, and approvals across departments.
* 📂 **Leave Balance Tracking:** Maintain annual leave records for every employee.
* 📧 **Email Notifications:** Automatic alerts for new requests, approvals, and rejections.
* 🕵️ **Audit Logging:** Track all system actions for compliance and transparency.
* 📱 **Responsive Design:** Tailored for desktop and mobile with Tailwind CSS.

---

## 🧩 Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| **Frontend**       | Next.js 16, React 19, TypeScript, Tailwind CSS  |
| **Backend**        | Next.js API Routes, Server Actions              |
| **Database**       | Supabase (PostgreSQL)                           |
| **Authentication** | Supabase Auth                                   |
| **Email**          | Resend / SendGrid / AWS SES (Integration Ready) |

---

## 📁 Project Structure

```bash
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── error/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── request-leave/
│   │   ├── my-requests/
│   │   ├── leave-balance/
│   │   ├── approvals/
│   │   ├── team-leaves/
│   │   ├── all-requests/
│   │   └── leave-records/
│   ├── api/
│   │   └── leave-requests/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── email/
│       └── send-email.ts
│
├── scripts/
│   ├── 01-create-tables.sql
│   └── 02-seed-data.sql
│
└── middleware.ts
```

---

## 🗃️ Database Schema

### **Tables**

| Table            | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `departments`    | Department details (e.g., HR, IT, Finance)                 |
| `users`          | User accounts with role and department mapping             |
| `leave_types`    | List of available leave types (Casual, Sick, Annual, etc.) |
| `leave_records`  | Tracks leave balance per user per academic year            |
| `leave_requests` | Stores leave requests and approval statuses                |
| `audit_logs`     | Logs all critical user actions for compliance              |

---

## ⚙️ Setup Instructions

### **1️⃣ Database Setup**

Run SQL scripts in Supabase SQL Editor:

```bash
scripts/01-create-tables.sql
scripts/02-seed-data.sql
```

### **2️⃣ Environment Variables**

Add these in your **Vercel** project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **3️⃣ Create Test Users**

Use **Supabase Auth** to create sample users:

| Role        | Email                                                     | Password    |
| ----------- | --------------------------------------------------------- | ----------- |
| Employee    | [employee@company.com](mailto:employee@company.com)       | password123 |
| Manager     | [manager@company.com](mailto:manager@company.com)         | password123 |
| Coordinator | [coordinator@company.com](mailto:coordinator@company.com) | password123 |

Then, insert corresponding records into the `users` table with roles and department assignments.

---

## 👥 User Roles & Permissions

### **Employee**

* Submit leave requests
* Track approval status
* View personal leave history
* Check remaining leave balance

### **Manager**

* Review and approve/reject team leave requests
* Add approval comments
* View team leave calendar

### **Coordinator**

* View all requests organization-wide
* Manage leave records and policies
* Generate summary reports

### **Admin**

* Full system access
* Manage users, roles, and configurations

---

## 🧠 API Endpoints

| Method | Endpoint                           | Description              |
| ------ | ---------------------------------- | ------------------------ |
| `POST` | `/api/leave-requests`              | Create new leave request |
| `POST` | `/api/leave-requests/[id]/approve` | Approve a leave request  |
| `POST` | `/api/leave-requests/[id]/reject`  | Reject a leave request   |

---

## 📬 Email Notifications

The system supports email notification integration.
To enable, choose your preferred service and configure credentials.

### **Supported Providers**

* [Resend](https://resend.com)
* [SendGrid](https://sendgrid.com)
* [AWS SES](https://aws.amazon.com/ses)

### **Configuration**

Add your API key in environment variables and update:

```
lib/email/send-email.ts
```

### **Triggers**

* New leave request → sent to **Manager**
* Request approved/rejected → sent to **Employee**
* Final approval → sent to **Coordinator**

---

## ✅ Implemented Features

* [x] Complete Database Schema
* [x] Supabase Authentication System
* [x] Employee Dashboard with Request Form
* [x] Manager Approval Dashboard
* [x] Coordinator Dashboard with Global Access
* [x] Leave Balance & Tracking System
* [x] Request History & Status Tracking
* [x] Role-Based Access Control (RBAC)
* [x] Responsive UI (Tailwind CSS)
* [x] Email Notification Framework

---

## 🚀 Features Ready for Enhancement

* [ ] Email service integration (Resend / SendGrid)
* [ ] Advanced filtering & search
* [ ] Leave calendar visualization
* [ ] Bulk leave import support
* [ ] Leave policy customization
* [ ] Attendance system integration
* [ ] Mobile application (React Native)
* [ ] Advanced analytics & reporting

---

## 🌍 Deployment Guide

### Deploy with Vercel

```bash
# Push project to GitHub
git push origin main

# Deploy via Vercel Dashboard or CLI
vercel deploy
```

---

## 🧰 Support & Documentation

For further assistance, refer to:

* [Supabase Docs](https://supabase.com/docs)
* [Next.js Docs](https://nextjs.org/docs)
* [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🪪 License

This project is licensed under the **MIT License**.
You’re free to use, modify, and distribute it with attribution.

---

## 💡 Author

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Adarsh234">Adarsh234</a></sub>
</div>
