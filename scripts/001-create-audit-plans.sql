-- Create the audit_plans table
CREATE TABLE IF NOT EXISTS audit_plans (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT, -- e.g., 'Draft', 'Active', 'Completed'
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Insert some sample data if the table is empty
-- You can run this part manually or ensure your table has data
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM audit_plans LIMIT 1) THEN
      INSERT INTO audit_plans (id, title, status, description) VALUES
        ('AP001', 'Financial Statement Audit FY2024', 'Active', 'Annual audit of financial statements for fiscal year 2024.'),
        ('AP002', 'IT General Controls Review Q3 2024', 'Active', 'Quarterly review of IT general controls.'),
        ('AP003', 'Operational Efficiency Audit - Manufacturing', 'Draft', 'Audit to identify operational inefficiencies in the manufacturing department.'),
        ('AP004', 'Compliance Audit - GDPR Readiness', 'Completed', 'Assessment of GDPR compliance status.'),
        ('AP005', 'Cybersecurity Threat Assessment', 'Active', 'Ongoing assessment of cybersecurity threats and vulnerabilities.');
   END IF;
END $$;
