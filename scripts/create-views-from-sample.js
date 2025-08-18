const mysql = require('mysql2/promise')

async function createViews() {
  const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ahmed@123',
  }

  const statements = [
    `USE audit_platform`,
    // View for audit_plans expected by the app
    `CREATE OR REPLACE VIEW audit_plans AS
     SELECT 
       CAST(ap.ID AS CHAR) AS id,
       ap.PlanName AS title,
       aps.StatusName AS status,
       NULL AS description,
       NULL AS start_date,
       NULL AS end_date,
       ap.CreatedDate AS created_at,
       ap.ModifiedDate AS updated_at
     FROM AuditPlans ap
     LEFT JOIN AuditPlanStatuses aps ON aps.ID = ap.PlanStatusID
     WHERE IFNULL(ap.IsDeleted, 0) = 0`,
    // View for assignments expected by the app
    `CREATE OR REPLACE VIEW assignments AS
     SELECT 
       CAST(a.ID AS CHAR) AS id,
       a.AssignmentName AS title,
       ast.StatusName AS status,
       CAST(a.PlanID AS CHAR) AS audit_plan_id,
       a.AssignmentDueDate AS end_date,
       a.CreatedDate AS created_at,
       a.ModifiedDate AS updated_at,
       NULL AS description,
       NULL AS start_date
     FROM Assignments a
     LEFT JOIN AssignmentStatuses ast ON ast.ID = a.AssignmentStatusID
     WHERE IFNULL(a.IsDeleted, 0) = 0`,
    // View for findings expected by the app
    `CREATE OR REPLACE VIEW findings AS
     SELECT 
       CAST(f.ID AS CHAR) AS id,
       f.Title AS title,
       f.FindingDescription AS description,
       fs.FindingStatus AS status,
       s.Severity AS severity,
       CAST(f.AssignmentID AS CHAR) AS assignment_id,
       f.CreatedDate AS created_at,
       f.ModifiedDate AS updated_at
     FROM Findings f
     LEFT JOIN FindingStatuses fs ON fs.ID = f.FindingStatusID
     LEFT JOIN Severities s ON s.ID = f.SeverityID
     WHERE IFNULL(f.IsDeleted, 0) = 0`,
  ]

  try {
    console.log('🔌 Connecting to MySQL...')
    const connection = await mysql.createConnection(config)
    console.log('✅ Connected to MySQL successfully!')
    for (const stmt of statements) {
      console.log('🧱 Executing:', stmt.split('\n')[0].slice(0, 60), '...')
      await connection.query(stmt)
    }
    await connection.end()
    console.log('✅ Views created (audit_plans, assignments, findings)')
  } catch (error) {
    console.error('❌ Failed to create views:', error.message)
  }
}

createViews()






