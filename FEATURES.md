# Leave Approval System - Feature Documentation

## Implemented Features

### 1. Authentication & Authorization ✅

- **Multi-role authentication**: Employee, Manager, Coordinator, Admin
- **Department-based access**: Users assigned to departments
- **Supabase Auth integration**: Secure email/password authentication
- **Session management**: Automatic token refresh via middleware
- **Protected routes**: Role-based access control on all pages

### 2. Leave Request Management ✅

- **Request submission**: Employees can submit leave requests
- **Leave types**: Support for multiple leave types (Casual, Sick, Annual, etc.)
- **Date selection**: Start and end date with validation
- **Reason field**: Detailed reason for leave request
- **Status tracking**: Pending, Approved, Rejected, Cancelled states

### 3. Approval Workflow ✅

- **Manager dashboard**: View pending requests from team members
- **Approve/Reject**: Managers can approve or reject requests
- **Comments**: Add comments during approval process
- **Timestamp tracking**: Record when requests are reviewed
- **Audit trail**: All actions logged for compliance

### 4. Leave Records & Balance ✅

- **Academic year tracking**: Maintain records per academic year
- **Balance calculation**: Track total, used, and available days
- **Multiple leave types**: Different balance for each leave type
- **Historical records**: View past leave usage
- **Real-time updates**: Balance updates when requests are approved

### 5. Dashboard & Analytics ✅

- **Employee dashboard**: Personal leave balance and request status
- **Manager dashboard**: Team leave calendar and pending approvals
- **Coordinator dashboard**: Organization-wide view of all requests
- **Statistics**: Leave usage statistics and trends
- **Filters**: Filter by status, date range, department

### 6. User Management ✅

- **Department assignment**: Users assigned to departments
- **Manager assignment**: Employees linked to managers
- **Role management**: Different roles with different permissions
- **User profiles**: View user information and department

### 7. Email Notifications Framework ✅

- **Notification templates**: Ready for integration
- **Manager notifications**: When new requests are submitted
- **Employee notifications**: When requests are approved/rejected
- **Coordinator notifications**: When requests are approved
- **Customizable templates**: Email templates ready for customization

### 8. Database & Data Management ✅

- **Relational schema**: Properly normalized database design
- **Indexes**: Performance optimization with indexes
- **Constraints**: Data integrity with foreign keys and constraints
- **Audit logging**: Track all changes for compliance
- **Backup ready**: Supabase automatic backups

### 9. User Interface ✅

- **Responsive design**: Works on desktop, tablet, mobile
- **Dark theme**: Professional dark UI with Tailwind CSS
- **Intuitive navigation**: Clear sidebar navigation
- **Form validation**: Client-side validation
- **Error handling**: User-friendly error messages
- **Loading states**: Visual feedback during operations

### 10. Security ✅

- **Authentication**: Supabase Auth with secure tokens
- **Authorization**: Role-based access control
- **HTTPS**: Secure communication
- **Environment variables**: Secrets management
- **SQL injection prevention**: Parameterized queries
- **CSRF protection**: Built-in Next.js protection

## Feature Roadmap

### Phase 2 (Ready to Implement)

- [ ] Email service integration (Resend/SendGrid)
- [ ] Leave calendar visualization
- [ ] Bulk leave import/export
- [ ] Advanced search and filtering
- [ ] Leave policy management
- [ ] Attendance integration
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Delegation of approvals
- [ ] Leave balance adjustment

### Phase 3 (Future Enhancements)

- [ ] Integration with payroll systems
- [ ] Biometric attendance sync
- [ ] AI-powered leave recommendations
- [ ] Multi-language support
- [ ] Custom workflows
- [ ] API for third-party integrations
- [ ] Mobile push notifications
- [ ] Real-time notifications
- [ ] Leave forecasting
- [ ] Compliance reporting

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/signup` - User registration

### Leave Requests
- `GET /api/leave-requests` - Get all requests (filtered by role)
- `POST /api/leave-requests` - Create new request
- `GET /api/leave-requests/[id]` - Get request details
- `POST /api/leave-requests/[id]/approve` - Approve request
- `POST /api/leave-requests/[id]/reject` - Reject request

### Leave Records
- `GET /api/leave-records` - Get leave records
- `GET /api/leave-records/[userId]` - Get user's leave records
- `POST /api/leave-records` - Create leave record

### Users
- `GET /api/users` - Get users (admin only)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/[id]` - Get department details

## Database Tables

### departments
- id (UUID, PK)
- name (VARCHAR)
- code (VARCHAR)
- created_at (TIMESTAMP)

### users
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- full_name (VARCHAR)
- department_id (UUID, FK)
- role (VARCHAR)
- manager_id (UUID, FK)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### leave_types
- id (UUID, PK)
- name (VARCHAR, UNIQUE)
- description (TEXT)
- days_per_year (INT)
- created_at (TIMESTAMP)

### leave_records
- id (UUID, PK)
- user_id (UUID, FK)
- leave_type_id (UUID, FK)
- academic_year (VARCHAR)
- total_days (INT)
- used_days (INT)
- pending_days (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### leave_requests
- id (UUID, PK)
- user_id (UUID, FK)
- leave_type_id (UUID, FK)
- start_date (DATE)
- end_date (DATE)
- reason (TEXT)
- status (VARCHAR)
- manager_id (UUID, FK)
- manager_comment (TEXT)
- coordinator_id (UUID, FK)
- coordinator_comment (TEXT)
- requested_at (TIMESTAMP)
- manager_reviewed_at (TIMESTAMP)
- coordinator_reviewed_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### audit_logs
- id (UUID, PK)
- user_id (UUID, FK)
- action (VARCHAR)
- entity_type (VARCHAR)
- entity_id (UUID)
- details (JSONB)
- created_at (TIMESTAMP)

## Configuration

### Environment Variables

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for admin operations)
RESEND_API_KEY=your_resend_key (optional, for email)
\`\`\`

### Leave Types (Configurable)

Default leave types:
- Casual Leave (12 days/year)
- Sick Leave (10 days/year)
- Annual Leave (20 days/year)
- Maternity Leave (90 days)
- Paternity Leave (15 days)

### Academic Year Format

Format: "YYYY-YYYY" (e.g., "2024-2025")

## Performance Considerations

- Database indexes on frequently queried columns
- Pagination for large datasets
- Caching of user roles and permissions
- Optimized queries with proper joins
- Image optimization for UI assets

## Compliance & Security

- GDPR compliant data handling
- Audit logging for all actions
- Role-based access control
- Data encryption in transit (HTTPS)
- Regular security updates
- Backup and disaster recovery

## Support & Maintenance

- Regular dependency updates
- Security patches
- Bug fixes
- Performance optimization
- User support documentation
- Admin documentation
