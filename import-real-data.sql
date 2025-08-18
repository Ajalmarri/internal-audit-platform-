-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert lookup tables first (no dependencies)
INSERT INTO AuditPlanStatuses (StatusName, DisplayOrder) VALUES
('Draft', 1), ('In Progress', 2), ('Completed', 3), ('Cancelled', 4);

INSERT INTO UserRoles (RoleName, DisplayOrder) VALUES
('Admin', 1), ('Audit Manager', 2), ('Risk Manager', 3), ('Auditor', 4), ('Member', 5);

INSERT INTO AssignmentStatuses (StatusName, DisplayOrder) VALUES
('Planning', 1), ('Preparation', 2), ('Fieldwork', 3), ('Reporting', 4), ('Follow-up', 5), ('Completed', 6), ('Cancelled', 7);

INSERT INTO AssignmentTypes (AssignmentType) VALUES
('Financial Audit'), ('IT Audit'), ('Operational Audit'), ('Compliance Audit'), ('Risk Assessment');

INSERT INTO RiskLikelihoods (Likelihood) VALUES
('Very Low'), ('Low'), ('Medium'), ('High'), ('Very High');

INSERT INTO RiskImpacts (Impact) VALUES
('Negligible'), ('Minor'), ('Moderate'), ('Major'), ('Severe');

INSERT INTO InherentRisks (InherentRisk) VALUES
('Very Low'), ('Low'), ('Medium'), ('High'), ('Very High');

INSERT INTO AuditTaskStatuses (StatusName, DisplayOrder) VALUES
('Not Started', 1), ('In Progress', 2), ('Under Review', 3), ('Completed', 4), ('On Hold', 5), ('Cancelled', 6);

INSERT INTO EngagementStatuses (EngagementStatus) VALUES
('Planning'), ('Active'), ('On Hold'), ('Completed'), ('Cancelled');

INSERT INTO FindingStatuses (FindingStatus, DisplayOrder) VALUES
('Draft', 1), ('Pending Verification', 2), ('Verified', 3), ('Sent to Business Owner', 4), 
('Action Plan Submitted', 5), ('Action Plan Accepted', 6), ('In Remediation', 7), 
('Remediation Pending Verification', 8), ('Resolved', 9), ('Closed', 10), ('Rejected', 11);

INSERT INTO Severities (Severity) VALUES
('Low'), ('Medium'), ('High'), ('Critical');

INSERT INTO ActionPlanStatuses (ActionPlanStatus, DisplayOrder) VALUES
('To Do', 1), ('In Progress', 2), ('Completed', 3), ('Blocked', 4);

INSERT INTO PrimaryStakeholders (PrimaryStakeholder, IsDeleted) VALUES
('IT Department', 0),
('Finance Department', 0),
('Operations Team', 0),
('HR Department', 0),
('Legal Department', 0),
('Procurement Department', 0);

