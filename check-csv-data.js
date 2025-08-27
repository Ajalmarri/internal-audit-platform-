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

async function checkCSVData() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Checking CSV import data...\n');
    
    // Check total count
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM findings_csv_import');
    console.log(`Total records: ${countResult[0].total}\n`);
    
    // Check first few records
    const [records] = await connection.execute('SELECT * FROM findings_csv_import LIMIT 3');
    console.log('First 3 records:');
    console.log(JSON.stringify(records, null, 2));
    
    // Check for non-empty fields
    const [nonEmptyCounts] = await connection.execute(`
      SELECT 
        COUNT(CASE WHEN finding_title IS NOT NULL AND finding_title != '' THEN 1 END) as title_count,
        COUNT(CASE WHEN finding_detail IS NOT NULL AND finding_detail != '' THEN 1 END) as detail_count,
        COUNT(CASE WHEN audit_plan_name IS NOT NULL AND audit_plan_name != '' THEN 1 END) as plan_count,
        COUNT(CASE WHEN assignment_name IS NOT NULL AND assignment_name != '' THEN 1 END) as assignment_count
      FROM findings_csv_import
    `);
    
    console.log('\nNon-empty field counts:');
    console.log(nonEmptyCounts[0]);
    
    connection.end();
  } catch (error) {
    console.error('Error checking CSV data:', error);
  }
}

checkCSVData();





