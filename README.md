# Leave Approval System

A comprehensive full-stack platform for managing leave requests, approvals, and records across your organization with department-based access and email notifications.

## Features

- **Multiple Department Logins**: Role-based access for employees, managers, and coordinators
- **Leave Request Management**: Employees can submit leave requests with detailed information
- **Structured Approval Flow**: Managers review and approve/reject requests with comments
- **Leave Records Tracking**: Maintain leave balance per academic year for each employee
- **Email Notifications**: Automatic notifications to managers and coordinators
- **Dashboard Analytics**: View leave statistics and usage patterns
- **Audit Logging**: Track all actions for compliance and auditing

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Ready for integration with Resend, SendGrid, or AWS SES

## Project Structure

\`\`\`
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
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── email/
│       └── send-email.ts
├── scripts/
│   ├── 01-create-tables.sql
│   └── 02-seed-data.sql
└── middleware.ts
\`\`\`

## Database Schema

### Tables

1. **departments**: Store department information
2. **users**: User accounts with roles and department assignment
3. **leave_types**: Types of leave (Casual, Sick, Annual, etc.)
4. **leave_records**: Leave balance per user per academic year
5. **leave_requests**: Leave request submissions and approvals
6. **audit_logs**: Audit trail for all actions

## Setup Instructions

### 1. Database Setup

Run the SQL scripts in order:

\`\`\`bash
# Execute in Supabase SQL Editor
1. scripts/01-create-tables.sql
2. scripts/02-seed-data.sql
\`\`\`

### 2. Environment Variables

Add these to your Vercel project environment variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Create Test Users

Use Supabase Auth to create test users:

- **Employee**: employee@company.com / password123
- **Manager**: manager@company.com / password123
- **Coordinator**: coordinator@company.com / password123

Then insert corresponding records in the `users` table with appropriate roles and manager assignments.

## User Roles

### Employee
- Submit leave requests
- View personal leave balance
- Track request status
- View leave history

### Manager
- Review pending leave requests from team members
- Approve or reject requests
- View team leave calendar
- Add comments to requests

### Coordinator
- View all leave requests across organization
- View comprehensive leave records
- Generate reports
- Manage leave types and policies

### Admin
- Full system access
- User management
- System configuration

## API Endpoints

### Leave Requests
- `POST /api/leave-requests` - Create new leave request
- `POST /api/leave-requests/[id]/approve` - Approve request
- `POST /api/leave-requests/[id]/reject` - Reject request

## Email Notifications

The system is ready for email integration. To enable:

1. Choose an email service (Resend, SendGrid, AWS SES)
2. Add API keys to environment variables
3. Update `lib/email/send-email.ts` with actual implementation

Notifications are sent for:
- New leave request (to manager)
- Request approved (to employee)
- Request rejected (to employee)
- Approval completed (to coordinator)

## Features Implemented

✅ Database schema with all required tables
✅ Authentication system with Supabase
✅ Employee dashboard and leave request form
✅ Manager approval dashboard
✅ Coordinator dashboard with all requests
✅ Leave balance tracking per academic year
✅ Request history and status tracking
✅ Role-based access control
✅ Responsive UI with Tailwind CSS
✅ Email notification framework

## Features Ready for Enhancement

- Email service integration (Resend/SendGrid)
- Advanced filtering and search
- Leave calendar visualization
- Bulk leave import
- Leave policy management
- Attendance integration
- Mobile app
- Advanced reporting and analytics

## Deployment

Deploy to Vercel:

\`\`\`bash
# Push to GitHub
git push origin main

# Deploy from Vercel dashboard
# or use Vercel CLI
vercel deploy
\`\`\`

## Support

For issues or questions, please check:
1. Supabase documentation: https://supabase.com/docs
2. Next.js documentation: https://nextjs.org/docs
3. Tailwind CSS documentation: https://tailwindcss.com/docs

## License

MIT
