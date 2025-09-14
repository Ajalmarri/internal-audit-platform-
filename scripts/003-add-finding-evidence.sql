-- Migration: Add FindingID to DOCUMENTS table for evidence management
-- This allows documents to be directly linked to findings

-- Add FindingID column (ignore error if it already exists)
ALTER TABLE DOCUMENTS ADD COLUMN FindingID INT NULL;

-- Add index for performance (ignore error if it already exists)
ALTER TABLE DOCUMENTS ADD INDEX ix_documents_finding (FindingID);

-- Add foreign key constraint (ignore error if it already exists)
ALTER TABLE DOCUMENTS ADD CONSTRAINT fk_documents_finding
  FOREIGN KEY (FindingID) REFERENCES FINDINGS(FindingID)
  ON DELETE SET NULL;
