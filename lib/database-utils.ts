import { query } from './database';

// Common database utility functions for the audit platform

export interface User {
  UserID: number;
  Email: string;
  FirstName?: string;
  LastName?: string;
  UserRoleID: number;
  IsActive: boolean;
  CreatedDate: string;
  ModifiedDate: string;
}

export interface AuditPlan {
  PlanID: number;
  PlanName: string;
  PlanDescription?: string;
  StartDate: string;
  EndDate: string;
  Status: string;
  CreatedDate: string;
  ModifiedDate: string;
}

export interface Assignment {
  AssignmentID: number;
  AssignmentName: string;
  AssignmentStatusID: number;
  AssignmentTypeID: number;
  AssignmentDueDate: string;
  AssigneeID: number;
  PlanID: number;
  RiskLikelihoodID: number;
  RiskImpactID: number;
  InherentRiskID: number;
  CreatedDate: string;
  ModifiedDate: string;
}

export interface Finding {
  FindingID: number;
  Title: string;
  FindingDescription?: string;
  SeverityID: number;
  FindingStatusID: number;
  AssignmentID: number;
  CreatedDate: string;
  ModifiedDate: string;
}

// User management functions
export async function getUsers(): Promise<User[]> {
  return await query(`
    SELECT 
      UserID, Email, FirstName, LastName, UserRoleID, 
      IsActive, CreatedDate, ModifiedDate
    FROM users 
    WHERE IsDeleted = 0 AND IsActive = 1
    ORDER BY FirstName, LastName
  `) as User[];
}

export async function getUserById(userId: number): Promise<User | null> {
  const users = await query(`
    SELECT 
      UserID, Email, FirstName, LastName, UserRoleID, 
      IsActive, CreatedDate, ModifiedDate
    FROM users 
    WHERE UserID = ? AND IsDeleted = 0
  `, [userId]) as User[];
  
  return users.length > 0 ? users[0] : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await query(`
    SELECT 
      UserID, Email, FirstName, LastName, UserRoleID, 
      IsActive, CreatedDate, ModifiedDate
    FROM users 
    WHERE Email = ? AND IsDeleted = 0
  `, [email]) as User[];
  
  return users.length > 0 ? users[0] : null;
}

// Audit plan functions
export async function getAuditPlans(): Promise<AuditPlan[]> {
  return await query(`
    SELECT 
      ap.PlanID, ap.PlanName, ap.PlanDescription, 
      ap.StartDate, ap.EndDate, aps.Status,
      ap.CreatedDate, ap.ModifiedDate
    FROM auditplans ap
    LEFT JOIN auditplanstatuses aps ON ap.StatusID = aps.StatusID
    WHERE ap.IsDeleted = 0
    ORDER BY ap.StartDate DESC
  `) as AuditPlan[];
}

export async function getAuditPlanById(planId: number): Promise<AuditPlan | null> {
  const plans = await query(`
    SELECT 
      ap.PlanID, ap.PlanName, ap.PlanDescription, 
      ap.StartDate, ap.EndDate, aps.Status,
      ap.CreatedDate, ap.ModifiedDate
    FROM auditplans ap
    LEFT JOIN auditplanstatuses aps ON ap.StatusID = aps.StatusID
    WHERE ap.PlanID = ? AND ap.IsDeleted = 0
  `, [planId]) as AuditPlan[];
  
  return plans.length > 0 ? plans[0] : null;
}

// Assignment functions
export async function getAssignments(): Promise<Assignment[]> {
  return await query(`
    SELECT 
      a.AssignmentID, a.AssignmentName, a.AssignmentStatusID, 
      a.AssignmentTypeID, a.AssignmentDueDate, a.AssigneeID,
      a.PlanID, a.RiskLikelihoodID, a.RiskImpactID, a.InherentRiskID,
      a.CreatedDate, a.ModifiedDate
    FROM assignments a
    WHERE a.IsDeleted = 0
    ORDER BY a.AssignmentDueDate ASC
  `) as Assignment[];
}

export async function getAssignmentById(assignmentId: number): Promise<Assignment | null> {
  const assignments = await query(`
    SELECT 
      a.AssignmentID, a.AssignmentName, a.AssignmentStatusID, 
      a.AssignmentTypeID, a.AssignmentDueDate, a.AssigneeID,
      a.PlanID, a.RiskLikelihoodID, a.RiskImpactID, a.InherentRiskID,
      a.CreatedDate, a.ModifiedDate
    FROM assignments a
    WHERE a.AssignmentID = ? AND a.IsDeleted = 0
  `, [assignmentId]) as Assignment[];
  
  return assignments.length > 0 ? assignments[0] : null;
}

// Finding functions
export async function getFindings(): Promise<Finding[]> {
  return await query(`
    SELECT 
      f.FindingID, f.Title, f.FindingDescription, f.SeverityID,
      f.FindingStatusID, f.AssignmentID, f.CreatedDate, f.ModifiedDate
    FROM findings f
    WHERE f.IsDeleted = 0
    ORDER BY f.CreatedDate DESC
  `) as Finding[];
}

export async function getFindingById(findingId: number): Promise<Finding | null> {
  const findings = await query(`
    SELECT 
      f.FindingID, f.Title, f.FindingDescription, f.SeverityID,
      f.FindingStatusID, f.AssignmentID, f.CreatedDate, f.ModifiedDate
    FROM findings f
    WHERE f.FindingID = ? AND f.IsDeleted = 0
  `, [findingId]) as Finding[];
  
  return findings.length > 0 ? findings[0] : null;
}

// Dashboard statistics
export async function getDashboardStats() {
  const [userCount] = await query('SELECT COUNT(*) as count FROM users WHERE IsDeleted = 0 AND IsActive = 1') as any[];
  const [planCount] = await query('SELECT COUNT(*) as count FROM auditplans WHERE IsDeleted = 0') as any[];
  const [assignmentCount] = await query('SELECT COUNT(*) as count FROM assignments WHERE IsDeleted = 0') as any[];
  const [findingCount] = await query('SELECT COUNT(*) as count FROM findings WHERE IsDeleted = 0') as any[];
  
  return {
    users: userCount.count,
    auditPlans: planCount.count,
    assignments: assignmentCount.count,
    findings: findingCount.count
  };
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
  `);
}

// Search functions
export async function searchAssignments(searchTerm: string): Promise<Assignment[]> {
  return await query(`
    SELECT 
      a.AssignmentID, a.AssignmentName, a.AssignmentStatusID, 
      a.AssignmentTypeID, a.AssignmentDueDate, a.AssigneeID,
      a.PlanID, a.RiskLikelihoodID, a.RiskImpactID, a.InherentRiskID,
      a.CreatedDate, a.ModifiedDate
    FROM assignments a
    WHERE a.IsDeleted = 0 
    AND (a.AssignmentName LIKE ? OR a.AssignmentDescription LIKE ?)
    ORDER BY a.AssignmentDueDate ASC
  `, [`%${searchTerm}%`, `%${searchTerm}%`]) as Assignment[];
}

// Utility function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  const result = await query(`
    SELECT COUNT(*) as count 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = 'audit_platform' 
    AND TABLE_NAME = ?
  `, [tableName]) as any[];
  
  return result[0].count > 0;
}

// Utility function to get table structure
export async function getTableStructure(tableName: string) {
  return await query(`
    SELECT 
      COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, 
      COLUMN_DEFAULT, EXTRA, COLUMN_COMMENT
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'audit_platform' 
    AND TABLE_NAME = ?
    ORDER BY ORDINAL_POSITION
  `, [tableName]);
}

