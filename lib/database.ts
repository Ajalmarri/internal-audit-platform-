import { Pool, PoolClient } from 'pg'

// Database connection pool
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await getPool().connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } finally {
    client.release()
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows.length > 0 ? rows[0] : null
}

export async function execute(text: string, params?: any[]): Promise<void> {
  const client = await getPool().connect()
  try {
    await client.query(text, params)
  } finally {
    client.release()
  }
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Database schema types
export interface AuditPlan {
  id: string
  title: string
  description?: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  start_date?: Date
  end_date?: Date
  created_at: Date
  updated_at: Date
}

export interface Assignment {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assigned_to?: string
  due_date?: Date
  created_at: Date
  updated_at: Date
}

export interface Finding {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  assignment_id?: string
  responsible_party?: string
  created_at: Date
  updated_at: Date
}

export interface Evidence {
  id: string
  title: string
  description?: string
  file_path: string
  file_size: number
  file_type: string
  assignment_id?: string
  finding_id?: string
  uploaded_by?: string
  created_at: Date
}

export interface Report {
  id: string
  title: string
  template_id: string
  status: 'draft' | 'finalized' | 'archived'
  file_path?: string
  file_size?: number
  generated_by?: string
  created_at: Date
  updated_at: Date
} 