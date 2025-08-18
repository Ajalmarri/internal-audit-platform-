const mysql = require('mysql2/promise');

async function setupRisks() {
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

    // Create risks table
    console.log('📋 Creating risks table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS risks (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        likelihood VARCHAR(20) NULL,
        impact VARCHAR(20) NULL,
        inherent_risk VARCHAR(20) NULL,
        status VARCHAR(50) DEFAULT 'Active',
        category VARCHAR(100) NULL,
        owner VARCHAR(100) NULL,
        mitigation_strategy TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ risks table created!');

    // Insert sample risks
    console.log('📝 Inserting sample risks...');
    const sampleRisks = [
      ['RISK001', 'Cybersecurity Breach', 'Risk of unauthorized access to sensitive data', 'High', 'High', 'High'],
      ['RISK002', 'Regulatory Non-Compliance', 'Failure to meet regulatory requirements', 'Medium', 'High', 'Medium'],
      ['RISK003', 'Operational Disruption', 'System downtime affecting business operations', 'Medium', 'Medium', 'Medium'],
      ['RISK004', 'Vendor Dependency', 'Over-reliance on third-party vendors', 'Low', 'High', 'Medium'],
      ['RISK005', 'Data Loss', 'Accidental or intentional data loss', 'Low', 'High', 'Medium'],
      ['RISK006', 'Financial Misstatement', 'Errors in financial reporting', 'Medium', 'High', 'High'],
      ['RISK007', 'Technology Obsolescence', 'Outdated technology infrastructure', 'High', 'Medium', 'Medium']
    ];

    for (const [id, title, description, likelihood, impact, inherentRisk] of sampleRisks) {
      try {
        await connection.query(
          'INSERT INTO risks (id, title, description, likelihood, impact, inherent_risk) VALUES (?, ?, ?, ?, ?, ?)',
          [id, title, description, likelihood, impact, inherentRisk]
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
    console.log('🔍 Verifying risks data...');
    const [rows] = await connection.query('SELECT * FROM risks');
    console.log('✅ Found', rows.length, 'risks:');
    rows.forEach(row => {
      console.log(`  - ${row.id}: ${row.title} (${row.likelihood}/${row.impact})`);
    });

    await connection.end();
    console.log('✅ Risks setup completed successfully!');

  } catch (error) {
    console.error('❌ Risks setup failed:', error.message);
  }
}

setupRisks();

