import mysql from 'mysql2/promise';

// Database configuration - Updated to match the user's actual database
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Ahmed@123', // Hardcoded for now
  database: 'audit_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export async function getConnection() {
  if (!pool) {
    console.log('Creating MySQL pool with config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      password: dbConfig.password ? '[HIDDEN]' : '[EMPTY]'
    });
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export async function query(sql: string, params?: any[]) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Test connection function
export async function testConnection() {
  try {
    const connection = await getConnection();
    // Use a simple query instead of ping
    await connection.execute('SELECT 1');
    console.log('MySQL connection successful');
    return true;
  } catch (error) {
    console.error('MySQL connection failed:', error);
    return false;
  }
} 