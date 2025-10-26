-- Insert departments
INSERT INTO departments (name, code) VALUES
  ('Human Resources', 'HR'),
  ('Information Technology', 'IT'),
  ('Finance', 'FIN'),
  ('Operations', 'OPS'),
  ('Marketing', 'MKT')
ON CONFLICT DO NOTHING;

-- Insert leave types
INSERT INTO leave_types (name, description, days_per_year) VALUES
  ('Casual Leave', 'For personal reasons', 12),
  ('Sick Leave', 'For medical reasons', 10),
  ('Annual Leave', 'Planned vacation', 20),
  ('Maternity Leave', 'For new mothers', 90),
  ('Paternity Leave', 'For new fathers', 15)
ON CONFLICT DO NOTHING;
