import type React from "react"
export interface ArticleCategory {
  id: string
  slug: string
  name: string
  description: string
  icon: React.ElementType // Lucide icon component
}

export interface KnowledgeArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string // Can be Markdown or HTML
  categoryId: string
  categoryName?: string // Denormalized for convenience
  lastUpdated: string // ISO date string
  tags?: string[]
  isFeatured?: boolean
  author?: string
  authorAvatar?: string
}

// Mock Data
import { ClipboardList, ShieldAlert, BookOpen, FileLock, Users, TrendingUp, Settings2 } from "lucide-react"

export const mockCategories: ArticleCategory[] = [
  {
    id: "cat1",
    slug: "audit-methodologies",
    name: "Audit Methodologies",
    description: "Guides on conducting audits.",
    icon: ClipboardList,
  },
  {
    id: "cat2",
    slug: "risk-assessment-frameworks",
    name: "Risk Assessment",
    description: "Frameworks for risk analysis.",
    icon: ShieldAlert,
  },
  {
    id: "cat3",
    slug: "platform-how-to-guides",
    name: "Platform How-To Guides",
    description: "Using the audit platform.",
    icon: BookOpen,
  },
  {
    id: "cat4",
    slug: "department-policies",
    name: "Department Policies",
    description: "Official internal policies.",
    icon: FileLock,
  },
  {
    id: "cat5",
    slug: "stakeholder-management",
    name: "Stakeholder Management",
    description: "Communicating with stakeholders.",
    icon: Users,
  },
  {
    id: "cat6",
    slug: "data-analytics",
    name: "Data Analytics in Audit",
    description: "Using data for insights.",
    icon: TrendingUp,
  },
  {
    id: "cat7",
    slug: "tool-configurations",
    name: "Tool Configurations",
    description: "Setting up audit tools.",
    icon: Settings2,
  },
]

