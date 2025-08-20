-- =====================================================
-- AUDIT PLATFORM DATABASE SCHEMA EXTRACTION
-- Generated on: 2025-08-15T06:18:01.116Z
-- Database: audit_platform
-- =====================================================

-- Table: actionplans
-- Type: BASE TABLE

CREATE TABLE `actionplans` (
  `ActionPlanID` int NOT NULL auto_increment,
  `ActionPlanDescription` text NOT NULL,
  `ResponsibleID` int NOT NULL,
  `DueDate` date,
  `ActionPlanStatusID` int NOT NULL,
  `FindingID` int NOT NULL,
  `IsApproved` tinyint(1) NOT NULL DEFAULT '0',
  `Comment` text,
  `PriorityID` int NOT NULL,
  `Objective` text,
  `Criteria` text,
  `Effort` text,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED on update CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `DueYear` int STORED GENERATED,
  `DueMonth` int STORED GENERATED,
  PRIMARY KEY (`ActionPlanID`),
  CONSTRAINT `fk_actionplans_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_actionplans_finding` FOREIGN KEY (`FindingID`) REFERENCES `findings` (`FindingID`),
  CONSTRAINT `fk_actionplans_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_actionplans_priority` FOREIGN KEY (`PriorityID`) REFERENCES `severities` (`SeverityID`),
  CONSTRAINT `fk_actionplans_responsible` FOREIGN KEY (`ResponsibleID`) REFERENCES `primarystakeholders` (`PrimaryStakeholderID`),
  CONSTRAINT `fk_actionplans_status` FOREIGN KEY (`ActionPlanStatusID`) REFERENCES `actionplanstatuses` (`ActionPlanStatusID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: actionplanstatuses
-- Type: BASE TABLE

CREATE TABLE `actionplanstatuses` (
  `ActionPlanStatusID` int NOT NULL auto_increment,
  `ActionPlanStatus` varchar(30) NOT NULL,
  `DisplayOrder` int DEFAULT '0',
  PRIMARY KEY (`ActionPlanStatusID`),
  UNIQUE KEY `ActionPlanStatus` (`ActionPlanStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Table: actions
-- Type: BASE TABLE

CREATE TABLE `actions` (
  `ActionID` int NOT NULL auto_increment,
  `ActionPlanID` int NOT NULL,
  `ActionDescription` text NOT NULL,
  `Details` text,
  `Responsible` int NOT NULL,
  `DueDate` date,
  `ActionStatus` int NOT NULL,
  `DueYear` int STORED GENERATED,
  `DueMonth` int STORED GENERATED,
  PRIMARY KEY (`ActionID`),
  CONSTRAINT `fk_actions_actionplan` FOREIGN KEY (`ActionPlanID`) REFERENCES `actionplans` (`ActionPlanID`),
  CONSTRAINT `fk_actions_responsible` FOREIGN KEY (`Responsible`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_actions_status` FOREIGN KEY (`ActionStatus`) REFERENCES `actionplanstatuses` (`ActionPlanStatusID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: assignments
-- Type: BASE TABLE

CREATE TABLE `assignments` (
  `AssignmentID` int NOT NULL auto_increment,
  `AssignmentName` varchar(100) NOT NULL,
  `AssignmentStatusID` int NOT NULL,
  `AssignmentTypeID` int NOT NULL,
  `AssignmentDueDate` date,
  `AssigneeID` int NOT NULL,
  `PlanID` int NOT NULL,
  `RiskLikelihoodID` int NOT NULL,
  `RiskImpactID` int NOT NULL,
  `InherentRiskID` int NOT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED on update CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `AssignmentDueYear` int STORED GENERATED,
  `AssignmentDueMonth` int STORED GENERATED,
  PRIMARY KEY (`AssignmentID`),
  CONSTRAINT `fk_assignments_assignee` FOREIGN KEY (`AssigneeID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_assignments_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_assignments_impact` FOREIGN KEY (`RiskImpactID`) REFERENCES `riskimpacts` (`ImpactID`),
  CONSTRAINT `fk_assignments_inherent` FOREIGN KEY (`InherentRiskID`) REFERENCES `inherentrisks` (`InherentRiskID`),
  CONSTRAINT `fk_assignments_likelihood` FOREIGN KEY (`RiskLikelihoodID`) REFERENCES `risklikelihoods` (`LikelihoodID`),
  CONSTRAINT `fk_assignments_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_assignments_plan` FOREIGN KEY (`PlanID`) REFERENCES `auditplans` (`PlanID`),
  CONSTRAINT `fk_assignments_status` FOREIGN KEY (`AssignmentStatusID`) REFERENCES `assignmentstatuses` (`StatusID`),
  CONSTRAINT `fk_assignments_type` FOREIGN KEY (`AssignmentTypeID`) REFERENCES `assignmenttypes` (`TypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Table: assignmentstatuses
-- Type: BASE TABLE

CREATE TABLE `assignmentstatuses` (
  `StatusID` int NOT NULL auto_increment,
  `StatusName` varchar(30) NOT NULL,
  `DisplayOrder` int DEFAULT '0',
  PRIMARY KEY (`StatusID`),
  UNIQUE KEY `StatusName` (`StatusName`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- Table: assignmenttypes
-- Type: BASE TABLE

CREATE TABLE `assignmenttypes` (
  `TypeID` int NOT NULL auto_increment,
  `AssignmentType` varchar(45) NOT NULL,
  PRIMARY KEY (`TypeID`),
  UNIQUE KEY `AssignmentType` (`AssignmentType`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: auditplans
-- Type: BASE TABLE

CREATE TABLE `auditplans` (
  `PlanID` int NOT NULL auto_increment,
  `PlanName` varchar(50) NOT NULL,
  `PlanYear` year NOT NULL,
  `PlanStatusID` int NOT NULL,
  `Progress` int NOT NULL DEFAULT '0',
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED on update CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`PlanID`),
  UNIQUE KEY `uk_plan_name_year` (`PlanName`, `PlanYear`, `IsDeleted`),
  CONSTRAINT `fk_auditplans_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_auditplans_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_auditplans_planstatus` FOREIGN KEY (`PlanStatusID`) REFERENCES `auditplanstatuses` (`StatusID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: auditplanstatuses
-- Type: BASE TABLE

CREATE TABLE `auditplanstatuses` (
  `StatusID` int NOT NULL auto_increment,
  `StatusName` varchar(30) NOT NULL,
  `DisplayOrder` int DEFAULT '0',
  PRIMARY KEY (`StatusID`),
  UNIQUE KEY `StatusName` (`StatusName`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Table: audittasks
-- Type: BASE TABLE

CREATE TABLE `audittasks` (
  `TaskID` int NOT NULL auto_increment,
  `AuditTaskDescription` varchar(300) NOT NULL,
  `StatusID` int NOT NULL,
  `AssigneeID` int NOT NULL,
  `AssignmentID` int NOT NULL,
  `DueDate` date,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED on update CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `DueYear` int STORED GENERATED,
  `DueMonth` int STORED GENERATED,
  PRIMARY KEY (`TaskID`),
  CONSTRAINT `fk_audittasks_assignee` FOREIGN KEY (`AssigneeID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_audittasks_assignment` FOREIGN KEY (`AssignmentID`) REFERENCES `assignments` (`AssignmentID`),
  CONSTRAINT `fk_audittasks_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_audittasks_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_audittasks_status` FOREIGN KEY (`StatusID`) REFERENCES `audittaskstatuses` (`StatusID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Table: audittaskstatuses
-- Type: BASE TABLE

CREATE TABLE `audittaskstatuses` (
  `StatusID` int NOT NULL auto_increment,
  `StatusName` varchar(30) NOT NULL,
  `DisplayOrder` int DEFAULT '0',
  PRIMARY KEY (`StatusID`),
  UNIQUE KEY `StatusName` (`StatusName`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Table: comments
-- Type: BASE TABLE

CREATE TABLE `comments` (
  `CommentID` int NOT NULL auto_increment,
  `AssignmentID` int NOT NULL,
  `CommentText` text NOT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `CreatedYear` int STORED GENERATED,
  `CreatedMonth` int STORED GENERATED,
  PRIMARY KEY (`CommentID`),
  CONSTRAINT `fk_comments_assignment` FOREIGN KEY (`AssignmentID`) REFERENCES `assignments` (`AssignmentID`),
  CONSTRAINT `fk_comments_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Table: documents
-- Type: BASE TABLE

CREATE TABLE `documents` (
  `DocumentID` int NOT NULL auto_increment,
  `DocumentName` varchar(255) NOT NULL,
  `DocumentFilePath` varchar(500),
  `DocumentFileName` varchar(255),
  `DocumentFileType` varchar(100),
  `DocumentFileSize` int,
  `AssignmentID` int NOT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED on update CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `CreatedYear` int STORED GENERATED,
  `CreatedMonth` int STORED GENERATED,
  PRIMARY KEY (`DocumentID`),
  CONSTRAINT `fk_documents_assignment` FOREIGN KEY (`AssignmentID`) REFERENCES `assignments` (`AssignmentID`),
  CONSTRAINT `fk_documents_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_documents_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: engagements
-- Type: BASE TABLE

CREATE TABLE `engagements` (
  `EngagementID` int NOT NULL auto_increment,
  `EngagementTitle` varchar(200) NOT NULL,
  `PrimaryStakeholderID` int NOT NULL,
  `EngagementManagerID` int NOT NULL,
  `StartDate` date,
  `EndDate` date,
  `StatusID` int NOT NULL,
  `Objective` text,
  `Scope` text,
  `AssignmentID` int NOT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED on update CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `StartYear` int STORED GENERATED,
  `StartMonth` int STORED GENERATED,
  PRIMARY KEY (`EngagementID`),
  CONSTRAINT `fk_engagements_assignment` FOREIGN KEY (`AssignmentID`) REFERENCES `assignments` (`AssignmentID`),
  CONSTRAINT `fk_engagements_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_engagements_manager` FOREIGN KEY (`EngagementManagerID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_engagements_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_engagements_stakeholder` FOREIGN KEY (`PrimaryStakeholderID`) REFERENCES `primarystakeholders` (`PrimaryStakeholderID`),
  CONSTRAINT `fk_engagements_status` FOREIGN KEY (`StatusID`) REFERENCES `engagementstatuses` (`EngagementStatusID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Table: engagementstatuses
-- Type: BASE TABLE

CREATE TABLE `engagementstatuses` (
  `EngagementStatusID` int NOT NULL auto_increment,
  `EngagementStatus` varchar(50) NOT NULL,
  PRIMARY KEY (`EngagementStatusID`),
  UNIQUE KEY `EngagementStatus` (`EngagementStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: findings
-- Type: BASE TABLE

CREATE TABLE `findings` (
  `FindingID` int NOT NULL auto_increment,
  `Title` varchar(100) NOT NULL,
  `FindingDescription` text NOT NULL,
  `AssignmentID` int NOT NULL,
  `FindingStatusID` int NOT NULL,
  `SeverityID` int NOT NULL,
  `BusinessOwnerID` int NOT NULL,
  `Recommendation` text,
  `Criteria` text,
  `Impact` text,
  `RootCause` text,
  `ManagementResponse` tinyint(1) NOT NULL DEFAULT '0',
  `ManagementComment` text,
  `AttachmentFilePath` varchar(500),
  `AttachmentFileName` varchar(255),
  `AttachmentFileType` varchar(100),
  `AttachmentFileSize` int,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED on update CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `VerifiedBy` int,
  `SentToBODate` datetime,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `CreatedYear` int STORED GENERATED,
  `CreatedMonth` int STORED GENERATED,
  PRIMARY KEY (`FindingID`),
  CONSTRAINT `fk_findings_assignment` FOREIGN KEY (`AssignmentID`) REFERENCES `assignments` (`AssignmentID`),
  CONSTRAINT `fk_findings_businessowner` FOREIGN KEY (`BusinessOwnerID`) REFERENCES `primarystakeholders` (`PrimaryStakeholderID`),
  CONSTRAINT `fk_findings_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_findings_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_findings_severity` FOREIGN KEY (`SeverityID`) REFERENCES `severities` (`SeverityID`),
  CONSTRAINT `fk_findings_status` FOREIGN KEY (`FindingStatusID`) REFERENCES `findingstatuses` (`FindingStatusID`),
  CONSTRAINT `fk_findings_verifiedby` FOREIGN KEY (`VerifiedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: findingstatuses
-- Type: BASE TABLE

CREATE TABLE `findingstatuses` (
  `FindingStatusID` int NOT NULL auto_increment,
  `FindingStatus` varchar(50) NOT NULL,
  `DisplayOrder` int DEFAULT '0',
  PRIMARY KEY (`FindingStatusID`),
  UNIQUE KEY `FindingStatus` (`FindingStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- Table: inherentrisks
-- Type: BASE TABLE

CREATE TABLE `inherentrisks` (
  `InherentRiskID` int NOT NULL auto_increment,
  `InherentRisk` varchar(30) NOT NULL,
  PRIMARY KEY (`InherentRiskID`),
  UNIQUE KEY `InherentRisk` (`InherentRisk`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: primarystakeholders
-- Type: BASE TABLE

CREATE TABLE `primarystakeholders` (
  `PrimaryStakeholderID` int NOT NULL auto_increment,
  `PrimaryStakeholder` varchar(100) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`PrimaryStakeholderID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Table: riskimpacts
-- Type: BASE TABLE

CREATE TABLE `riskimpacts` (
  `ImpactID` int NOT NULL auto_increment,
  `Impact` varchar(30) NOT NULL,
  PRIMARY KEY (`ImpactID`),
  UNIQUE KEY `Impact` (`Impact`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: risklikelihoods
-- Type: BASE TABLE

CREATE TABLE `risklikelihoods` (
  `LikelihoodID` int NOT NULL auto_increment,
  `Likelihood` varchar(30) NOT NULL,
  PRIMARY KEY (`LikelihoodID`),
  UNIQUE KEY `Likelihood` (`Likelihood`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: severities
-- Type: BASE TABLE

CREATE TABLE `severities` (
  `SeverityID` int NOT NULL auto_increment,
  `Severity` varchar(30) NOT NULL,
  PRIMARY KEY (`SeverityID`),
  UNIQUE KEY `Severity` (`Severity`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Table: userroles
-- Type: BASE TABLE

CREATE TABLE `userroles` (
  `RoleID` int NOT NULL auto_increment,
  `RoleName` varchar(30) NOT NULL,
  `DisplayOrder` int DEFAULT '0',
  PRIMARY KEY (`RoleID`),
  UNIQUE KEY `RoleName` (`RoleName`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Table: users
-- Type: BASE TABLE

CREATE TABLE `users` (
  `UserID` int NOT NULL auto_increment,
  `Email` varchar(100) NOT NULL,
  `FirstName` varchar(50),
  `LastName` varchar(50),
  `UserRoleID` int NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED,
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP DEFAULT_GENERATED on update CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  CONSTRAINT `fk_users_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_users_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_users_userrole` FOREIGN KEY (`UserRoleID`) REFERENCES `userroles` (`RoleID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
