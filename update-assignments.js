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

async function updateAssignments() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Clear old data
    console.log('Clearing old assignments data...');
    await connection.execute('DELETE FROM assignments');
    
    // Insert new sample data matching import-real-data.sql exactly
    console.log('Inserting new sample data...');
    
    const newAssignments = [
      {
        id: '1',
        title: 'Network Security Review',
        description: 'Comprehensive review of network security controls and configurations',
        status: 'Preparation', // AssignmentStatusID: 2
        audit_plan_id: 'AP001', // PlanID: 1
        assignee_id: '2',
        end_date: '2024-03-15',
        priority: 'High'
      },
      {
        id: '2',
        title: 'Financial Controls Testing',
        description: 'Testing of financial controls and procedures',
        status: 'Planning', // AssignmentStatusID: 1
        audit_plan_id: 'AP002', // PlanID: 2
        assignee_id: '4',
        end_date: '2024-04-01',
        priority: 'Medium'
      },
      {
        id: '3',
        title: 'Process Documentation Review',
        description: 'Review of operational process documentation',
        status: 'Fieldwork', // AssignmentStatusID: 3
        audit_plan_id: 'AP003', // PlanID: 3
        assignee_id: '3',
        end_date: '2024-02-28',
        priority: 'Low'
      }
    ];
    
    for (const assignment of newAssignments) {
      await connection.execute(
        `INSERT INTO assignments (id, title, description, status, audit_plan_id, assignee_id, start_date, end_date, priority, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, NOW(), NOW())`,
        [assignment.id, assignment.title, assignment.description, assignment.status, assignment.audit_plan_id, assignment.assignee_id, assignment.end_date, assignment.priority]
      );
    }
    
    console.log('Successfully updated assignments table with new sample data!');
    
    // Verify the data
    const [rows] = await connection.execute('SELECT * FROM assignments');
    console.log('Current assignments:', rows);
    
  } catch (error) {
    console.error('Error updating assignments:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateAssignments();
