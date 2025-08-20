const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Ahmed@123',
  database: 'audit_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function importData() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Read the SQL file
    const fs = require('fs');
    const sqlContent = fs.readFileSync('import-real-data.sql', 'utf8');
    
    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
          await connection.execute(statement);
          console.log(`✓ Statement ${i + 1} executed successfully`);
        } catch (error) {
          console.error(`✗ Error executing statement ${i + 1}:`, error.message);
          // Continue with next statement even if one fails
        }
      }
    }
    
    console.log('Data import completed!');
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

importData();
