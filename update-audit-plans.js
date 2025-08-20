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

async function updateAuditPlans() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Clear old data
    console.log('Clearing old audit_plans data...');
    await connection.execute('DELETE FROM audit_plans');
    
    // Insert new sample data matching import-real-data.sql exactly
    console.log('Inserting new sample data...');
    
    const newAuditPlans = [
      {
        id: 'AP001',
        title: 'IT Security Audit',
        description: 'Comprehensive IT security audit for 2024',
        status: 'In Progress', // PlanStatusID: 2
        start_date: '2024-01-15',
        end_date: '2024-12-31',
        created_at: '2024-01-15 09:00:00',
        updated_at: '2024-01-15 09:00:00'
      },
      {
        id: 'AP002',
        title: 'Financial Controls Review',
        description: 'Review of financial controls and procedures',
        status: 'Draft', // PlanStatusID: 1
        start_date: '2024-02-01',
        end_date: '2024-12-31',
        created_at: '2024-02-01 10:30:00',
        updated_at: '2024-02-01 10:30:00'
      },
      {
        id: 'AP003',
        title: 'Operational Risk Assessment',
        description: 'Assessment of operational risks and controls',
        status: 'Completed', // PlanStatusID: 3
        start_date: '2024-01-10',
        end_date: '2024-06-30',
        created_at: '2024-01-10 08:15:00',
        updated_at: '2024-01-10 08:15:00'
      },
      {
        id: 'AP004',
        title: 'Data Privacy Review',
        description: 'Comprehensive data privacy and protection review',
        status: 'In Progress', // PlanStatusID: 2
        start_date: '2024-02-15',
        end_date: '2024-11-30',
        created_at: '2024-02-15 11:45:00',
        updated_at: '2024-02-15 11:45:00'
      }
    ];
    
    for (const plan of newAuditPlans) {
      await connection.execute(
        `INSERT INTO audit_plans (id, title, description, status, start_date, end_date, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [plan.id, plan.title, plan.description, plan.status, plan.start_date, plan.end_date, plan.created_at, plan.updated_at]
      );
    }
    
    console.log('Successfully updated audit_plans table with new sample data!');
    
    // Verify the data
    const [rows] = await connection.execute('SELECT * FROM audit_plans');
    console.log('Current audit plans:', rows);
    
  } catch (error) {
    console.error('Error updating audit_plans:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateAuditPlans();