export const mockArticles: KnowledgeArticle[] = [
  {
    id: "art1",
    slug: "guide-to-performing-controls-assessment",
    title: "Guide to Performing a Controls Assessment",
    excerpt: "A step-by-step guide on how to effectively assess internal controls within an organization.",
    content: `
      <h2>Introduction</h2>
      <p>Performing a controls assessment is a critical part of the audit process. This guide outlines the key steps involved.</p>
      <h3>Step 1: Planning</h3>
      <p>Define the scope, objectives, and criteria for the assessment. Identify key stakeholders and resources.</p>
      <h3>Step 2: Understanding the Process</h3>
      <p>Gain a thorough understanding of the business process and the controls embedded within it. This may involve interviews, walkthroughs, and documentation review.</p>
      <h3>Step 3: Identifying Key Controls</h3>
      <p>Determine which controls are critical to mitigating the identified risks for the process under review.</p>
      <h3>Step 4: Testing Controls</h3>
      <p>Design and execute tests of control effectiveness. This can include tests of design and tests of operating effectiveness.</p>
      <ul>
        <li>Inquiry</li>
        <li>Observation</li>
        <li>Inspection of relevant documentation</li>
        <li>Re-performance</li>
      </ul>
      <h3>Step 5: Evaluating Results</h3>
      <p>Analyze the test results to determine if controls are operating effectively and as designed.</p>
      <h3>Step 6: Reporting</h3>
      <p>Document the findings, conclusions, and any recommendations for improvement. Communicate results to management.</p>
      <br/>
      <p><em>Ensure all workpapers are properly documented and retained according to department policy.</em></p>
    `,
    categoryId: "cat1",
    categoryName: "Audit Methodologies",
    lastUpdated: "2025-06-15T10:00:00Z",
    isFeatured: true,
    author: "Jane Smith",
    authorAvatar: "/placeholder.svg?width=32&height=32&text=JS",
    tags: ["controls", "assessment", "methodology"],
  },
  {
    id: "art2",
    slug: "policy-on-evidence-retention",
    title: "Policy on Evidence Retention",
    excerpt: "Official department policy regarding the retention period and storage of audit evidence.",
    content: `
      <h2>1. Purpose</h2>
      <p>This policy outlines the requirements for retaining audit evidence to ensure compliance, support findings, and facilitate quality reviews.</p>
      <h2>2. Scope</h2>
      <p>This policy applies to all audit engagements conducted by the Internal Audit department.</p>
      <h2>3. Retention Period</h2>
      <p>All audit evidence, including workpapers, supporting documentation, and correspondence, must be retained for a minimum of <strong>seven (7) years</strong> from the date of the final audit report issuance.</p>
      <h2>4. Storage</h2>
      <p>Electronic evidence must be stored securely in the designated platform repository. Physical evidence, if any, must be scanned and uploaded, or stored in a secure, access-controlled physical location approved by the Head of Audit.</p>
      <h2>5. Disposal</h2>
      <p>After the retention period expires, evidence must be disposed of in a secure manner that ensures confidentiality.</p>
      <br/>
      <p><em>Non-compliance with this policy may result in disciplinary action.</em></p>
    `,
    categoryId: "cat4",
    categoryName: "Department Policies",
    lastUpdated: "2025-06-10T14:30:00Z",
    isFeatured: true,
    author: "Audit Committee",
    tags: ["policy", "evidence", "retention", "compliance"],
  },
  {
    id: "art3",
    slug: "how-to-build-custom-report",
    title: "How to Build a Custom Report in the Platform",
    excerpt: "Learn how to use the custom report builder to generate tailored reports for specific needs.",
    content: `
      <h2>Overview</h2>
      <p>The platform's custom report builder allows you to create reports beyond the standard templates. This guide will walk you through the process.</p>
      <h3>Accessing the Report Builder</h3>
      <p>Navigate to 'Reports' > 'Custom Reports' > 'Create New Custom Report'.</p>
      <h3>Selecting Data Sources</h3>
      <p>Choose the data modules you want to include in your report (e.g., Findings, Risks, Controls).</p>
      <h3>Choosing Fields</h3>
      <p>Select the specific fields from each data source to display as columns in your report.</p>
      <h3>Applying Filters</h3>
      <p>Add filters to narrow down the data (e.g., findings with 'High' risk, controls related to 'Finance').</p>
      <h3>Grouping and Sorting</h3>
      <p>Organize your report by grouping data (e.g., group findings by auditable entity) and sorting columns.</p>
      <h3>Saving and Exporting</h3>
      <p>Save your custom report template for future use. You can export the generated report in various formats (PDF, Excel, CSV).</p>
      <br/>
      <p><em>Tip: Start with a clear objective for your report to make the building process smoother.</em></p>
    `,
    categoryId: "cat3",
    categoryName: "Platform How-To Guides",
    lastUpdated: "2025-06-18T09:00:00Z",
    isFeatured: true,
    author: "Platform Support",
    tags: ["reports", "customization", "platform guide"],
  },
  {
    id: "art4",
    slug: "risk-assessment-scoring-matrix",
    title: "Understanding the Risk Assessment Scoring Matrix",
    excerpt: "A detailed explanation of how risks are scored using the likelihood and impact matrix.",
    content: `
      <h2>Introduction to Risk Scoring</h2>
      <p>Our risk assessment framework uses a scoring matrix based on likelihood and impact to quantify and prioritize risks.</p>
      <h3>Likelihood Scale</h3>
      <p>Likelihood is assessed on a 1-5 scale:</p>
      <ul>
        <li>1 - Rare</li>
        <li>2 - Unlikely</li>
        <li>3 - Possible</li>
        <li>4 - Likely</li>
        <li>5 - Almost Certain</li>
      </ul>
      <h3>Impact Scale</h3>
      <p>Impact is also assessed on a 1-5 scale across various categories (Financial, Reputational, Operational, Compliance):</p>
      <ul>
        <li>1 - Insignificant</li>
        <li>2 - Minor</li>
        <li>3 - Moderate</li>
        <li>4 - Major</li>
        <li>5 - Catastrophic</li>
      </ul>
      <h3>Risk Score Calculation</h3>
      <p>The overall risk score is typically calculated as: <strong>Risk Score = Likelihood x Impact</strong>.</p>
      <h3>Risk Matrix</h3>
      <p>The resulting score is then mapped to a risk level (e.g., Low, Medium, High, Critical) using a predefined matrix.</p>
      <img src="/placeholder.svg?width=600&height=400" alt="Risk Matrix Chart" style="width:100%; max-width: 500px; margin-top: 10px; border: 1px solid #ccc;"/>
      <br/>
      <p><em>Refer to the full Risk Management Policy for detailed definitions of each scale level.</em></p>
    `,
    categoryId: "cat2",
    categoryName: "Risk Assessment",
    lastUpdated: "2025-05-20T11:00:00Z",
    isFeatured: false,
    author: "Risk Management Team",
    tags: ["risk", "scoring", "matrix", "framework"],
  },
  {
    id: "art5",
    slug: "annual-audit-planning-process",
    title: "Annual Audit Planning Process Overview",
    excerpt: "An overview of the steps involved in the annual audit planning cycle.",
    content: `
      <h2>Purpose of Annual Audit Planning</h2>
      <p>The annual audit plan outlines the audit activities to be undertaken by the Internal Audit department over the course of the fiscal year. It aligns audit efforts with the organization's strategic objectives and key risks.</p>
      <h3>Key Steps:</h3>
      <ol>
        <li><strong>Understanding the Organization's Strategy and Risk Profile:</strong> Review strategic plans, enterprise risk assessments, and consult with senior management and the Audit Committee.</li>
        <li><strong>Identifying the Audit Universe:</strong> Document all potential auditable entities, processes, and systems.</li>
        <li><strong>Risk Assessing the Audit Universe:</strong> Apply a consistent methodology to assess the risk associated with each component of the audit universe.</li>
        <li><strong>Prioritizing Audits:</strong> Based on risk assessment results, resource availability, and management input, select audits for inclusion in the plan.</li>
        <li><strong>Resource Allocation:</strong> Estimate the resources (time, skills) required for each planned audit and allocate departmental resources accordingly.</li>
        <li><strong>Drafting the Audit Plan:</strong> Prepare a formal document outlining the planned audits, their objectives, scope, timing, and resource requirements.</li>
        <li><strong>Approval:</strong> Present the draft audit plan to senior management and the Audit Committee for review, feedback, and approval.</li>
        <li><strong>Communication:</strong> Communicate the approved audit plan to relevant stakeholders.</li>
        <li><strong>Monitoring and Adjustment:</strong> Regularly monitor progress against the plan and make adjustments as necessary to respond to changes in the organization's risk environment or strategic priorities.</li>
      </ol>
      <br/>
      <p><em>The annual audit plan is a dynamic document and should be revisited periodically throughout the year.</em></p>
    `,
    categoryId: "cat1",
    categoryName: "Audit Methodologies",
    lastUpdated: "2025-04-28T16:15:00Z",
    isFeatured: false,
    author: "Head of Audit",
    tags: ["audit plan", "annual planning", "methodology", "risk-based"],
  },
]
