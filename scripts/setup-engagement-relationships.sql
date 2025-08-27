-- =====================================================
-- SETUP ENGAGEMENT RELATIONSHIPS
-- This script creates the missing tables needed for full engagement functionality
-- =====================================================

-- 1. Create engagementassignments table to link engagements with assignments
CREATE TABLE IF NOT EXISTS `engagementassignments` (
  `EngagementAssignmentID` int NOT NULL AUTO_INCREMENT,
  `EngagementID` int NOT NULL,
  `AssignmentID` int NOT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`EngagementAssignmentID`),
  UNIQUE KEY `unique_engagement_assignment` (`EngagementID`, `AssignmentID`),
  CONSTRAINT `fk_engagementassignments_engagement` FOREIGN KEY (`EngagementID`) REFERENCES `engagements` (`EngagementID`),
  CONSTRAINT `fk_engagementassignments_assignment` FOREIGN KEY (`AssignmentID`) REFERENCES `assignments` (`AssignmentID`),
  CONSTRAINT `fk_engagementassignments_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Add EngagementID field to findings table
ALTER TABLE `findings` 
ADD COLUMN `EngagementID` int NULL AFTER `FindingID`,
ADD CONSTRAINT `fk_findings_engagement` FOREIGN KEY (`EngagementID`) REFERENCES `engagements` (`EngagementID`);

-- 3. Create evidence table for engagement-related documents
CREATE TABLE IF NOT EXISTS `evidence` (
  `EvidenceID` int NOT NULL AUTO_INCREMENT,
  `EngagementID` int NOT NULL,
  `EvidenceTitle` varchar(255) NOT NULL,
  `EvidenceType` varchar(100) NOT NULL,
  `Description` text,
  `FilePath` varchar(500),
  `FileName` varchar(255),
  `FileType` varchar(100),
  `FileSize` int,
  `UploadDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Status` varchar(50) DEFAULT 'Pending Review',
  `CreatedBy` int NOT NULL,
  `ModifiedDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ModifiedBy` int NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`EvidenceID`),
  CONSTRAINT `fk_evidence_engagement` FOREIGN KEY (`EngagementID`) REFERENCES `engagements` (`EngagementID`),
  CONSTRAINT `fk_evidence_createdby` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserID`),
  CONSTRAINT `fk_evidence_modifiedby` FOREIGN KEY (`ModifiedBy`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Insert sample data for testing (optional)
-- INSERT INTO engagementassignments (EngagementID, AssignmentID, CreatedBy) VALUES (3, 1, 1);
-- INSERT INTO evidence (EngagementID, EvidenceTitle, EvidenceType, Description, CreatedBy, ModifiedBy) VALUES (3, 'IT Control Review Document', 'Document', 'Initial IT control assessment', 1, 1);

-- 5. Create indexes for better performance
CREATE INDEX `idx_engagementassignments_engagement` ON `engagementassignments` (`EngagementID`);
CREATE INDEX `idx_engagementassignments_assignment` ON `engagementassignments` (`AssignmentID`);
CREATE INDEX `idx_findings_engagement` ON `findings` (`EngagementID`);
CREATE INDEX `idx_evidence_engagement` ON `evidence` (`EngagementID`);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT 'engagementassignments' as table_name, COUNT(*) as record_count FROM engagementassignments
UNION ALL
SELECT 'evidence' as table_name, COUNT(*) as record_count FROM evidence;

-- Check if EngagementID was added to findings
DESCRIBE findings;

-- Check foreign key constraints
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = 'audit_platform' 
AND REFERENCED_TABLE_NAME IN ('engagements', 'assignments', 'users');
