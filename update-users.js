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

async function updateUsers() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database successfully!');
    
    // Clear old data
    console.log('Clearing old users data...');
    await connection.execute('DELETE FROM users');
    
    // Insert new sample data matching import-real-data.sql exactly
    console.log('Inserting new sample data...');
    
    const newUsers = [
      {
        UserID: 1,
        Email: 'ahmed.almarri@d.gov.ae',
        FirstName: 'Ahmed',
        LastName: 'AlMarri',
        UserRoleID: 1, // Admin
        IsActive: 1,
        CreatedDate: '2024-01-01 08:00:00',
        CreatedBy: 1,
        ModifiedDate: '2024-01-01 08:00:00',
        ModifiedBy: 1,
        IsDeleted: 0
      },
      {
        UserID: 2,
        Email: 'ahmed.almarri2@d.gov.ae',
        FirstName: 'Ahmed',
        LastName: 'AlMarri',
        UserRoleID: 4, // Auditor
        IsActive: 1,
        CreatedDate: '2024-01-02 09:15:00',
        CreatedBy: 1,
        ModifiedDate: '2024-01-02 09:15:00',
        ModifiedBy: 1,
        IsDeleted: 0
      },
      {
        UserID: 3,
        Email: 'ahmad.almarzooqi@d.gov.ae',
        FirstName: 'Ahmad',
        LastName: 'AlMarzooqi',
        UserRoleID: 2, // Audit Manager
        IsActive: 1,
        CreatedDate: '2024-01-03 10:30:00',
        CreatedBy: 1,
        ModifiedDate: '2024-01-03 10:30:00',
        ModifiedBy: 1,
        IsDeleted: 0
      },
      {
        UserID: 4,
        Email: 'hamda.abdulla@d.gov.ae',
        FirstName: 'Hamda',
        LastName: 'Abdulla',
        UserRoleID: 4, // Auditor
        IsActive: 1,
        CreatedDate: '2024-01-04 11:45:00',
        CreatedBy: 1,
        ModifiedDate: '2024-01-04 11:45:00',
        ModifiedBy: 1,
        IsDeleted: 0
      },
      {
        UserID: 5,
        Email: 'anastasia.romanova@d.gov.ae',
        FirstName: 'Anastasia',
        LastName: 'Romanova',
        UserRoleID: 3, // Risk Manager
        IsActive: 0,
        CreatedDate: '2024-01-05 13:20:00',
        CreatedBy: 1,
        ModifiedDate: '2024-01-05 13:20:00',
        ModifiedBy: 1,
        IsDeleted: 1
      }
    ];
    
    for (const user of newUsers) {
      await connection.execute(
        `INSERT INTO users (UserID, Email, FirstName, LastName, UserRoleID, IsActive, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.UserID, user.Email, user.FirstName, user.LastName, user.UserRoleID, user.IsActive, user.CreatedDate, user.CreatedBy, user.ModifiedDate, user.ModifiedBy, user.IsDeleted]
      );
    }
    
    console.log('Successfully updated users table with new sample data!');
    
    // Verify the data
    const [rows] = await connection.execute('SELECT * FROM users');
    console.log('Current users:', rows);
    
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateUsers();
