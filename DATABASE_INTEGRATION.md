# 🗄️ Database Integration Guide - Audit Platform

## ✅ **Current Status: FULLY CONNECTED**

Your **audit_platform** database is successfully connected to your Next.js application! 

## 🔌 **Database Connection Details**

- **Host**: localhost
- **Port**: 3306
- **Database**: audit_platform
- **User**: root
- **Status**: ✅ Connected and working
- **Tables**: 23 tables successfully detected
- **Data**: 5 users and other records present

## 📁 **Files Structure**

\`\`\`
lib/
├── database.ts          # Main database connection
├── database-utils.ts    # Utility functions for common operations
app/api/
├── users/route.ts       # User management API
├── findings/route.ts    # Findings API
├── assignments/route.ts # Assignments API
├── audit-plans/route.ts # Audit plans API
└── ...                 # Other API routes
\`\`\`

## 🚀 **How to Use the Database in Your Application**

### 1. **Direct Database Queries**

\`\`\`typescript
import { query } from '@/lib/database';

// Simple query
const users = await query('SELECT * FROM users WHERE IsActive = 1');

// Parameterized query
const user = await query('SELECT * FROM users WHERE UserID = ?', [userId]);
\`\`\`

### 2. **Using Utility Functions**

\`\`\`typescript
import { getUsers, getAuditPlans, getDashboardStats } from '@/lib/database-utils';

// Get all active users
const users = await getUsers();

// Get all audit plans
const plans = await getAuditPlans();

// Get dashboard statistics
const stats = await getDashboardStats();
\`\`\`

### 3. **In API Routes**

\`\`\`typescript
// app/api/users/route.ts
import { NextResponse } from "next/server";
import { getUsers } from "@/lib/database-utils";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users" }, 
      { status: 500 }
    );
  }
}
\`\`\`

### 4. **In Server Components**

\`\`\`typescript
// app/dashboard/page.tsx
import { getDashboardStats } from '@/lib/database-utils';

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {stats.users}</p>
      <p>Total Audit Plans: {stats.auditPlans}</p>
      <p>Total Assignments: {stats.assignments}</p>
      <p>Total Findings: {stats.findings}</p>
    </div>
  );
}
\`\`\`

## 🗂️ **Available Database Tables**

### **Core Tables**
- `users` - User management
- `userroles` - User role definitions
- `auditplans` - Audit planning
- `assignments` - Audit assignments
- `findings` - Audit findings
- `actionplans` - Action plans for findings

### **Reference Tables**
- `severities` - Severity levels
- `findingstatuses` - Finding statuses
- `assignmentstatuses` - Assignment statuses
- `assignmenttypes` - Assignment types
- `riskimpacts` - Risk impact levels
- `risklikelihoods` - Risk likelihood levels
- `inherentrisks` - Inherent risk categories

### **Supporting Tables**
- `actions` - Individual actions
- `documents` - Document management
- `primarystakeholders` - Stakeholder information

## 🔧 **Database Utility Functions**

### **User Management**
- `getUsers()` - Get all active users
- `getUserById(id)` - Get user by ID
- `getUserByEmail(email)` - Get user by email

### **Audit Management**
- `getAuditPlans()` - Get all audit plans
- `getAuditPlanById(id)` - Get audit plan by ID
- `getAssignments()` - Get all assignments
- `getAssignmentById(id)` - Get assignment by ID

### **Findings Management**
- `getFindings()` - Get all findings
- `getFindingById(id)` - Get finding by ID

### **Analytics & Reporting**
- `getDashboardStats()` - Get dashboard statistics
- `getRiskMatrix()` - Get risk assessment matrix
- `searchAssignments(term)` - Search assignments

### **Utility Functions**
- `tableExists(name)` - Check if table exists
- `getTableStructure(name)` - Get table structure

## 🛡️ **Security & Best Practices**

### **Parameterized Queries**
✅ **Good** - Use parameterized queries to prevent SQL injection:
\`\`\`typescript
const user = await query('SELECT * FROM users WHERE UserID = ?', [userId]);
\`\`\`

❌ **Bad** - Don't concatenate strings:
\`\`\`typescript
const user = await query(`SELECT * FROM users WHERE UserID = ${userId}`);
\`\`\`

### **Error Handling**
Always wrap database operations in try-catch blocks:
\`\`\`typescript
try {
  const result = await query('SELECT * FROM users');
  return NextResponse.json(result);
} catch (error) {
  console.error('Database error:', error);
  return NextResponse.json(
    { message: 'Database operation failed' }, 
    { status: 500 }
  );
}
\`\`\`

### **Connection Management**
The database connection is automatically managed through connection pooling. No need to manually open/close connections.

## 📊 **Testing Your Database Connection**

Run the test script to verify everything is working:
\`\`\`bash
node test-db-connection.js
\`\`\`

Expected output:
\`\`\`
🔌 Testing MySQL connection...
✅ Connected successfully to MySQL database!
✅ Query test successful: [ { test: 1 } ]
📊 Database contains 23 tables
👥 Users table contains 5 records
🎉 Database connection test completed successfully!
\`\`\`

## 🚨 **Troubleshooting**

### **Connection Issues**
1. **Check MySQL service**: Ensure MySQL is running
2. **Verify credentials**: Check username/password in `lib/database.ts`
3. **Check port**: Ensure port 3306 is not blocked
4. **Database exists**: Verify `audit_platform` database exists

### **Query Issues**
1. **Check table names**: Use exact case-sensitive table names
2. **Verify columns**: Check column names match your schema
3. **Check permissions**: Ensure user has proper database permissions

### **Performance Issues**
1. **Use indexes**: Ensure proper indexes on frequently queried columns
2. **Limit results**: Use LIMIT clauses for large datasets
3. **Optimize queries**: Use EXPLAIN to analyze query performance

## 🔄 **Next Steps**

1. **Test API endpoints** - Verify all your API routes are working
2. **Add new features** - Use the utility functions to build new functionality
3. **Create reports** - Use the database for analytics and reporting
4. **Monitor performance** - Watch for slow queries and optimize as needed

## 📞 **Support**

If you encounter any issues:
1. Check the console logs for error messages
2. Run the test script to verify connection
3. Check the database schema file: `audit_platform_schema.sql`
4. Verify your MySQL server is running and accessible

---

**🎉 Your audit platform database is now fully integrated and ready to use!**
