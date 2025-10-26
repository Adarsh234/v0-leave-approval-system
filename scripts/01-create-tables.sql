-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table with department and role
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  department_id UUID NOT NULL REFERENCES departments(id),
  role VARCHAR(50) NOT NULL CHECK (role IN ('employee', 'manager', 'coordinator', 'admin')),
  manager_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leave types table
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  days_per_year INT NOT NULL DEFAULT 20,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leave records table (per academic year)
CREATE TABLE IF NOT EXISTS leave_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  leave_type_id UUID NOT NULL REFERENCES leave_types(id),
  academic_year VARCHAR(9) NOT NULL, -- e.g., "2024-2025"
  total_days INT NOT NULL,
  used_days INT DEFAULT 0,
  pending_days INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, leave_type_id, academic_year)
);

-- Create leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  leave_type_id UUID NOT NULL REFERENCES leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  manager_id UUID REFERENCES users(id),
  manager_comment TEXT,
  coordinator_id UUID REFERENCES users(id),
  coordinator_comment TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  manager_reviewed_at TIMESTAMP,
  coordinator_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_manager ON users(manager_id);
CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_records_user ON leave_records(user_id);
CREATE INDEX idx_leave_records_year ON leave_records(academic_year);
