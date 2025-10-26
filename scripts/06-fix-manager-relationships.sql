-- First, let's check the current state of users
SELECT id, email, full_name, manager_id FROM users;

-- Update the employee to have the manager as their manager
UPDATE users 
SET manager_id = (SELECT id FROM users WHERE email = 'manager@company.com')
WHERE email = 'employee@company.com';

-- Verify the update
SELECT id, email, full_name, manager_id FROM users WHERE email = 'employee@company.com';

-- Check if there are any leave requests
SELECT id, user_id, manager_id, status FROM leave_requests;

-- If there are leave requests with NULL manager_id, update them
UPDATE leave_requests 
SET manager_id = (
  SELECT manager_id FROM users WHERE id = leave_requests.user_id
)
WHERE manager_id IS NULL;

-- Verify the leave requests are updated
SELECT id, user_id, manager_id, status FROM leave_requests;
