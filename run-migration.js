const mysql = require('mysql2/promise');
const fs = require('fs');

async function runMigration() {
  const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'audit_platform',
    password: 'Ahmed@123'
  };

  try {
    console.log('🔌 Connecting to MySQL...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully!');

    // Read and execute the migration
    const migrationSQL = fs.readFileSync('scripts/004-add-engagementid-to-documents.sql', 'utf8');
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    for (const stmt of statements) {
      if (stmt.trim()) {
        console.log('🧱 Executing:', stmt.trim().substring(0, 60), '...');
        try {
          await connection.query(stmt);
          console.log('✅ Success');
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_DUP_KEYNAME') {
            console.log('⚠️  Column/Index already exists, skipping...');
          } else {
            throw error;
          }
        }
      }
    }

    await connection.end();
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

runMigration();




