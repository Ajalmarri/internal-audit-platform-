const mysql = require('mysql2/promise');

async function checkDatabase() {
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

    // List all databases
    console.log('\n📦 Available Databases:');
    const [databases] = await connection.query('SHOW DATABASES');
    databases.forEach(db => {
      console.log(`  - ${db.Database}`);
    });

    // Check if audit_platform exists
    const auditPlatformExists = databases.some(db => db.Database === 'audit_platform');
    
    if (auditPlatformExists) {
      console.log('\n📋 Tables in audit_platform:');
      await connection.query('USE audit_platform');
      const [tables] = await connection.query('SHOW TABLES');
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`  - ${tableName}`);
      });

      // Check if audit_plans table exists
      const auditPlansExists = tables.some(table => Object.values(table)[0] === 'audit_plans');
      
      if (auditPlansExists) {
        console.log('\n📊 Sample data from audit_plans:');
        const [rows] = await connection.query('SELECT * FROM audit_plans LIMIT 5');
        console.log(rows);
      } else {
        console.log('\n❌ audit_plans table not found in audit_platform database');
      }
    } else {
      console.log('\n❌ audit_platform database not found');
      
      // Check for other potential audit databases
      console.log('\n🔍 Checking for other audit-related databases...');
      const auditDatabases = databases.filter(db => 
        db.Database.toLowerCase().includes('audit') || 
        db.Database.toLowerCase().includes('internal')
      );
      
      if (auditDatabases.length > 0) {
        console.log('Found potential audit databases:');
        auditDatabases.forEach(db => {
          console.log(`  - ${db.Database}`);
        });
      }
    }

    await connection.end();
    console.log('\n✅ Database check completed!');

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

checkDatabase();







