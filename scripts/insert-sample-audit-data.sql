-- Insert sample audit plan statuses
INSERT INTO auditplanstatuses (statusid, statusname, displayorder) VALUES
(1, 'Draft', 1),
(2, 'Active', 2),
(3, 'In Progress', 3),
(4, 'Completed', 4),
(5, 'Cancelled', 5)
ON CONFLICT (statusid) DO NOTHING;

-- Insert sample audit plans
INSERT INTO auditplans (planid, planname, planyear, planstatusid, progress, isdeleted, createddate, createdby, modifieddate, modifiedby) VALUES
(1, 'Annual Internal Audit Plan 2025', 2025, 2, 25, false, NOW(), 1, NOW(), 1),
(2, 'Risk Assessment Audit 2025', 2025, 3, 60, false, NOW(), 1, NOW(), 1),
(3, 'Compliance Audit Plan 2024', 2024, 4, 100, false, NOW(), 1, NOW(), 1),
(4, 'Financial Audit 2025', 2025, 1, 0, false, NOW(), 1, NOW(), 1)
ON CONFLICT (planid) DO NOTHING;

-- Insert sample assignments
INSERT INTO assignments (assignmentid, assignmentname, planid, assignmentstatusid, assigneeid, assignmentduedate, assignmentduemonth, assignmentdueyear, isdeleted, createddate, createdby, modifieddate, modifiedby, assignmenttypeid, inherentriskid, riskimpactid, risklikelihoodid) VALUES
(1, 'IT Security Assessment', 1, 1, 1, '2025-03-15', 3, 2025, false, NOW(), 1, NOW(), 1, 1, 1, 1, 1),
(2, 'Financial Controls Review', 1, 1, 1, '2025-04-30', 4, 2025, false, NOW(), 1, NOW(), 1, 1, 1, 1, 1),
(3, 'Procurement Process Audit', 2, 2, 1, '2025-05-15', 5, 2025, false, NOW(), 1, NOW(), 1, 1, 1, 1, 1)
ON CONFLICT (assignmentid) DO NOTHING;

-- Insert sample assignment statuses
INSERT INTO assignmentstatuses (statusid, statusname, displayorder) VALUES
(1, 'Not Started', 1),
(2, 'In Progress', 2),
(3, 'Completed', 3),
(4, 'Overdue', 4),
(5, 'Blocked', 5)
ON CONFLICT (statusid) DO NOTHING;

-- Insert sample assignment types
INSERT INTO assignmenttypes (typeid, assignmenttype) VALUES
(1, 'Internal Audit'),
(2, 'Risk Assessment'),
(3, 'Compliance Review')
ON CONFLICT (typeid) DO NOTHING;

-- Insert sample risk data
INSERT INTO inherentrisks (inherentriskid, inherentrisk) VALUES
(1, 'High Risk'),
(2, 'Medium Risk'),
(3, 'Low Risk')
ON CONFLICT (inherentriskid) DO NOTHING;

INSERT INTO riskimpacts (impactid, impact) VALUES
(1, 'High Impact'),
(2, 'Medium Impact'),
(3, 'Low Impact')
ON CONFLICT (impactid) DO NOTHING;

INSERT INTO risklikelihoods (likelihoodid, likelihood) VALUES
(1, 'High Likelihood'),
(2, 'Medium Likelihood'),
(3, 'Low Likelihood')
ON CONFLICT (likelihoodid) DO NOTHING;
