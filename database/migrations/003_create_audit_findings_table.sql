CREATE TABLE IF NOT EXISTS audit_findings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    audit_plan_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('low', 'medium', high', 'critical') NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    category VARCHAR(100),
    recommendation TEXT,
    management_response TEXT,
    due_date DATE,
    resolved_date DATE NULL,
    created_by INT NOT NULL,
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (audit_plan_id) REFERENCES audit_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_audit_plan (audit_plan_id),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_created_by (created_by),
    INDEX idx_assigned_to (assigned_to)
);
