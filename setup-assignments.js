const mysql = require('mysql2/promise');

async function setupAssignments() {
  const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ahmed@123'
  };

  try {
    console.log('🔌 Connecting to MySQL...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully!');

    // Use the audit_platform database
    await connection.query('USE audit_platform');
    console.log('✅ Using audit_platform database');

    // Create assignments table
    console.log('📋 Creating assignments table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        status VARCHAR(50) NULL,
        audit_plan_id VARCHAR(64) NULL,
        assignee_id VARCHAR(64) NULL,
        start_date DATE NULL,
        end_date DATE NULL,
        priority VARCHAR(20) DEFAULT 'Medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (audit_plan_id) REFERENCES audit_plans(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ assignments table created!');

    // Insert sample assignments
    console.log('📝 Inserting sample assignments...');
    const sampleAssignments = [
      ['ASGN001', 'User Access Review Q1 2024', 'Review and validate user access controls for Q1 2024', 'In Progress', 'AP001'],
      ['ASGN002', 'IT General Controls Review', 'Comprehensive review of IT general controls', 'Not Started', 'AP002'],
      ['ASGN003', 'Vendor Risk Assessment', 'Assessment of third-party vendor risks', 'In Progress', 'AP003'],
      ['ASGN004', 'Q3 Compliance Check', 'Quarterly compliance verification', 'Not Started', 'AP004'],
      ['ASGN005', 'Annual Financial Statement Audit', 'Annual audit of financial statements', 'Completed', 'AP005'],
      ['ASGN006', 'Cybersecurity Audit', 'Comprehensive cybersecurity assessment', 'In Progress', 'AP005'],
      ['ASGN007', 'Operational Efficiency Audit', 'Review of operational processes', 'Completed', 'AP003']
    ];

    for (const [id, title, description, status, auditPlanId] of sampleAssignments) {
      try {
        await connection.query(
          'INSERT INTO assignments (id, title, description, status, audit_plan_id) VALUES (?, ?, ?, ?, ?)',
          [id, title, description, status, auditPlanId]
        );
        console.log(`✅ Inserted: ${title}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Skipped (already exists): ${title}`);
        } else {
          console.error(`❌ Failed to insert ${title}:`, error.message);
        }
      }
    }

    // Verify the data
    console.log('🔍 Verifying assignments data...');
    const [rows] = await connection.query('SELECT * FROM assignments');
    console.log('✅ Found', rows.length, 'assignments:');
    rows.forEach(row => {
      console.log(`  - ${row.id}: ${row.title} (${row.status})`);
    });

    await connection.end();
    console.log('✅ Assignments setup completed successfully!');

  } catch (error) {
    console.error('❌ Assignments setup failed:', error.message);
  }
}

setupAssignments();
