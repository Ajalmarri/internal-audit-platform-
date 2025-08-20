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

async function updateFindings() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Clear old data
    console.log('Clearing old findings data...');
    await connection.execute('DELETE FROM findings');
    
    // Insert new sample data
    console.log('Inserting new sample data...');
    
    const newFindings = [
      {
        id: '1',
        title: 'Weak Password Policy',
        description: 'Current password policy does not meet industry standards for complexity and rotation',
        assignment_id: '1',
        status: 'Verified',
        severity: 'High',
        created_at: '2024-01-25 10:00:00',
        updated_at: '2024-01-25 10:00:00'
      },
      {
        id: '2',
        title: 'Inadequate Firewall Configuration',
        description: 'Firewall rules allow unnecessary traffic and lack proper documentation',
        assignment_id: '1',
        status: 'Sent to Business Owner',
        severity: 'Critical',
        created_at: '2024-01-26 11:15:00',
        updated_at: '2024-01-26 11:15:00'
      },
      {
        id: '3',
        title: 'Lack of Segregation of Duties',
        description: 'Single individuals can initiate and approve financial transactions',
        assignment_id: '2',
        status: 'Pending Verification',
        severity: 'High',
        created_at: '2024-02-08 14:20:00',
        updated_at: '2024-02-08 14:20:00'
      },
      {
        id: '4',
        title: 'Missing Backup Verification',
        description: 'Backup processes lack verification procedures to ensure data integrity',
        assignment_id: '1',
        status: 'Action Plan Submitted',
        severity: 'Medium',
        created_at: '2024-01-28 16:45:00',
        updated_at: '2024-01-28 16:45:00'
      },
      {
        id: '5',
        title: 'Inadequate Incident Response Plan',
        description: 'Current incident response procedures are outdated and incomplete',
        assignment_id: '1',
        status: 'Draft',
        severity: 'High',
        created_at: '2024-01-30 09:30:00',
        updated_at: '2024-01-30 09:30:00'
      }
    ];
    
    for (const finding of newFindings) {
      await connection.execute(
        `INSERT INTO findings (id, title, description, assignment_id, status, severity, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [finding.id, finding.title, finding.description, finding.assignment_id, finding.status, finding.severity, finding.created_at, finding.updated_at]
      );
    }
    
    console.log('Successfully updated findings table with new sample data!');
    
    // Verify the data
    const [rows] = await connection.execute('SELECT * FROM findings');
    console.log('Current findings:', rows);
    
  } catch (error) {
    console.error('Error updating findings:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateFindings();
