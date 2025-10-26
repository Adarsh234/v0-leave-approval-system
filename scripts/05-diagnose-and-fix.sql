-- Check if leave requests exist
SELECT 'Leave Requests Count' as check_name, COUNT(*) as count FROM leave_requests;

-- Check employee user record
SELECT id, email, full_name, manager_id, role FROM users WHERE email = 'employee@company.com';

-- Check manager user record
SELECT id, email, full_name, role FROM users WHERE email = 'manager@company.com';

-- If employee has no manager_id, update it
UPDATE users 
SET manager_id = (SELECT id FROM users WHERE email = 'manager@company.com')
WHERE email = 'employee@company.com' AND manager_id IS NULL;

-- Verify the update
SELECT id, email, full_name, manager_id, role FROM users WHERE email = 'employee@company.com';

-- Check all leave requests with their manager info
SELECT 
  lr.id,
  lr.user_id,
  u.email as employee_email,
  lr.manager_id,
  m.email as manager_email,
  lr.status,
  lr.start_date,
  lr.end_date
FROM leave_requests lr
LEFT JOIN users u ON lr.user_id = u.id
LEFT JOIN users m ON lr.manager_id = m.id;
