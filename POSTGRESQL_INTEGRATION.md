# PostgreSQL Database Integration

## ✅ PostgreSQL Integration Completed

The Internal Audit Platform now includes a fully functional PostgreSQL database for persistent data storage.

## 🗄️ Database Schema

### Core Tables

#### 1. **audit_plans**
```sql
CREATE TABLE audit_plans (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **assignments**
```sql
CREATE TABLE assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    assigned_to VARCHAR(100),
    due_date DATE,
    audit_plan_id VARCHAR(50) REFERENCES audit_plans(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **findings**
```sql
CREATE TABLE findings (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    assignment_id VARCHAR(50) REFERENCES assignments(id),
    responsible_party VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **evidence**
```sql
CREATE TABLE evidence (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    assignment_id VARCHAR(50) REFERENCES assignments(id),
    finding_id VARCHAR(50) REFERENCES findings(id),
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. **reports**
```sql
CREATE TABLE reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    file_path VARCHAR(500),
    file_size BIGINT,
    generated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Database Configuration

### Environment Variables
```env
# Database connection
DATABASE_URL=postgresql://audit_user:audit_password@postgres:5432/audit_platform

# File storage
UPLOAD_DIR=./uploads
```

### Docker Compose Configuration
```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: audit_platform
      POSTGRES_USER: audit_user
      POSTGRES_PASSWORD: audit_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/001-create-audit-plans.sql:/docker-entrypoint-initdb.d/001-create-audit-plans.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U audit_user -d audit_platform"]
      interval: 10s
      timeout: 5s
      retries: 5
```

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended)
```bash
# Start with database
docker-compose up -d

# Development with hot reloading
docker-compose -f docker-compose.dev.yml up
```

### Option 2: Local Development
```bash
# Install dependencies
npm install

# Set environment variables
export DATABASE_URL="postgresql://audit_user:audit_password@localhost:5432/audit_platform"

# Start development server
npm run dev
```

## 📊 API Endpoints

### Audit Plans
- `GET /api/audit-plans` - List all audit plans
- `POST /api/audit-plans` - Create new audit plan

### Assignments
- `GET /api/assignments` - List all assignments
- `POST /api/assignments` - Create new assignment

### Findings
- `GET /api/findings` - List all findings
- `POST /api/findings` - Create new finding

### Evidence
- `GET /api/evidence` - List evidence with filtering
- `POST /api/evidence` - Create evidence record

### File Management
- `POST /api/files/upload` - Upload files with database metadata
- `GET /api/files/[category]/[entityId]/[filename]` - Download files

### Reports
- `POST /api/reports/generate` - Generate reports with database storage

## 🔍 Sample Data

The database is pre-populated with sample data:

### Audit Plans
- Q1 2024 Financial Controls Audit
- IT Security Assessment 2024
- Vendor Management Review
- Compliance Framework Audit
- Operational Risk Assessment

### Assignments
- User Access Review Q1
- Data Backup Verification
- Firewall Configuration Audit
- Vendor Security Assessment
- Incident Response Plan Test

### Findings
- Weak Password Policy
- Inadequate Backup Testing
- Outdated Firewall Rules
- Missing Access Reviews
- Vendor Security Gaps

## 🛠️ Database Utilities

### Connection Pool
```typescript
import { getPool, query, queryOne, execute, withTransaction } from '@/lib/database'

// Simple query
const auditPlans = await query<AuditPlan>('SELECT * FROM audit_plans')

// Single record
const plan = await queryOne<AuditPlan>('SELECT * FROM audit_plans WHERE id = $1', [id])

// Transaction
await withTransaction(async (client) => {
  await client.query('INSERT INTO audit_plans ...')
  await client.query('UPDATE assignments ...')
})
```

### Type Safety
```typescript
import type { AuditPlan, Assignment, Finding, Evidence, Report } from '@/lib/database'

interface AuditPlan {
  id: string
  title: string
  description?: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  start_date?: Date
  end_date?: Date
  created_at: Date
  updated_at: Date
}
```

## 📈 Performance Features

### Indexes
- `idx_audit_plans_status` - Fast status filtering
- `idx_assignments_status` - Assignment status queries
- `idx_assignments_audit_plan_id` - Foreign key lookups
- `idx_findings_severity` - Severity-based filtering
- `idx_findings_status` - Status-based filtering
- `idx_evidence_assignment_id` - Evidence assignment lookups

### Connection Pooling
- Maximum 20 connections
- 30-second idle timeout
- 2-second connection timeout
- Automatic connection management

## 🔒 Security Features

### Data Validation
- Input sanitization for all database queries
- Parameterized queries to prevent SQL injection
- Type checking for all database operations

### File Security
- File type validation
- File size limits (10MB)
- Secure file storage with proper permissions
- Database metadata tracking

## 📊 Monitoring

### Health Checks
```bash
# Database health
docker-compose exec postgres pg_isready -U audit_user -d audit_platform

# Application health
curl http://localhost:3000/api/health
```

### Logging
- Database connection errors
- Query performance monitoring
- File upload tracking
- Error handling and reporting

## 🔄 Migration from Mock Data

### Before (Mock Data)
```typescript
const mockAuditPlans = [
  { id: "AP001", title: "Q1 2024 Financial Controls Audit" },
  // ...
]
```

### After (Database)
```typescript
const auditPlans = await query<AuditPlan>(`
  SELECT id, title, description, status, start_date, end_date, created_at, updated_at
  FROM audit_plans 
  ORDER BY created_at DESC
`)
```

## 🎯 Benefits

1. **Data Persistence**: All data is now stored permanently
2. **Scalability**: Database can handle large datasets
3. **Relationships**: Proper foreign key relationships between entities
4. **Performance**: Indexed queries for fast data retrieval
5. **Type Safety**: Full TypeScript support for database operations
6. **Backup**: Easy database backup and restore procedures
7. **Monitoring**: Built-in health checks and logging

## 🚀 Next Steps

1. **Authentication**: Add user authentication and authorization
2. **Audit Logging**: Implement comprehensive audit trails
3. **Backup Strategy**: Set up automated database backups
4. **Performance Tuning**: Monitor and optimize query performance
5. **Data Migration**: Tools for migrating existing data
6. **Advanced Queries**: Complex reporting and analytics queries

---

**Status**: ✅ **PostgreSQL Integration Complete**

The Internal Audit Platform now has a fully functional PostgreSQL database with proper schema, relationships, and API endpoints for all core functionality. 