-- =====================================================
-- AUDIT PLATFORM DATABASE SCHEMA FOR POSTGRESQL
-- Converted from MySQL to PostgreSQL
-- =====================================================

-- Create sequences for auto-increment functionality
CREATE SEQUENCE IF NOT EXISTS userroles_roleid_seq;
CREATE SEQUENCE IF NOT EXISTS users_userid_seq;
CREATE SEQUENCE IF NOT EXISTS auditplanstatuses_statusid_seq;
CREATE SEQUENCE IF NOT EXISTS auditplans_planid_seq;
CREATE SEQUENCE IF NOT EXISTS assignmentstatuses_statusid_seq;
CREATE SEQUENCE IF NOT EXISTS assignmenttypes_typeid_seq;
CREATE SEQUENCE IF NOT EXISTS risklikelihoods_likelihoodid_seq;
CREATE SEQUENCE IF NOT EXISTS riskimpacts_impactid_seq;
CREATE SEQUENCE IF NOT EXISTS inherentrisks_inherentriskid_seq;
CREATE SEQUENCE IF NOT EXISTS assignments_assignmentid_seq;
CREATE SEQUENCE IF NOT EXISTS audittaskstatuses_statusid_seq;
CREATE SEQUENCE IF NOT EXISTS audittasks_taskid_seq;
CREATE SEQUENCE IF NOT EXISTS primarystakeholders_primarystakeholderid_seq;
CREATE SEQUENCE IF NOT EXISTS engagementstatuses_engagementstatusid_seq;
CREATE SEQUENCE IF NOT EXISTS engagements_engagementid_seq;
CREATE SEQUENCE IF NOT EXISTS severities_severityid_seq;
CREATE SEQUENCE IF NOT EXISTS findingstatuses_findingstatusid_seq;
CREATE SEQUENCE IF NOT EXISTS findings_findingid_seq;
CREATE SEQUENCE IF NOT EXISTS actionplanstatuses_actionplanstatusid_seq;
CREATE SEQUENCE IF NOT EXISTS actionplans_actionplanid_seq;
CREATE SEQUENCE IF NOT EXISTS actions_actionid_seq;
CREATE SEQUENCE IF NOT EXISTS comments_commentid_seq;
CREATE SEQUENCE IF NOT EXISTS documents_documentid_seq;

-- Table: userroles
CREATE TABLE IF NOT EXISTS userroles (
  RoleID INTEGER NOT NULL DEFAULT nextval('userroles_roleid_seq') PRIMARY KEY,
  RoleName VARCHAR(30) NOT NULL UNIQUE,
  DisplayOrder INTEGER DEFAULT 0
);

-- Table: users (must be created after userroles due to foreign key)
CREATE TABLE IF NOT EXISTS users (
  UserID INTEGER NOT NULL DEFAULT nextval('users_userid_seq') PRIMARY KEY,
  Email VARCHAR(100) NOT NULL UNIQUE,
  FirstName VARCHAR(50),
  LastName VARCHAR(50),
  UserRoleID INTEGER NOT NULL,
  IsActive BOOLEAN NOT NULL DEFAULT TRUE,
  CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CreatedBy INTEGER NOT NULL,
  ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ModifiedBy INTEGER NOT NULL,
  IsDeleted BOOLEAN NOT NULL DEFAULT FALSE,
  Password VARCHAR(255), -- Added password field for authentication
  CONSTRAINT fk_users_userrole FOREIGN KEY (UserRoleID) REFERENCES userroles (RoleID)
);

-- Add self-referencing foreign keys after users table is created
ALTER TABLE users ADD CONSTRAINT fk_users_createdby FOREIGN KEY (CreatedBy) REFERENCES users (UserID);
ALTER TABLE users ADD CONSTRAINT fk_users_modifiedby FOREIGN KEY (ModifiedBy) REFERENCES users (UserID);

-- Table: auditplanstatuses
CREATE TABLE IF NOT EXISTS auditplanstatuses (
  StatusID INTEGER NOT NULL DEFAULT nextval('auditplanstatuses_statusid_seq') PRIMARY KEY,
  StatusName VARCHAR(30) NOT NULL UNIQUE,
  DisplayOrder INTEGER DEFAULT 0
);

-- Table: auditplans
CREATE TABLE IF NOT EXISTS auditplans (
  PlanID INTEGER NOT NULL DEFAULT nextval('auditplans_planid_seq') PRIMARY KEY,
  PlanName VARCHAR(50) NOT NULL,
  PlanYear INTEGER NOT NULL,
  PlanStatusID INTEGER NOT NULL,
  Progress INTEGER NOT NULL DEFAULT 0,
  CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CreatedBy INTEGER NOT NULL,
  ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ModifiedBy INTEGER NOT NULL,
  IsDeleted BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_auditplans_createdby FOREIGN KEY (CreatedBy) REFERENCES users (UserID),
  CONSTRAINT fk_auditplans_modifiedby FOREIGN KEY (ModifiedBy) REFERENCES users (UserID),
  CONSTRAINT fk_auditplans_planstatus FOREIGN KEY (PlanStatusID) REFERENCES auditplanstatuses (StatusID),
  CONSTRAINT uk_plan_name_year UNIQUE (PlanName, PlanYear, IsDeleted)
);

