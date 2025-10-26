-- Initialize leave records for all employees for current academic year (2024-2025)
INSERT INTO leave_records (user_id, leave_type_id, academic_year, total_days, used_days, pending_days)
SELECT 
  u.id,
  lt.id,
  '2024-2025',
  lt.days_per_year,
  0,
  0
FROM users u
CROSS JOIN leave_types lt
WHERE u.role = 'employee'
ON CONFLICT (user_id, leave_type_id, academic_year) DO NOTHING;
