-- Update employee's manager_id to point to the manager
UPDATE users 
SET manager_id = (SELECT id FROM users WHERE email = 'manager@company.com')
WHERE email = 'employee@company.com';

-- Verify the update
SELECT id, email, full_name, manager_id FROM users WHERE role IN ('employee', 'manager');