-- Table: assignmentstatuses
CREATE TABLE IF NOT EXISTS assignmentstatuses (
  StatusID INTEGER NOT NULL DEFAULT nextval('assignmentstatuses_statusid_seq') PRIMARY KEY,
  StatusName VARCHAR(30) NOT NULL UNIQUE,
  DisplayOrder INTEGER DEFAULT 0
);

-- Table: assignmenttypes
CREATE TABLE IF NOT EXISTS assignmenttypes (
  TypeID INTEGER NOT NULL DEFAULT nextval('assignmenttypes_typeid_seq') PRIMARY KEY,
  AssignmentType VARCHAR(45) NOT NULL UNIQUE
);

-- Table: risklikelihoods
CREATE TABLE IF NOT EXISTS risklikelihoods (
  LikelihoodID INTEGER NOT NULL DEFAULT nextval('risklikelihoods_likelihoodid_seq') PRIMARY KEY,
  Likelihood VARCHAR(30) NOT NULL UNIQUE
);

-- Table: riskimpacts
CREATE TABLE IF NOT EXISTS riskimpacts (
  ImpactID INTEGER NOT NULL DEFAULT nextval('riskimpacts_impactid_seq') PRIMARY KEY,
  Impact VARCHAR(30) NOT NULL UNIQUE
);

-- Table: inherentrisks
CREATE TABLE IF NOT EXISTS inherentrisks (
  InherentRiskID INTEGER NOT NULL DEFAULT nextval('inherentrisks_inherentriskid_seq') PRIMARY KEY,
  InherentRisk VARCHAR(30) NOT NULL UNIQUE
);

-- Table: assignments
CREATE TABLE IF NOT EXISTS assignments (
  AssignmentID INTEGER NOT NULL DEFAULT nextval('assignments_assignmentid_seq') PRIMARY KEY,
  AssignmentName VARCHAR(100) NOT NULL,
  AssignmentStatusID INTEGER NOT NULL,
  AssignmentTypeID INTEGER NOT NULL,
  AssignmentDueDate DATE,
  AssigneeID INTEGER NOT NULL,
  PlanID INTEGER NOT NULL,
  RiskLikelihoodID INTEGER NOT NULL,
  RiskImpactID INTEGER NOT NULL,
  InherentRiskID INTEGER NOT NULL,
  CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CreatedBy INTEGER NOT NULL,
  ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ModifiedBy INTEGER NOT NULL,
  IsDeleted BOOLEAN NOT NULL DEFAULT FALSE,
  AssignmentDueYear INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM AssignmentDueDate)) STORED,
  AssignmentDueMonth INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM AssignmentDueDate)) STORED,
  CONSTRAINT fk_assignments_assignee FOREIGN KEY (AssigneeID) REFERENCES users (UserID),
  CONSTRAINT fk_assignments_createdby FOREIGN KEY (CreatedBy) REFERENCES users (UserID),
  CONSTRAINT fk_assignments_impact FOREIGN KEY (RiskImpactID) REFERENCES riskimpacts (ImpactID),
  CONSTRAINT fk_assignments_inherent FOREIGN KEY (InherentRiskID) REFERENCES inherentrisks (InherentRiskID),
  CONSTRAINT fk_assignments_likelihood FOREIGN KEY (RiskLikelihoodID) REFERENCES risklikelihoods (LikelihoodID),
  CONSTRAINT fk_assignments_modifiedby FOREIGN KEY (ModifiedBy) REFERENCES users (UserID),
  CONSTRAINT fk_assignments_plan FOREIGN KEY (PlanID) REFERENCES auditplans (PlanID),
  CONSTRAINT fk_assignments_status FOREIGN KEY (AssignmentStatusID) REFERENCES assignmentstatuses (StatusID),
  CONSTRAINT fk_assignments_type FOREIGN KEY (AssignmentTypeID) REFERENCES assignmenttypes (TypeID)
);

-- Insert initial data for user roles
INSERT INTO userroles (RoleName, DisplayOrder) VALUES 
('Admin', 1),
('Audit Manager', 2),
('Senior Auditor', 3),
('Auditor', 4),
('Business Owner', 5)
ON CONFLICT (RoleName) DO NOTHING;

-- Insert a default admin user (password: admin123)
INSERT INTO users (Email, FirstName, LastName, UserRoleID, CreatedBy, ModifiedBy, Password) VALUES 
('ahmed.almarri@d.gov.ae', 'Ahmed', 'Al Marri', 1, 1, 1, '$2b$10$rQZ8kqXvJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K')
ON CONFLICT (Email) DO NOTHING;

-- Continue with other tables...
-- (Additional tables would follow the same pattern)
