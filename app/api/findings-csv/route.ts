import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get all findings from the CSV import table with the correct schema
    const [rows] = await connection.execute(`
      SELECT 
        id,
        sequence,
        year,
        audit_plan_name,
        assignment_name,
        assignment_cycle,
        finding_title,
        finding_detail,
        management_response,
        acceptance,
        finding_rating,
        control_rating,
        recommendations,
        core_risks,
        core_function,
        created_by,
        created_at,
        updated_at
      FROM findings_csv_import
      ORDER BY id ASC
    `);
    
    connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching CSV findings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching CSV findings', error: errorMessage }, { status: 500 });
  }
}
