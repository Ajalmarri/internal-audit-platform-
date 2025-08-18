const mysql = require('mysql2/promise')

async function createSampleSchema() {
  const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ahmed@123',
  }

  const ddl = [
    `CREATE DATABASE IF NOT EXISTS audit_platform`,
    `USE audit_platform`,
    `CREATE TABLE IF NOT EXISTS AuditPlanStatuses (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      StatusName VARCHAR(100),
      DisplayOrder INT
    )`,
    `CREATE TABLE IF NOT EXISTS UserRoles (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      RoleName VARCHAR(100),
      DisplayOrder INT
    )`,
    `CREATE TABLE IF NOT EXISTS AssignmentStatuses (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      StatusName VARCHAR(100),
      DisplayOrder INT
    )`,
    `CREATE TABLE IF NOT EXISTS AssignmentTypes (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      AssignmentType VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS RiskLikelihoods (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Likelihood VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS RiskImpacts (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Impact VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS InherentRisks (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      InherentRisk VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS AuditTaskStatuses (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      StatusName VARCHAR(100),
      DisplayOrder INT
    )`,
    `CREATE TABLE IF NOT EXISTS EngagementStatuses (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      EngagementStatus VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS FindingStatuses (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      FindingStatus VARCHAR(150),
      DisplayOrder INT
    )`,
    `CREATE TABLE IF NOT EXISTS Severities (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Severity VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS ActionPlanStatuses (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      ActionPlanStatus VARCHAR(100),
      DisplayOrder INT
    )`,
    `CREATE TABLE IF NOT EXISTS PrimaryStakeholders (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      PrimaryStakeholder VARCHAR(255),
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS Users (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Email VARCHAR(255),
      FirstName VARCHAR(100),
      LastName VARCHAR(100),
      UserRoleID INT,
      IsActive TINYINT,
      CreatedDate DATETIME,
      CreatedBy INT,
      ModifiedDate DATETIME,
      ModifiedBy INT,
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS AuditPlans (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      PlanName VARCHAR(255),
      PlanYear INT,
      PlanStatusID INT,
      Progress INT,
      CreatedDate DATETIME,
      CreatedBy INT,
      ModifiedDate DATETIME,
      ModifiedBy INT,
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS Assignments (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      AssignmentName VARCHAR(255),
      AssignmentStatusID INT,
      AssignmentTypeID INT,
      AssignmentDueDate DATE,
      AssigneeID INT,
      PlanID INT,
      RiskLikelihoodID INT,
      RiskImpactID INT,
      InherentRiskID INT,
      CreatedDate DATETIME,
      CreatedBy INT,
      ModifiedDate DATETIME,
      ModifiedBy INT,
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS Findings (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Title VARCHAR(255),
      FindingDescription TEXT,
      AssignmentID INT,
      FindingStatusID INT,
      SeverityID INT,
      BusinessOwnerID INT,
      Recommendation TEXT,
      Criteria TEXT,
      Impact TEXT,
      RootCause TEXT,
      ManagementResponse TINYINT,
      ManagementComment TEXT,
      AttachmentFilePath TEXT,
      AttachmentFileName VARCHAR(255),
      AttachmentFileType VARCHAR(255),
      AttachmentFileSize INT,
      CreatedDate DATETIME,
      CreatedBy INT,
      ModifiedDate DATETIME,
      ModifiedBy INT,
      VerifiedBy INT,
      SentToBODate DATETIME,
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS ActionPlans (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      ActionPlanDescription TEXT,
      ResponsibleID INT,
      DueDate DATE,
      ActionPlanStatusID INT,
      FindingID INT,
      IsApproved TINYINT,
      Comment TEXT,
      PriorityID INT,
      Objective TEXT,
      Criteria TEXT,
      Effort VARCHAR(50),
      CreatedDate DATETIME,
      CreatedBy INT,
      ModifiedDate DATETIME,
      ModifiedBy INT,
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS Actions (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      ActionPlanID INT,
      ActionDescription VARCHAR(255),
      Details TEXT,
      Responsible INT,
      DueDate DATE,
      ActionStatus INT
    )`,
    `CREATE TABLE IF NOT EXISTS Engagements (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      EngagementTitle VARCHAR(255),
      PrimaryStakeholderID INT,
      EngagementManagerID INT,
      StartDate DATE,
      EndDate DATE,
      StatusID INT,
      Objective TEXT,
      Scope TEXT,
      AssignmentID INT,
      CreatedDate DATETIME,
      CreatedBy INT,
      ModifiedDate DATETIME,
      ModifiedBy INT,
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS AuditTasks (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      AuditTaskDescription TEXT,
      StatusID INT,
      AssigneeID INT,
      AssignmentID INT,
      DueDate DATE,
      CreatedDate DATETIME,
      CreatedBy INT,
      ModifiedDate DATETIME,
      ModifiedBy INT,
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS Documents (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      DocumentName VARCHAR(255),
      DocumentFilePath TEXT,
      DocumentFileName VARCHAR(255),
      DocumentFileType VARCHAR(255),
      DocumentFileSize INT,
      AssignmentID INT,
      CreatedDate DATETIME,
      CreatedBy INT,
      ModifiedDate DATETIME,
      ModifiedBy INT,
      IsDeleted TINYINT
    )`,
    `CREATE TABLE IF NOT EXISTS Comments (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      AssignmentID INT,
      CommentText TEXT,
      CreatedDate DATETIME,
      CreatedBy INT,
      IsDeleted TINYINT
    )`,
  ]

  try {
    console.log('🔌 Connecting to MySQL...')
    const connection = await mysql.createConnection(config)
    console.log('✅ Connected to MySQL successfully!')
    for (const stmt of ddl) {
      console.log('🧱 Executing:', stmt.split('\n')[0].slice(0, 60), '...')
      await connection.query(stmt)
    }
    await connection.end()
    console.log('✅ Sample schema ready!')
  } catch (error) {
    console.error('❌ Failed to create sample schema:', error.message)
  }
}

createSampleSchema()






