const mysql = require('mysql2/promise');

async function testMySQL() {
  const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ahmed@123',
    database: 'audit_platform'
  };

  console.log('Testing MySQL connection with config:', {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
    password: config.password ? '[SET]' : '[NOT SET]'
  });

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ MySQL connection successful!');
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    await connection.end();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
  }
}

testMySQL();





