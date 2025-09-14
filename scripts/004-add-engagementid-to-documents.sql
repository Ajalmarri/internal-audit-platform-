-- Migration: Add EngagementID column to DOCUMENTS table
-- This allows documents to be linked to both assignments and engagements

-- Add EngagementID column (ignore error if it already exists)
ALTER TABLE DOCUMENTS ADD COLUMN EngagementID INT NULL;

-- Add index for performance (ignore error if it already exists)
ALTER TABLE DOCUMENTS ADD INDEX ix_documents_engagement (EngagementID);

-- Add foreign key constraint (ignore error if it already exists)
ALTER TABLE DOCUMENTS ADD CONSTRAINT fk_documents_engagement
  FOREIGN KEY (EngagementID) REFERENCES ENGAGEMENTS(EngagementID)
  ON DELETE SET NULL;




