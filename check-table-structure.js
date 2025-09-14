const mysql = require('mysql2/promise');

async function checkTableStructure() {
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

    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Available tables:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });

    // Check structure of key tables
    const keyTables = ['audit_plans', 'assignments', 'findings', 'users', 'auditplans'];
    
    for (const table of keyTables) {
      try {
        console.log(`\n📊 Structure of ${table}:`);
        const [columns] = await connection.query(`DESCRIBE ${table}`);
        columns.forEach(col => {
          console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
      } catch (error) {
        console.log(`  ❌ Table ${table} doesn't exist`);
      }
    }

    // Check sample data from existing tables
    console.log('\n📊 Sample data from existing tables:');
    
    const existingTables = ['audit_plans', 'assignments', 'findings'];
    
    for (const table of existingTables) {
      try {
        const [rows] = await connection.query(`SELECT * FROM ${table} LIMIT 2`);
        console.log(`\n${table}:`);
        rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${JSON.stringify(row)}`);
        });
      } catch (error) {
        console.log(`${table}: Error - ${error.message}`);
      }
    }

    await connection.end();
    console.log('\n✅ Table structure check completed!');

  } catch (error) {
    console.error('❌ Table structure check failed:', error.message);
  }
}

checkTableStructure();































