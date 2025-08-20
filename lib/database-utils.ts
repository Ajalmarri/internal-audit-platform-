import { query } from "./database"

// Common database utility functions for the audit platform

export interface User {
  UserID: number
  Email: string
  FirstName?: string
  LastName?: string
  UserRoleID: number
  IsActive: boolean
  CreatedDate: string
  ModifiedDate: string
}

export interface AuditPlan {
  PlanID: number
  PlanName: string
  PlanDescription?: string
  StartDate: string
  EndDate: string
  Status: string
  CreatedDate: string
  ModifiedDate: string
}

export interface Assignment {
  AssignmentID: number
  AssignmentName: string
  AssignmentStatusID: number
  AssignmentTypeID: number
  AssignmentDueDate: string
  AssigneeID: number
  PlanID: number
  RiskLikelihoodID: number
  RiskImpactID: number
  InherentRiskID: number
  CreatedDate: string
  ModifiedDate: string
}

export interface Finding {
  FindingID: number
  Title: string
  FindingDescription?: string
  SeverityID: number
  FindingStatusID: number
  AssignmentID: number
  CreatedDate: string
  ModifiedDate: string
}

// User management functions
export async function getUsers(): Promise<User[]> {
  return (await query(`
    SELECT 
      userid, email, firstname, lastname, userroleid, 
      isactive, createddate, modifieddate
    FROM users 
    WHERE isdeleted = false AND isactive = true
    ORDER BY firstname, lastname
  `)) as User[]
}

export async function getUserById(userId: number): Promise<User | null> {
  const users = (await query(
    `
    SELECT 
      userid, email, firstname, lastname, userroleid, 
      isactive, createddate, modifieddate
    FROM users 
    WHERE userid = $1 AND isdeleted = false
  `,
    [userId],
  )) as User[]

  return users.length > 0 ? users[0] : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = (await query(
    `
    SELECT 
      userid, email, firstname, lastname, userroleid, 
      isactive, createddate, modifieddate
    FROM users 
    WHERE email = $1 AND isdeleted = false
  `,
    [email],
  )) as User[]

  return users.length > 0 ? users[0] : null
}

// Audit plan functions
export async function getAuditPlans(): Promise<AuditPlan[]> {
  return (await query(`
    SELECT 
      ap.planid, ap.planname, ap.plandescription, 
      ap.startdate, ap.enddate, aps.status,
      ap.createddate, ap.modifieddate
    FROM auditplans ap
    LEFT JOIN auditplanstatuses aps ON ap.statusid = aps.statusid
    WHERE ap.isdeleted = false
    ORDER BY ap.startdate DESC
  `)) as AuditPlan[]
}

export async function getAuditPlanById(planId: number): Promise<AuditPlan | null> {
  const plans = (await query(
    `
    SELECT 
      ap.planid, ap.planname, ap.plandescription, 
      ap.startdate, ap.enddate, aps.status,
      ap.createddate, ap.modifieddate
    FROM auditplans ap
    LEFT JOIN auditplanstatuses aps ON ap.statusid = aps.statusid
    WHERE ap.planid = $1 AND ap.isdeleted = false
  `,
    [planId],
  )) as AuditPlan[]

  return plans.length > 0 ? plans[0] : null
}

// Assignment functions
export async function getAssignments(): Promise<Assignment[]> {
  return (await query(`
    SELECT 
      a.assignmentid, a.assignmentname, a.assignmentstatusid, 
      a.assignmenttypeid, a.assignmentduedate, a.assigneeid,
      a.planid, a.risklikelihoodid, a.riskimpactid, a.inherentriskid,
      a.createddate, a.modifieddate
    FROM assignments a
    WHERE a.isdeleted = false
    ORDER BY a.assignmentduedate ASC
  `)) as Assignment[]
}

export async function getAssignmentById(assignmentId: number): Promise<Assignment | null> {
  const assignments = (await query(
    `
    SELECT 
      a.assignmentid, a.assignmentname, a.assignmentstatusid, 
      a.assignmenttypeid, a.assignmentduedate, a.assigneeid,
      a.planid, a.risklikelihoodid, a.riskimpactid, a.inherentriskid,
      a.createddate, a.modifieddate
    FROM assignments a
    WHERE a.assignmentid = $1 AND a.isdeleted = false
  `,
    [assignmentId],
  )) as Assignment[]

  return assignments.length > 0 ? assignments[0] : null
}

// Finding functions
export async function getFindings(): Promise<Finding[]> {
  return (await query(`
    SELECT 
      f.findingid, f.title, f.findingdescription, f.severityid,
      f.findingstatusid, f.assignmentid, f.createddate, f.modifieddate
    FROM findings f
    WHERE f.isdeleted = false
    ORDER BY f.createddate DESC
  `)) as Finding[]
}

export async function getFindingById(findingId: number): Promise<Finding | null> {
  const findings = (await query(
    `
    SELECT 
      f.findingid, f.title, f.findingdescription, f.severityid,
      f.findingstatusid, f.assignmentid, f.createddate, f.modifieddate
    FROM findings f
    WHERE f.findingid = $1 AND f.isdeleted = false
  `,
    [findingId],
  )) as Finding[]

  return findings.length > 0 ? findings[0] : null
}

// Dashboard statistics
export async function getDashboardStats() {
  const [userCount] = (await query(
    "SELECT COUNT(*) as count FROM users WHERE isdeleted = false AND isactive = true",
  )) as any[]
  const [planCount] = (await query("SELECT COUNT(*) as count FROM auditplans WHERE isdeleted = false")) as any[]
  const [assignmentCount] = (await query("SELECT COUNT(*) as count FROM assignments WHERE isdeleted = false")) as any[]
  const [findingCount] = (await query("SELECT COUNT(*) as count FROM findings WHERE isdeleted = false")) as any[]

  return {
    users: userCount.count,
    auditPlans: planCount.count,
    assignments: assignmentCount.count,
    findings: findingCount.count,
  }
}

// Risk assessment functions
export async function getRiskMatrix() {
  return await query(`
    SELECT 
      ri.ImpactID, ri.Impact,
      rl.LikelihoodID, rl.Likelihood,
      ir.InherentRiskID, ir.InherentRisk
    FROM riskimpacts ri
    CROSS JOIN risklikelihoods rl
    CROSS JOIN inherentrisks ir
    ORDER BY ri.ImpactID DESC, rl.LikelihoodID DESC
  `)
}

// Search functions
export async function searchAssignments(searchTerm: string): Promise<Assignment[]> {
  return (await query(
    `
    SELECT 
      a.assignmentid, a.assignmentname, a.assignmentstatusid, 
      a.assignmenttypeid, a.assignmentduedate, a.assigneeid,
      a.planid, a.risklikelihoodid, a.riskimpactid, a.inherentriskid,
      a.createddate, a.modifieddate
    FROM assignments a
    WHERE a.isdeleted = false 
    AND (a.assignmentname LIKE $1 OR a.assignmentdescription LIKE $2)
    ORDER BY a.assignmentduedate ASC
  `,
    [`%${searchTerm}%`, `%${searchTerm}%`],
  )) as Assignment[]
}

// Utility function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  const result = (await query(
    `
    SELECT COUNT(*) as count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  `,
    [tableName],
  )) as any[]

  return result[0].count > 0
}

// Utility function to get table structure
export async function getTableStructure(tableName: string) {
  return await query(
    `
    SELECT 
      column_name, data_type, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = $1
    ORDER BY ordinal_position
  `,
    [tableName],
  )
}
