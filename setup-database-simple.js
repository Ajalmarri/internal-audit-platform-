const mysql = require('mysql2/promise');

async function setupDatabase() {
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

    // Create database
    console.log('📦 Creating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS audit_platform');
    console.log('✅ Database created/verified!');

    // Use the database
    await connection.query('USE audit_platform');
    console.log('✅ Using audit_platform database');

    // Create audit_plans table
    console.log('📋 Creating audit_plans table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_plans (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        status VARCHAR(50) NULL,
        start_date DATE NULL,
        end_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ audit_plans table created!');

    // Insert sample data one by one
    console.log('📝 Inserting sample data...');
    const sampleData = [
      ['AP001', 'Financial Statement Audit FY2024', 'Active', 'Annual audit of financial statements for fiscal year 2024.'],
      ['AP002', 'IT General Controls Review Q3 2024', 'Active', 'Quarterly review of IT general controls.'],
      ['AP003', 'Operational Efficiency Audit - Manufacturing', 'Draft', 'Audit to identify operational inefficiencies in the manufacturing department.'],
      ['AP004', 'Compliance Audit - GDPR Readiness', 'Completed', 'Assessment of GDPR compliance status.'],
      ['AP005', 'Cybersecurity Threat Assessment', 'Active', 'Ongoing assessment of cybersecurity threats and vulnerabilities.']
    ];

    for (const [id, title, status, description] of sampleData) {
      try {
        await connection.query(
          'INSERT INTO audit_plans (id, title, status, description) VALUES (?, ?, ?, ?)',
          [id, title, status, description]
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
    console.log('🔍 Verifying data...');
    const [rows] = await connection.query('SELECT * FROM audit_plans');
    console.log('✅ Found', rows.length, 'audit plans:');
    rows.forEach(row => {
      console.log(`  - ${row.id}: ${row.title} (${row.status})`);
    });

    await connection.end();
    console.log('✅ Database setup completed successfully!');
    console.log('🎉 You can now visit http://localhost:3000/api/audit-plans');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
}

setupDatabase();
