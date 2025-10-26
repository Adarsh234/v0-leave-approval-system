-- Initialize leave records for all users for the current academic year (2025-2026)
INSERT INTO leave_records (user_id, leave_type_id, academic_year, total_days, used_days, pending_days)
SELECT 
  u.id,
  lt.id,
  '2025-2026' as academic_year,
  lt.days_per_year as total_days,
  0 as used_days,
  0 as pending_days
FROM users u
CROSS JOIN leave_types lt
WHERE NOT EXISTS (
  SELECT 1 FROM leave_records lr 
  WHERE lr.user_id = u.id 
  AND lr.leave_type_id = lt.id 
  AND lr.academic_year = '2025-2026'
)
ON CONFLICT DO NOTHING;

-- Verify the records were created
SELECT 
  u.full_name,
  lt.name as leave_type,
  lr.total_days,
  lr.used_days,
  lr.pending_days,
  lr.academic_year
FROM leave_records lr
JOIN users u ON lr.user_id = u.id
JOIN leave_types lt ON lr.leave_type_id = lt.id
ORDER BY u.full_name, lt.name;
