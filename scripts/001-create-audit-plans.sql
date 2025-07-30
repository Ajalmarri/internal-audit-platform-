-- Create audit_plans table
CREATE TABLE IF NOT EXISTS audit_plans (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assigned_to VARCHAR(100),
    due_date DATE,
    audit_plan_id VARCHAR(50) REFERENCES audit_plans(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create findings table
CREATE TABLE IF NOT EXISTS findings (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assignment_id VARCHAR(50) REFERENCES assignments(id) ON DELETE SET NULL,
    responsible_party VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create evidence table
CREATE TABLE IF NOT EXISTS evidence (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    assignment_id VARCHAR(50) REFERENCES assignments(id) ON DELETE SET NULL,
    finding_id VARCHAR(50) REFERENCES findings(id) ON DELETE SET NULL,
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'archived')),
    file_path VARCHAR(500),
    file_size BIGINT,
    generated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_plans_status ON audit_plans(status);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_audit_plan_id ON assignments(audit_plan_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity);
CREATE INDEX IF NOT EXISTS idx_findings_status ON findings(status);
CREATE INDEX IF NOT EXISTS idx_findings_assignment_id ON findings(assignment_id);
CREATE INDEX IF NOT EXISTS idx_evidence_assignment_id ON evidence(assignment_id);
CREATE INDEX IF NOT EXISTS idx_evidence_finding_id ON evidence(finding_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Insert sample data
INSERT INTO audit_plans (id, title, description, status, start_date, end_date) VALUES
('AP001', 'Q1 2024 Financial Controls Audit', 'Comprehensive review of financial controls and procedures', 'active', '2024-01-01', '2024-03-31'),
('AP002', 'IT Security Assessment 2024', 'Annual IT security and infrastructure audit', 'active', '2024-01-15', '2024-06-30'),
('AP003', 'Vendor Management Review', 'Assessment of vendor relationships and compliance', 'draft', '2024-02-01', '2024-05-31'),
('AP004', 'Compliance Framework Audit', 'Review of regulatory compliance framework', 'completed', '2023-10-01', '2023-12-31'),
('AP005', 'Operational Risk Assessment', 'Evaluation of operational risks and controls', 'active', '2024-01-01', '2024-12-31')
ON CONFLICT (id) DO NOTHING;

INSERT INTO assignments (id, title, description, status, priority, assigned_to, due_date, audit_plan_id) VALUES
('ASGN-001', 'User Access Review Q1', 'Review user access controls and permissions', 'in_progress', 'high', 'John Smith', '2024-03-15', 'AP001'),
('ASGN-002', 'Data Backup Verification', 'Verify data backup procedures and recovery testing', 'pending', 'medium', 'Sarah Johnson', '2024-03-30', 'AP001'),
('ASGN-003', 'Firewall Configuration Audit', 'Review firewall rules and network security', 'completed', 'critical', 'Mike Wilson', '2024-02-28', 'AP002'),
('ASGN-004', 'Vendor Security Assessment', 'Security assessment of cloud service providers', 'in_progress', 'high', 'Lisa Brown', '2024-04-15', 'AP003'),
('ASGN-005', 'Incident Response Plan Test', 'Test incident response procedures', 'pending', 'medium', 'David Lee', '2024-03-20', 'AP002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO findings (id, title, description, severity, status, assignment_id, responsible_party) VALUES
('FND-001', 'Weak Password Policy', 'Password policy does not meet security requirements', 'high', 'open', 'ASGN-001', 'IT Security Team'),
('FND-002', 'Inadequate Backup Testing', 'Backup recovery testing not performed quarterly', 'medium', 'in_progress', 'ASGN-002', 'System Administration'),
('FND-003', 'Outdated Firewall Rules', 'Firewall rules contain outdated entries', 'critical', 'resolved', 'ASGN-003', 'Network Security Team'),
('FND-004', 'Missing Access Reviews', 'Quarterly access reviews not completed', 'high', 'open', 'ASGN-001', 'HR Department'),
('FND-005', 'Vendor Security Gaps', 'Vendor security assessments incomplete', 'medium', 'in_progress', 'ASGN-004', 'Procurement Team')
ON CONFLICT (id) DO NOTHING;
