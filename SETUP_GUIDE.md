# Leave Approval System - Complete Setup Guide

## Prerequisites

- Supabase account (free tier available)
- Vercel account (for deployment)
- Node.js 18+ (for local development)

## Step 1: Database Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in project details
4. Wait for project to initialize

### 1.2 Run Database Scripts

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy and paste the contents of `scripts/01-create-tables.sql`
4. Click "Run"
5. Repeat for `scripts/02-seed-data.sql`

### 1.3 Verify Tables

In Supabase Dashboard → Table Editor, you should see:
- departments
- users
- leave_types
- leave_records
- leave_requests
- audit_logs

## Step 2: Authentication Setup

### 2.1 Enable Email Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Ensure "Email" is enabled
3. Go to Settings → Email Templates
4. Customize email templates if needed

### 2.2 Create Test Users

1. Go to Authentication → Users
2. Click "Add user"
3. Create users:
   - employee@company.com / password123
   - manager@company.com / password123
   - coordinator@company.com / password123

### 2.3 Add User Records

1. Go to Table Editor → users table
2. Insert records for each user:

\`\`\`sql
INSERT INTO users (id, email, full_name, department_id, role, manager_id) VALUES
('user-id-1', 'employee@company.com', 'John Employee', 'dept-id-1', 'employee', 'user-id-2'),
('user-id-2', 'manager@company.com', 'Jane Manager', 'dept-id-1', 'manager', NULL),
('user-id-3', 'coordinator@company.com', 'Bob Coordinator', 'dept-id-1', 'coordinator', NULL);
\`\`\`

## Step 3: Environment Variables

### 3.1 Get Supabase Keys

1. Go to Supabase Dashboard → Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.2 Add to Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   \`\`\`

### 3.3 Local Development

Create `.env.local`:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
\`\`\`

## Step 4: Local Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Step 5: Test the System

### 5.1 Test Employee Flow

1. Go to http://localhost:3000/auth/login
2. Login as employee@company.com
3. Click "Request Leave"
4. Submit a leave request
5. View in "My Requests"

### 5.2 Test Manager Flow

1. Logout
2. Login as manager@company.com
3. Go to "Pending Approvals"
4. Approve or reject the request

### 5.3 Test Coordinator Flow

1. Logout
2. Login as coordinator@company.com
3. View "All Requests"
4. View "Leave Records"

## Step 6: Email Integration (Optional)

### 6.1 Choose Email Service

Options:
- **Resend** (recommended for Next.js)
- **SendGrid**
- **AWS SES**

### 6.2 Setup Resend (Example)

1. Go to https://resend.com
2. Create account and get API key
3. Add to environment variables:
   \`\`\`
   RESEND_API_KEY=your_key
   \`\`\`

### 6.3 Update Email Service

Edit `lib/email/send-email.ts`:

\`\`\`typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailNotification(
  to: string,
  subject: string,
  template: string,
  data: Record<string, any>
) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to,
      subject,
      html: generateEmailHTML(template, data),
    });
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
\`\`\`

## Step 7: Deployment

### 7.1 Deploy to Vercel

\`\`\`bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Deploy from Vercel
# Connect your GitHub repo to Vercel
# Vercel will auto-deploy on push
\`\`\`

### 7.2 Add Environment Variables to Vercel

1. Go to Vercel Dashboard → Project Settings
2. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - RESEND_API_KEY (if using email)

### 7.3 Verify Deployment

1. Visit your Vercel deployment URL
2. Test login and basic flows
3. Check Supabase logs for any errors

## Troubleshooting

### Issue: "Invalid login credentials"

**Solution**: Verify user exists in Supabase Auth and has corresponding record in users table.

### Issue: "Database connection error"

**Solution**: 
1. Check environment variables are correct
2. Verify Supabase project is active
3. Check network connectivity

### Issue: "Leave request not saving"

**Solution**:
1. Verify user has manager_id set
2. Check leave_type_id is valid
3. Review browser console for errors

### Issue: "Email not sending"

**Solution**:
1. Verify email service API key is correct
2. Check email address is valid
3. Review email service logs

## Next Steps

1. **Customize Branding**: Update colors and logos
2. **Add More Leave Types**: Insert in leave_types table
3. **Setup Email Templates**: Create professional email designs
4. **Add Reporting**: Create analytics dashboard
5. **Mobile App**: Build React Native version
6. **Integration**: Connect with HR systems

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Resend Docs: https://resend.com/docs

## Security Checklist

- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Set up proper database backups
- [ ] Enable HTTPS for all connections
- [ ] Implement rate limiting on API endpoints
- [ ] Add CSRF protection
- [ ] Sanitize all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable audit logging
- [ ] Regular security audits
- [ ] Keep dependencies updated
