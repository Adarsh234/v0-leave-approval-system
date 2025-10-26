# Quick Start Guide - Leave Approval System

## Step 1: Create Test Users in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** button
4. Create test users with these emails:
   - `employee@company.com` (password: `password123`)
   - `manager@company.com` (password: `password123`)
   - `coordinator@company.com` (password: `password123`)

## Step 2: Run Database Migrations

1. Go to Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `/scripts/01-create-tables.sql`
4. Run the query
5. Repeat for `/scripts/02-seed-data.sql`

## Step 3: Insert User Records

After creating Supabase Auth users, you need to add them to the `users` table:

\`\`\`sql
-- Get user IDs from Supabase Auth and insert into users table
INSERT INTO users (id, email, full_name, department_id, role, manager_id)
VALUES
  ('USER_ID_1', 'employee@company.com', 'John Employee', 2, 'employee', 'USER_ID_2'),
  ('USER_ID_2', 'manager@company.com', 'Jane Manager', 2, 'manager', NULL),
  ('USER_ID_3', 'coordinator@company.com', 'Admin Coordinator', 1, 'coordinator', NULL);
\`\`\`

Replace `USER_ID_1`, `USER_ID_2`, `USER_ID_3` with actual user IDs from Supabase Auth.

## Step 4: Login

Use the credentials you created:
- Email: `employee@company.com`
- Password: `password123`

## Troubleshooting

**Error: "Invalid login credentials"**
- Make sure the user exists in Supabase Authentication
- Check that the email and password are correct
- Verify environment variables are set in Vars section

**Error: "User not found in users table"**
- You need to insert the user into the `users` table after creating them in Auth
- See Step 3 above

**Still having issues?**
- Check browser console for detailed error messages
- Verify all Supabase environment variables are correctly set