-- Insert Users (bootstrap user first)
INSERT INTO Users (Email, FirstName, LastName, UserRoleID, IsActive, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('ahmed.almarri@d.gov.ae', 'Ahmed', 'AlMarri', 1, 1, '2024-01-01 08:00:00', 1, '2024-01-01 08:00:00', 1, 0),
('ahmed.almarri2@d.gov.ae', 'Ahmed', 'AlMarri', 4, 1, '2024-01-02 09:15:00', 1, '2024-01-02 09:15:00', 1, 0),
('ahmad.almarzooqi@d.gov.ae', 'Ahmad', 'AlMarzooqi', 2, 1, '2024-01-03 10:30:00', 1, '2024-01-03 10:30:00', 1, 0),
('hamda.abdulla@d.gov.ae', 'Hamda', 'Abdulla', 4, 1, '2024-01-04 11:45:00', 1, '2024-01-04 11:45:00', 1, 0),
('anastasia.romanova@d.gov.ae', 'Anastasia', 'Romanova', 3, 0, '2024-01-05 13:20:00', 1, '2024-01-05 13:20:00', 1, 1);

-- Insert AuditPlans
INSERT INTO AuditPlans (PlanName, PlanYear, PlanStatusID, Progress, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('IT Security Audit', 2024, 2, 75, '2024-01-15 09:00:00', 1, '2024-01-15 09:00:00', 1, 0),
('Financial Controls Review', 2024, 1, 25, '2024-02-01 10:30:00', 1, '2024-02-01 10:30:00', 1, 0),
('Operational Risk Assessment', 2024, 3, 100, '2024-01-10 08:15:00', 1, '2024-01-10 08:15:00', 1, 0),
('Old Compliance Audit', 2023, 4, 0, '2023-03-01 14:20:00', 1, '2023-03-01 14:20:00', 1, 1),
('Data Privacy Review', 2024, 2, 50, '2024-02-15 11:45:00', 1, '2024-02-15 11:45:00', 1, 0);

-- Insert Assignments
INSERT INTO Assignments (AssignmentName, AssignmentStatusID, AssignmentTypeID, AssignmentDueDate, AssigneeID, PlanID, RiskLikelihoodID, RiskImpactID, InherentRiskID, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('Network Security Review', 2, 2, '2024-03-15', 2, 1, 3, 4, 4, '2024-01-20 10:00:00', 1, '2024-01-20 10:00:00', 1, 0),
('Financial Controls Testing', 1, 1, '2024-04-01', 4, 2, 2, 3, 3, '2024-02-05 11:30:00', 1, '2024-02-05 11:30:00', 1, 0),
('Process Documentation Review', 3, 3, '2024-02-28', 3, 3, 1, 2, 2, '2024-01-15 09:15:00', 1, '2024-01-15 09:15:00', 1, 0);

-- Insert Findings (with OneDrive file path storage)
INSERT INTO Findings (Title, FindingDescription, AssignmentID, FindingStatusID, SeverityID, BusinessOwnerID, Recommendation, Criteria, Impact, RootCause, ManagementResponse, ManagementComment, AttachmentFilePath, AttachmentFileName, AttachmentFileType, AttachmentFileSize, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, VerifiedBy, SentToBODate, IsDeleted) VALUES
('Weak Password Policy', 'Current password policy does not meet industry standards for complexity and rotation', 1, 3, 3, 1, 'Implement strong password policy with complexity requirements', 'NIST password guidelines', 'Increased risk of unauthorized access', 'Outdated security policies', 1, 'Management agrees to implement stronger controls', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Findings/2024/password_policy_analysis.pdf', 'password_policy_analysis.pdf', 'application/pdf', 245760, '2024-01-25 10:00:00', 2, '2024-01-25 10:00:00', 2, 3, '2024-01-26 14:30:00', 0),
('Inadequate Firewall Configuration', 'Firewall rules allow unnecessary traffic and lack proper documentation', 1, 4, 4, 1, 'Review and update firewall rules, implement proper documentation', 'Network security best practices', 'Potential security breaches', 'Lack of regular security reviews', 0, NULL, 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Findings/2024/firewall_config_report.pdf', 'firewall_config_report.pdf', 'application/pdf', 512000, '2024-01-26 11:15:00', 2, '2024-01-26 11:15:00', 2, 3, '2024-01-27 09:00:00', 0),
('Lack of Segregation of Duties', 'Single individuals can initiate and approve financial transactions', 2, 2, 3, 2, 'Implement segregation of duties in financial processes', 'Internal control frameworks', 'Risk of fraud and errors', 'Insufficient control design', 0, NULL, NULL, NULL, NULL, NULL, '2024-02-08 14:20:00', 4, '2024-02-08 14:20:00', 4, NULL, NULL, 0),
('Missing Backup Verification', 'Backup processes lack verification procedures to ensure data integrity', 1, 5, 2, 1, 'Implement automated backup verification and testing procedures', 'Data backup standards', 'Risk of data loss during recovery', 'Incomplete backup procedures', 1, 'IT will implement verification process', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Findings/2024/backup_test_results.xlsx', 'backup_test_results.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 87432, '2024-01-28 16:45:00', 2, '2024-01-28 16:45:00', 2, 3, '2024-01-29 10:15:00', 0),
('Inadequate Incident Response Plan', 'Current incident response procedures are outdated and incomplete', 1, 1, 3, 1, 'Update and test incident response procedures regularly', 'NIST incident response framework', 'Delayed response to security incidents', 'Lack of regular plan updates', 0, NULL, 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Findings/2024/incident_response_gaps.docx', 'incident_response_gaps.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 156789, '2024-01-30 09:30:00', 2, '2024-01-30 09:30:00', 2, NULL, NULL, 0);

-- Insert ActionPlans
INSERT INTO ActionPlans (ActionPlanDescription, ResponsibleID, DueDate, ActionPlanStatusID, FindingID, IsApproved, Comment, PriorityID, Objective, Criteria, Effort, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('Implement multi-factor authentication for all admin accounts', 1, '2024-04-15', 2, 1, 1, 'Approved by IT management', 4, 'Enhance security controls', 'ISO 27001 compliance', 'High', '2024-02-01 09:00:00', 1, '2024-02-01 09:00:00', 1, 0),
('Update firewall rules to block unauthorized access', 1, '2024-03-30', 1, 2, 0, 'Pending security team review', 3, 'Strengthen network security', 'NIST framework', 'Medium', '2024-02-02 10:15:00', 2, '2024-02-02 10:15:00', 2, 0),
('Establish segregation of duties in payment processing', 2, '2024-05-01', 1, 3, 0, 'Finance team to review', 3, 'Improve financial controls', 'SOX compliance', 'High', '2024-02-03 11:30:00', 3, '2024-02-03 11:30:00', 3, 0),
('Implement automated backup verification process', 1, '2024-04-20', 2, 4, 1, 'IT approved implementation', 2, 'Ensure data integrity', 'Business continuity', 'Medium', '2024-02-04 14:45:00', 1, '2024-02-04 14:45:00', 1, 0),
('Create incident response playbook', 1, '2024-06-15', 1, 5, 0, 'Security team drafting', 3, 'Improve incident handling', 'NIST incident response', 'High', '2024-02-05 08:20:00', 2, '2024-02-05 08:20:00', 2, 0);

-- Insert Actions
INSERT INTO Actions (ActionPlanID, ActionDescription, Details, Responsible, DueDate, ActionStatus) VALUES
(1, 'Configure MFA for admin accounts', 'Set up multi-factor authentication for all administrative accounts using corporate authentication system', 2, '2024-04-10', 2),
(1, 'Test MFA implementation', 'Conduct thorough testing of MFA setup with all admin users', 4, '2024-04-12', 1),
(2, 'Audit current firewall rules', 'Review all existing firewall rules and identify unnecessary permissions', 2, '2024-03-25', 2),
(2, 'Update firewall configuration', 'Implement new firewall rules based on audit findings', 2, '2024-03-28', 1),
(3, 'Map current financial processes', 'Document all current payment and approval processes', 4, '2024-04-20', 1);

-- Insert remaining sample data
INSERT INTO Engagements (EngagementTitle, PrimaryStakeholderID, EngagementManagerID, StartDate, EndDate, StatusID, Objective, Scope, AssignmentID, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('IT Security Assessment', 1, 3, '2024-01-20', '2024-03-15', 1, 'Assess IT security controls and vulnerabilities', 'Network infrastructure and access controls', 1, '2024-01-20 08:00:00', 1, '2024-01-20 08:00:00', 1, 0),
('Financial Controls Review', 2, 3, '2024-02-05', '2024-04-01', 1, 'Review financial controls and procedures', 'Accounts payable and receivable processes', 2, '2024-02-05 10:00:00', 1, '2024-02-05 10:00:00', 1, 0);

INSERT INTO AuditTasks (AuditTaskDescription, StatusID, AssigneeID, AssignmentID, DueDate, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('Review access control policies and procedures', 1, 2, 1, '2024-03-20', '2024-01-21 09:00:00', 1, '2024-01-21 09:00:00', 1, 0),
('Test user authentication mechanisms', 2, 4, 1, '2024-03-25', '2024-01-21 09:15:00', 1, '2024-01-21 09:15:00', 1, 0),
('Document security vulnerabilities found', 3, 2, 1, '2024-03-30', '2024-01-21 09:30:00', 1, '2024-01-21 09:30:00', 1, 0);

-- Insert Documents (with OneDrive file path storage)
INSERT INTO Documents (DocumentName, DocumentFilePath, DocumentFileName, DocumentFileType, DocumentFileSize, AssignmentID, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('IT Security Policy Document', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Assignments/2024/IT_Security_Policy_v2.1.pdf', 'IT_Security_Policy_v2.1.pdf', 'application/pdf', 2048576, 1, '2024-01-20 14:30:00', 2, '2024-01-20 14:30:00', 2, 0),
('Network Topology Diagram', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Assignments/2024/network_topology_diagram.png', 'network_topology_diagram.png', 'image/png', 1536000, 1, '2024-01-21 10:15:00', 4, '2024-01-21 10:15:00', 4, 0),
('Financial Controls Checklist', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Assignments/2024/financial_controls_checklist.xlsx', 'financial_controls_checklist.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 456789, 2, '2024-02-06 09:30:00', 4, '2024-02-06 09:30:00', 4, 0),
('Process Flow Documentation', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Assignments/2024/process_flow_documentation.docx', 'process_flow_documentation.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 789123, 3, '2024-01-16 11:20:00', 3, '2024-01-16 11:20:00', 3, 0),
('Risk Assessment Template', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Templates/risk_assessment_template.xlsx', 'risk_assessment_template.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 234567, 3, '2024-01-17 13:45:00', 3, '2024-01-17 13:45:00', 3, 0);

INSERT INTO Comments (AssignmentID, CommentText, CreatedDate, CreatedBy, IsDeleted) VALUES
(1, 'Initial security assessment shows several vulnerabilities in the network infrastructure that need immediate attention.', '2024-01-22 10:30:00', 2, 0),
(1, 'Updated the firewall rules as discussed. Please review the new configuration before proceeding with testing.', '2024-01-25 14:15:00', 4, 0),
(2, 'Financial controls testing is progressing well. Found minor issues in the approval workflow that can be easily addressed.', '2024-02-10 09:45:00', 4, 0);

-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert lookup tables first (no dependencies)
INSERT INTO AuditPlanStatuses (StatusName, DisplayOrder) VALUES
('Draft', 1), ('In Progress', 2), ('Completed', 3), ('Cancelled', 4);

INSERT INTO UserRoles (RoleName, DisplayOrder) VALUES
('Admin', 1), ('Audit Manager', 2), ('Risk Manager', 3), ('Auditor', 4), ('Member', 5);

INSERT INTO AssignmentStatuses (StatusName, DisplayOrder) VALUES
('Planning', 1), ('Preparation', 2), ('Fieldwork', 3), ('Reporting', 4), ('Follow-up', 5), ('Completed', 6), ('Cancelled', 7);

INSERT INTO AssignmentTypes (AssignmentType) VALUES
('Financial Audit'), ('IT Audit'), ('Operational Audit'), ('Compliance Audit'), ('Risk Assessment');

INSERT INTO RiskLikelihoods (Likelihood) VALUES
('Very Low'), ('Low'), ('Medium'), ('High'), ('Very High');

INSERT INTO RiskImpacts (Impact) VALUES
('Negligible'), ('Minor'), ('Moderate'), ('Major'), ('Severe');

INSERT INTO InherentRisks (InherentRisk) VALUES
('Very Low'), ('Low'), ('Medium'), ('High'), ('Very High');

INSERT INTO AuditTaskStatuses (StatusName, DisplayOrder) VALUES
('Not Started', 1), ('In Progress', 2), ('Under Review', 3), ('Completed', 4), ('On Hold', 5), ('Cancelled', 6);

INSERT INTO EngagementStatuses (EngagementStatus) VALUES
('Planning'), ('Active'), ('On Hold'), ('Completed'), ('Cancelled');

INSERT INTO FindingStatuses (FindingStatus, DisplayOrder) VALUES
('Draft', 1), ('Pending Verification', 2), ('Verified', 3), ('Sent to Business Owner', 4), 
('Action Plan Submitted', 5), ('Action Plan Accepted', 6), ('In Remediation', 7), 
('Remediation Pending Verification', 8), ('Resolved', 9), ('Closed', 10), ('Rejected', 11);

INSERT INTO Severities (Severity) VALUES
('Low'), ('Medium'), ('High'), ('Critical');

INSERT INTO ActionPlanStatuses (ActionPlanStatus, DisplayOrder) VALUES
('To Do', 1), ('In Progress', 2), ('Completed', 3), ('Blocked', 4);

INSERT INTO PrimaryStakeholders (PrimaryStakeholder, IsDeleted) VALUES
('IT Department', 0),
('Finance Department', 0),
('Operations Team', 0),
('HR Department', 0),
('Legal Department', 0),
('Procurement Department', 0);

-- Insert Users (bootstrap user first)
INSERT INTO Users (Email, FirstName, LastName, UserRoleID, IsActive, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('ahmed.almarri@d.gov.ae', 'Ahmed', 'AlMarri', 1, 1, '2024-01-01 08:00:00', 1, '2024-01-01 08:00:00', 1, 0),
('ahmed.almarri2@d.gov.ae', 'Ahmed', 'AlMarri', 4, 1, '2024-01-02 09:15:00', 1, '2024-01-02 09:15:00', 1, 0),
('ahmad.almarzooqi@d.gov.ae', 'Ahmad', 'AlMarzooqi', 2, 1, '2024-01-03 10:30:00', 1, '2024-01-03 10:30:00', 1, 0),
('hamda.abdulla@d.gov.ae', 'Hamda', 'Abdulla', 4, 1, '2024-01-04 11:45:00', 1, '2024-01-04 11:45:00', 1, 0),
('anastasia.romanova@d.gov.ae', 'Anastasia', 'Romanova', 3, 0, '2024-01-05 13:20:00', 1, '2024-01-05 13:20:00', 1, 1);

-- Insert AuditPlans
INSERT INTO AuditPlans (PlanName, PlanYear, PlanStatusID, Progress, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('IT Security Audit', 2024, 2, 75, '2024-01-15 09:00:00', 1, '2024-01-15 09:00:00', 1, 0),
('Financial Controls Review', 2024, 1, 25, '2024-02-01 10:30:00', 1, '2024-02-01 10:30:00', 1, 0),
('Operational Risk Assessment', 2024, 3, 100, '2024-01-10 08:15:00', 1, '2024-01-10 08:15:00', 1, 0),
('Old Compliance Audit', 2023, 4, 0, '2023-03-01 14:20:00', 1, '2023-03-01 14:20:00', 1, 1),
('Data Privacy Review', 2024, 2, 50, '2024-02-15 11:45:00', 1, '2024-02-15 11:45:00', 1, 0);

-- Insert Assignments
INSERT INTO Assignments (AssignmentName, AssignmentStatusID, AssignmentTypeID, AssignmentDueDate, AssigneeID, PlanID, RiskLikelihoodID, RiskImpactID, InherentRiskID, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('Network Security Review', 2, 2, '2024-03-15', 2, 1, 3, 4, 4, '2024-01-20 10:00:00', 1, '2024-01-20 10:00:00', 1, 0),
('Financial Controls Testing', 1, 1, '2024-04-01', 4, 2, 2, 3, 3, '2024-02-05 11:30:00', 1, '2024-02-05 11:30:00', 1, 0),
('Process Documentation Review', 3, 3, '2024-02-28', 3, 3, 1, 2, 2, '2024-01-15 09:15:00', 1, '2024-01-15 09:15:00', 1, 0);

-- Insert Findings (with OneDrive file path storage)
INSERT INTO Findings (Title, FindingDescription, AssignmentID, FindingStatusID, SeverityID, BusinessOwnerID, Recommendation, Criteria, Impact, RootCause, ManagementResponse, ManagementComment, AttachmentFilePath, AttachmentFileName, AttachmentFileType, AttachmentFileSize, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, VerifiedBy, SentToBODate, IsDeleted) VALUES
('Weak Password Policy', 'Current password policy does not meet industry standards for complexity and rotation', 1, 3, 3, 1, 'Implement strong password policy with complexity requirements', 'NIST password guidelines', 'Increased risk of unauthorized access', 'Outdated security policies', 1, 'Management agrees to implement stronger controls', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Findings/2024/password_policy_analysis.pdf', 'password_policy_analysis.pdf', 'application/pdf', 245760, '2024-01-25 10:00:00', 2, '2024-01-25 10:00:00', 2, 3, '2024-01-26 14:30:00', 0),
('Inadequate Firewall Configuration', 'Firewall rules allow unnecessary traffic and lack proper documentation', 1, 4, 4, 1, 'Review and update firewall rules, implement proper documentation', 'Network security best practices', 'Potential security breaches', 'Lack of regular security reviews', 0, NULL, 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Findings/2024/firewall_config_report.pdf', 'firewall_config_report.pdf', 'application/pdf', 512000, '2024-01-26 11:15:00', 2, '2024-01-26 11:15:00', 2, 3, '2024-01-27 09:00:00', 0),
('Lack of Segregation of Duties', 'Single individuals can initiate and approve financial transactions', 2, 2, 3, 2, 'Implement segregation of duties in financial processes', 'Internal control frameworks', 'Risk of fraud and errors', 'Insufficient control design', 0, NULL, NULL, NULL, NULL, NULL, '2024-02-08 14:20:00', 4, '2024-02-08 14:20:00', 4, NULL, NULL, 0),
('Missing Backup Verification', 'Backup processes lack verification procedures to ensure data integrity', 1, 5, 2, 1, 'Implement automated backup verification and testing procedures', 'Data backup standards', 'Risk of data loss during recovery', 'Incomplete backup procedures', 1, 'IT will implement verification process', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Findings/2024/backup_test_results.xlsx', 'backup_test_results.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 87432, '2024-01-28 16:45:00', 2, '2024-01-28 16:45:00', 2, 3, '2024-01-29 10:15:00', 0),
('Inadequate Incident Response Plan', 'Current incident response procedures are outdated and incomplete', 1, 1, 3, 1, 'Update and test incident response procedures regularly', 'NIST incident response framework', 'Delayed response to security incidents', 'Lack of regular plan updates', 0, NULL, 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Findings/2024/incident_response_gaps.docx', 'incident_response_gaps.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 156789, '2024-01-30 09:30:00', 2, '2024-01-30 09:30:00', 2, NULL, NULL, 0);

-- Insert ActionPlans
INSERT INTO ActionPlans (ActionPlanDescription, ResponsibleID, DueDate, ActionPlanStatusID, FindingID, IsApproved, Comment, PriorityID, Objective, Criteria, Effort, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('Implement multi-factor authentication for all admin accounts', 1, '2024-04-15', 2, 1, 1, 'Approved by IT management', 4, 'Enhance security controls', 'ISO 27001 compliance', 'High', '2024-02-01 09:00:00', 1, '2024-02-01 09:00:00', 1, 0),
('Update firewall rules to block unauthorized access', 1, '2024-03-30', 1, 2, 0, 'Pending security team review', 3, 'Strengthen network security', 'NIST framework', 'Medium', '2024-02-02 10:15:00', 2, '2024-02-02 10:15:00', 2, 0),
('Establish segregation of duties in payment processing', 2, '2024-05-01', 1, 3, 0, 'Finance team to review', 3, 'Improve financial controls', 'SOX compliance', 'High', '2024-02-03 11:30:00', 3, '2024-02-03 11:30:00', 3, 0),
('Implement automated backup verification process', 1, '2024-04-20', 2, 4, 1, 'IT approved implementation', 2, 'Ensure data integrity', 'Business continuity', 'Medium', '2024-02-04 14:45:00', 1, '2024-02-04 14:45:00', 1, 0),
('Create incident response playbook', 1, '2024-06-15', 1, 5, 0, 'Security team drafting', 3, 'Improve incident handling', 'NIST incident response', 'High', '2024-02-05 08:20:00', 2, '2024-02-05 08:20:00', 2, 0);

-- Insert Actions
INSERT INTO Actions (ActionPlanID, ActionDescription, Details, Responsible, DueDate, ActionStatus) VALUES
(1, 'Configure MFA for admin accounts', 'Set up multi-factor authentication for all administrative accounts using corporate authentication system', 2, '2024-04-10', 2),
(1, 'Test MFA implementation', 'Conduct thorough testing of MFA setup with all admin users', 4, '2024-04-12', 1),
(2, 'Audit current firewall rules', 'Review all existing firewall rules and identify unnecessary permissions', 2, '2024-03-25', 2),
(2, 'Update firewall configuration', 'Implement new firewall rules based on audit findings', 2, '2024-03-28', 1),
(3, 'Map current financial processes', 'Document all current payment and approval processes', 4, '2024-04-20', 1);

-- Insert remaining sample data
INSERT INTO Engagements (EngagementTitle, PrimaryStakeholderID, EngagementManagerID, StartDate, EndDate, StatusID, Objective, Scope, AssignmentID, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('IT Security Assessment', 1, 3, '2024-01-20', '2024-03-15', 1, 'Assess IT security controls and vulnerabilities', 'Network infrastructure and access controls', 1, '2024-01-20 08:00:00', 1, '2024-01-20 08:00:00', 1, 0),
('Financial Controls Review', 2, 3, '2024-02-05', '2024-04-01', 1, 'Review financial controls and procedures', 'Accounts payable and receivable processes', 2, '2024-02-05 10:00:00', 1, '2024-02-05 10:00:00', 1, 0);

INSERT INTO AuditTasks (AuditTaskDescription, StatusID, AssigneeID, AssignmentID, DueDate, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('Review access control policies and procedures', 1, 2, 1, '2024-03-20', '2024-01-21 09:00:00', 1, '2024-01-21 09:00:00', 1, 0),
('Test user authentication mechanisms', 2, 4, 1, '2024-03-25', '2024-01-21 09:15:00', 1, '2024-01-21 09:15:00', 1, 0),
('Document security vulnerabilities found', 3, 2, 1, '2024-03-30', '2024-01-21 09:30:00', 1, '2024-01-21 09:30:00', 1, 0);

-- Insert Documents (with OneDrive file path storage)
INSERT INTO Documents (DocumentName, DocumentFilePath, DocumentFileName, DocumentFileType, DocumentFileSize, AssignmentID, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, IsDeleted) VALUES
('IT Security Policy Document', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Assignments/2024/IT_Security_Policy_v2.1.pdf', 'IT_Security_Policy_v2.1.pdf', 'application/pdf', 2048576, 1, '2024-01-20 14:30:00', 2, '2024-01-20 14:30:00', 2, 0),
('Network Topology Diagram', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Assignments/2024/network_topology_diagram.png', 'network_topology_diagram.png', 'image/png', 1536000, 1, '2024-01-21 10:15:00', 4, '2024-01-21 10:15:00', 4, 0),
('Financial Controls Checklist', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Assignments/2024/financial_controls_checklist.xlsx', 'financial_controls_checklist.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 456789, 2, '2024-02-06 09:30:00', 4, '2024-02-06 09:30:00', 4, 0),
('Process Flow Documentation', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Assignments/2024/process_flow_documentation.docx', 'process_flow_documentation.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 789123, 3, '2024-01-16 11:20:00', 3, '2024-01-16 11:20:00', 3, 0),
('Risk Assessment Template', 'https://d365gov-my.sharepoint.com/personal/audit_d_gov_ae/Documents/Templates/risk_assessment_template.xlsx', 'risk_assessment_template.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 234567, 3, '2024-01-17 13:45:00', 3, '2024-01-17 13:45:00', 3, 0);

INSERT INTO Comments (AssignmentID, CommentText, CreatedDate, CreatedBy, IsDeleted) VALUES
(1, 'Initial security assessment shows several vulnerabilities in the network infrastructure that need immediate attention.', '2024-01-22 10:30:00', 2, 0),
(1, 'Updated the firewall rules as discussed. Please review the new configuration before proceeding with testing.', '2024-01-25 14:15:00', 4, 0),
(2, 'Financial controls testing is progressing well. Found minor issues in the approval workflow that can be easily addressed.', '2024-02-10 09:45:00', 4, 0);

