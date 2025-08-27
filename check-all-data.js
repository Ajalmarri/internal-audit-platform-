const mysql = require('mysql2/promise');

async function checkAllData() {
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

    // Check all main tables
    const tablesToCheck = [
      'audit_plans',
      'assignments', 
      'findings',
      'risks',
      'users',
      'auditplanstatuses',
      'assignmentstatuses',
      'findingstatuses'
    ];

    for (const table of tablesToCheck) {
      try {
        console.log(`\n📊 Data in ${table}:`);
        const [rows] = await connection.query(`SELECT * FROM ${table} LIMIT 5`);
        console.log(`Found ${rows.length} records:`);
        rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${JSON.stringify(row)}`);
        });
      } catch (error) {
        console.log(`❌ Error checking ${table}: ${error.message}`);
      }
    }

    await connection.end();
    console.log('\n✅ All data check completed!');

  } catch (error) {
    console.error('❌ Data check failed:', error.message);
  }
}

checkAllData();










