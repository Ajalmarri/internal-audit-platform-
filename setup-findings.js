const mysql = require('mysql2/promise');

async function setupFindings() {
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

    // Create findings table
    console.log('📋 Creating findings table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS findings (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        status VARCHAR(50) NULL,
        severity VARCHAR(20) DEFAULT 'Medium',
        assignment_id VARCHAR(64) NULL,
        risk_level VARCHAR(20) NULL,
        remediation_plan TEXT NULL,
        due_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ findings table created!');

    // Insert sample findings
    console.log('📝 Inserting sample findings...');
    const sampleFindings = [
      ['FND001', 'Weak Password Policy', 'Password policy does not meet security standards', 'Open', 'High', 'ASGN001'],
      ['FND002', 'Missing MFA Implementation', 'Multi-factor authentication not implemented for critical systems', 'In Progress', 'High', 'ASGN002'],
      ['FND003', 'Inadequate Backup Procedures', 'Backup procedures need improvement', 'Open', 'Medium', 'ASGN003'],
      ['FND004', 'Vendor Risk Assessment Gap', 'Incomplete vendor risk assessment process', 'In Progress', 'Medium', 'ASGN004'],
      ['FND005', 'Compliance Documentation Issues', 'Missing required compliance documentation', 'Open', 'Low', 'ASGN005'],
      ['FND006', 'Network Security Weaknesses', 'Network security controls need strengthening', 'In Progress', 'High', 'ASGN006'],
      ['FND007', 'Process Inefficiencies', 'Operational processes need optimization', 'Open', 'Medium', 'ASGN007']
    ];

    for (const [id, title, description, status, severity, assignmentId] of sampleFindings) {
      try {
        await connection.query(
          'INSERT INTO findings (id, title, description, status, severity, assignment_id) VALUES (?, ?, ?, ?, ?, ?)',
          [id, title, description, status, severity, assignmentId]
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
    console.log('🔍 Verifying findings data...');
    const [rows] = await connection.query('SELECT * FROM findings');
    console.log('✅ Found', rows.length, 'findings:');
    rows.forEach(row => {
      console.log(`  - ${row.id}: ${row.title} (${row.status}, ${row.severity})`);
    });

    await connection.end();
    console.log('✅ Findings setup completed successfully!');

  } catch (error) {
    console.error('❌ Findings setup failed:', error.message);
  }
}

setupFindings();
