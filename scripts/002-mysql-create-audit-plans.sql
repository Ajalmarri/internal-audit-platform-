-- MySQL schema for audit_plans
CREATE TABLE IF NOT EXISTS audit_plans (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status VARCHAR(50) NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional sample data
INSERT INTO audit_plans (id, title, status, description)
VALUES
  ('AP001', 'Financial Statement Audit FY2024', 'Active', 'Annual audit of financial statements for fiscal year 2024.'),
  ('AP002', 'IT General Controls Review Q3 2024', 'Active', 'Quarterly review of IT general controls.'),
  ('AP003', 'Operational Efficiency Audit - Manufacturing', 'Draft', 'Audit to identify operational inefficiencies in the manufacturing department.'),
  ('AP004', 'Compliance Audit - GDPR Readiness', 'Completed', 'Assessment of GDPR compliance status.'),
  ('AP005', 'Cybersecurity Threat Assessment', 'Active', 'Ongoing assessment of cybersecurity threats and vulnerabilities.')
ON DUPLICATE KEY UPDATE
  title = VALUES(title);





