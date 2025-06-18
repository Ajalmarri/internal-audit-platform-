# Product Requirements Document: Internal Audit Platform

**Version:** 1.0
**Date:** June 16, 2025
**Author:** System Architect (v0)
**Status:** In Development

## 1. Introduction

### 1.1 Purpose
This document outlines the product requirements for the Internal Audit Platform. It details the platform's vision, features, functional and non-functional requirements, and technical architecture to guide the development team and stakeholders.

### 1.2 Product Vision
To be a comprehensive, intuitive, and efficient platform that empowers internal audit teams to manage the entire audit lifecycle, from planning and risk assessment to execution, reporting, and follow-up, thereby enhancing governance, risk management, and control processes within the organization.

### 1.3 Target Audience
The platform is designed for various roles within an organization's audit and GRC (Governance, Risk, and Compliance) ecosystem:
*   **Audit Managers:** Oversee audit plans, assign resources, review findings, and track overall progress.
*   **Auditors (Lead, Senior, Junior):** Execute audit assignments, document findings, manage tasks, and collaborate with team members.
*   **Business Owners/Stakeholders:** Receive audit findings, submit action plans, and track remediation progress.
*   **System Administrators:** Manage platform-wide configurations, user access, and templates.

## 2. Goals and Objectives

*   **Streamline Audit Processes:** Automate and simplify manual audit tasks, reducing administrative overhead.
*   **Enhance Visibility & Control:** Provide real-time insights into audit progress, risks, findings, and resource allocation.
*   **Improve Collaboration:** Facilitate seamless communication and information sharing among audit teams and stakeholders.
*   **Strengthen Risk Management:** Enable proactive identification, assessment, and mitigation of risks.
*   **Ensure Compliance:** Support adherence to internal policies and external regulations.
*   **Data-Driven Decision Making:** Provide actionable data and analytics for informed decision-making.

## 3. Target Users & Personas

*   **Muhammad (Audit Manager):** Needs a high-level overview of all audits, team availability, key risks, and the ability to manage system settings. Uses the Dashboard, Audit Plans, Resource Workload, Reports, and Settings (System tab).
*   **Khaled M. (Lead Auditor):** Focuses on specific assignments, managing tasks, documenting findings, and collaborating with his team. Uses Assignments, Findings, Action Plans, and the Calendar.
*   **Yema al Olman (Business Owner):** Primarily interacts with the system to review findings related to her department and submit/track action plans. Uses Action Plans (submit/view) and potentially Findings (view).
*   **System Administrator (can be an Audit Manager):** Configures risk levels, audit templates, and manages user roles and permissions. Uses the System Settings tab.

## 4. Key Features & Functionality

### 4.1 Core Navigation & Layout
*   **Persistent Sidebar (`AppSidebar`):**
    *   Collapsible (icon/expanded view).
    *   Navigation links: Dashboard, Audit Plans, Risks, Controls, Assignments, Findings, Action Plans, Reports, Stakeholders, Engagements, Settings.
    *   Active link highlighting.
    *   User profile display (Avatar, Name, Role).
    *   Theme Toggle (Light/Dark).
    *   Language Switcher.
    *   Application version display.
*   **Header (`Header`):**
    *   Sidebar toggle button.
    *   User menu (dropdown).
    *   Notifications icon (future functionality).
    *   Global search (future functionality).
*   **Main Content Area:** Dynamically renders page content with appropriate padding and background.
*   **ThemeProvider:** Manages light/dark mode across the application.
*   **Toaster:** Displays system notifications (e.g., success/error messages).

### 4.2 Dashboard (`app/(main)/dashboard/page.tsx`)
*   **Personalized Greeting:** Welcomes the logged-in user.
*   **Assignments Card (`AssignmentsCard`):**
    *   Summary: Total assignments, Due soon assignments.
    *   Link to full "Assignments" page.
    *   List of recent assignments with title, due date, status, and link to assignment details.
*   **Insight Hub Card (`InsightHubCard`):**
    *   **Stat Cards:** Clickable cards for "Overdue Action Plans," "Open High-Risk Findings," "Reports Pending Approval," linking to relevant filtered pages.
    *   **Charts (Recharts & shadcn/ui Chart components):**
        *   Task Completion Rate (Bar Chart).
        *   Resource Risk Trend (Line Chart).
        *   Findings by Status (Pie Chart - clickable segments navigate to filtered Findings page).
        *   Action Plan Status (Vertical Bar Chart - clickable bars navigate to filtered Action Plans page).
*   **Calendar Card (`CalendarCard`):**
    *   Displays a monthly calendar (`shadcn/ui Calendar`).
    *   Highlights the current date.
    *   (Future: Integrate with audit deadlines and events).
*   **Team Availability Card (`TeamAvailabilityCard`):**
    *   Lists team members with avatar, name, role.
    *   Visual status indicator (e.g., Available, Busy, On Leave) and status badge.

### 4.3 Audit Plans (`app/(main)/audit-plans/page.tsx`)
*   **Tabbed Interface:**
    *   **"List & Timeline" Tab:**
        *   **View Switcher:** Toggles between "List" and "Timeline" (Gantt) views.
        *   **"Add New Audit Plan" Button:** Opens a dialog for creating/editing plans.
        *   **List View (Table):**
            *   Columns: Plan Title (with objectives tooltip), Status (icon & badge), Dates (Start/End), Personnel (avatar stack with tooltip), Progress (bar & percentage), Actions (dropdown: View Details, Edit, Delete).
            *   Search/Filter bar.
            *   Scrollable table.
        *   **Timeline View (`AuditPlansTimelineView`):**
            *   Gantt-style chart displaying audit plans and their associated assignments over a configurable time range.
            *   Visual representation of plan/task duration, status, dependencies.
            *   Zoom/pan controls.
            *   (Details of implementation in `_components/audit-plans-timeline-view.tsx`).
        *   **Creation/Editing Dialog:**
            *   Fields: Title, Objectives, Scope, Status, Start Date, End Date, Personnel (comma-separated).
            *   Validation (implied by `required` attributes).
    *   **"Resource Workload" Tab:** (Placeholder for future integration of the Resource Workload view).

### 4.4 Resource Workload (`app/(main)/resource-workload/page.tsx`)
*   **Page Title:** "Resource Workload & Availability".
*   **Filters:**
    *   Date Range (From/To) using `DatePicker`.
    *   Team/Department `Select` dropdown.
*   **Summary Cards:**
    *   Total Team Capacity (hours).
    *   Total Allocated Hours (with utilization percentage).
    *   Number of Over-utilized Staff.
*   **Workload Matrix (Table):**
    *   Rows: Auditors (Avatar, Name, Department - sticky first column).
    *   Columns: Weeks within the selected date range (Week Number, Start Date).
    *   Cells:
        *   Display: Allocated Hours / Capacity Hours (e.g., "30h / 40h").
        *   Visual Indicator: Heatmap color based on utilization (Green: Under, Yellow: Optimal, Red: Over).
        *   Tooltip: Detailed breakdown (Auditor, Week, Allocated, Capacity, Utilization %, List of tasks for that week).
    *   Horizontal scrolling for the matrix.

### 4.5 Risks (`app/(main)/risks/page.tsx`, `[riskId]/page.tsx`)
*   **List View:** (Assumed: Table displaying risks - ID, Title, Category, Level, Status, Actions).
*   **Detail View:** (Assumed: Comprehensive information about a specific risk).
*   **Creation/Editing:** (Assumed: Forms for adding/modifying risks).
*   Loading states provided.

### 4.6 Controls (`app/(main)/controls/page.tsx`, `new/page.tsx`)
*   **List View:** (Assumed: Table displaying controls - ID, Title, Category, Effectiveness, Last Tested, Actions).
*   **Creation/Editing:** (Assumed: Forms for adding/modifying controls).
*   Loading states provided.

### 4.7 Assignments
*   **List View (`app/(main)/assignments/page.tsx`):** (Assumed: Table of assignments with key details and actions).
*   **Creation View (`app/(main)/assignments/new/page.tsx`):** (Assumed: Form to create new assignments).
*   **Detail View (`app/(main)/assignments/[assignmentId]/page.tsx`):**
    *   **Assignment Header (`_components/assignment-header.tsx`):** Title, Status, Key Dates, Lead Auditor.
    *   **Process Tracker (`_components/process-tracker.tsx`):** Visual stepper for assignment stages.
    *   **Requirement Details Card (`_components/requirement-details-card.tsx`):** Detailed requirements.
    *   **Fulfilment Tasks Card (`_components/fulfilment-tasks-card.tsx`):** List of tasks to fulfill requirements.
    *   **Related Risks Card (`_components/related-risks-card.tsx`):** Associated risks.
    *   **Comments Section (`_components/comments-section.tsx`):** Threaded comments for collaboration.
    *   **Assigned Team Card (`_components/assigned-team-card.tsx`):** List of team members.
    *   **Document Management Card (`_components/document-management-card.tsx`):** File uploads and listing (integrates with `FileUpload` component and Vercel Blob via API routes).
    *   **Data Analysis Card (`_components/data-analysis-card.tsx`):** (Placeholder/future feature for data analysis related to the assignment).
*   Loading states provided for list, new, and detail views.

### 4.8 Findings
*   **List View (`app/(main)/findings/page.tsx`):** (Assumed: Table of findings - ID, Title, Severity, Status, Assignee, Actions).
*   **Creation View (`app/(main)/findings/new/page.tsx`):** Form for creating new findings.
*   **Editing View (`app/(main)/findings/[findingId]/edit/page.tsx`):** Form for editing existing findings.
*   **Types:** `FindingStatus`, `FindingCreationTypes` defined.
*   Loading states provided.

### 4.9 Action Plans
*   **List View (`app/(main)/action-plans/page.tsx`):** (Assumed: Table of action plans - ID, Finding ID, Title, Owner, Due Date, Status, Actions).
*   **Dashboard View (`app/(main)/action-plans/dashboard/page.tsx`):** (Assumed: Overview/summary of action plans for Business Owners).
*   **Creation View (`app/(main)/action-plans/new/page.tsx`):** Form for Business Owners to submit new action plans.
*   **Editing View (`app/(main)/action-plans/[planId]/edit/page.tsx`):** Form for editing action plans.
*   Loading states provided.

### 4.10 Reports
*   **List View (`app/(main)/reports/page.tsx`):** (Assumed: Table of reports - ID, Title, Type, Date Generated, Status, Actions).
*   **Generation View (`app/(main)/reports/generate/page.tsx`):** Interface to configure and generate new reports.
*   **Detail/Preview View (`app/(main)/reports/[reportId]/page.tsx`):** Displays a generated report.
*   **API Routes:**
    *   `api/reports/generate/route.ts`: Handles report generation logic.
    *   `api/reports/[reportId]/route.ts`: Fetches specific report data.
    *   `api/reports/[reportId]/download/route.ts`: Handles report download functionality (e.g., PDF).
*   Loading states provided.

### 4.11 Stakeholders (`app/(main)/stakeholders/page.tsx`)
*   (Assumed: User management interface - List users, roles, permissions. May link to system settings for more advanced user management).
*   Loading state provided.

### 4.12 Engagements (`app/(main)/engagements/page.tsx`)
*   (Assumed: Module for managing broader audit engagements or projects, potentially grouping multiple audit plans).
*   Loading state provided.

### 4.13 Settings (`app/(main)/settings/page.tsx`)
*   **Tabbed Interface:** Profile, Notifications, System.
*   **Profile Settings (`_components/profile-settings.tsx`):**
    *   Avatar upload.
    *   Read-only fields: Full Name, Role, Email (from `useMockUser`).
    *   Editable: Language preference, Theme preference (Light/Dark RadioGroup, integrates with `useTheme`).
    *   Save Changes button.
*   **Notification Settings (`_components/notification-settings.tsx`):**
    *   Toggle switches for various notification types (New Assignment, Task Due Soon, Action Plan Submitted, Finding Approved/Rejected).
    *   Save Preferences button.
*   **System Settings (`_components/system-settings.tsx`):**
    *   Admin-only access (conditional rendering based on user role).
    *   Alert for administrator settings.
    *   Risk Configuration: Define labels and color codes for risk levels (Critical, High, Medium, Low).
    *   Audit Templates: Manage templates for Findings and Reports (Add/Edit buttons).
    *   User Management: Link to Stakeholder Management page.
    *   Save System Settings button.
*   Uses `useMockUser` hook for user data and role checks.

### 4.14 Common UI Components
*   **`components/ui/date-picker.tsx`:** Reusable date picker component.
*   **`components/ui/file-upload.tsx`:** Component for handling file uploads.
*   **`components/theme-toggle.tsx`:** Button to toggle light/dark theme.
*   **`components/language-switcher.tsx`:** Dropdown to switch application language.
*   Extensive use of **shadcn/ui components:** Button, Card, Input, Label, Select, Avatar, Badge, Progress, Table, DropdownMenu, Dialog, ScrollArea, Tooltip, Tabs, Switch, RadioGroup, Alert, Calendar, etc.
*   **Lucide React Icons:** Used throughout the application for iconography.

## 5. User Interface (UI) & User Experience (UX) Principles

*   **Consistency:** Adherence to a unified design language provided by shadcn/ui and custom Tailwind CSS configurations.
*   **Clarity & Intuitiveness:** Clean layouts, clear labeling, and predictable interactions.
*   **Responsiveness:** The application must adapt to various screen sizes (desktop, tablet, mobile).
*   **Accessibility:** Semantic HTML, ARIA attributes where appropriate (e.g., `aria-live`, `sr-only`), keyboard navigation for interactive elements.
*   **Feedback:** Visual feedback for user actions (e.g., loading states, toaster notifications, button states).
*   **Efficiency:** Minimize clicks and streamline common workflows.

## 6. Technical Considerations

### 6.1 Frontend Architecture
*   **Framework:** Next.js 14+ (App Router).
*   **Language:** TypeScript.
*   **Styling:** Tailwind CSS with shadcn/ui pre-built components. `globals.css` for base styles and Tailwind layers. `tailwind.config.ts` for theme extensions (colors, borderRadius, keyframes).
*   **Component Model:** Modular, reusable React components. Client Components (`'use client'`) and Server Components.
*   **State Management:**
    *   Local component state: `useState`, `useReducer`.
    *   Shared/derived state: `useMemo`, React Context API (e.g., `SidebarProvider`, `ThemeProvider`).
    *   Custom hooks (e.g., `useMockUser`, `useMobile` from shadcn/ui).
*   **Routing:** Next.js App Router file-system based routing.
*   **Charting:** Recharts library, integrated with shadcn/ui chart components.

### 6.2 Backend Interaction & Data
*   **API Layer:** Next.js API Routes (Route Handlers) for specific backend tasks (e.g., file uploads, report generation/download).
*   **Server Actions:** (Implied for form submissions and mutations directly from Server Components or invoked from Client Components).
*   **Data Fetching:** Primarily client-side fetching within components or server-side in Server Components/Route Handlers.
*   **Data Persistence (Current):** Mock data is heavily used (`initialMockAuditPlans`, `mockAuditors`, `mockTasks`, etc.).
*   **Data Persistence (Future):** Requires integration with a robust database system (e.g., Supabase, Neon, or other SQL/NoSQL solutions).
*   **File Storage:** Vercel Blob for document management, accessed via API routes (`api/files/upload`, `api/files/[fileId]`). `BLOB_READ_WRITE_TOKEN` environment variable used.

### 6.3 Authentication & Authorization
*   **Current:** `useMockUser` hook provides mock user data, including roles for conditional rendering (e.g., admin checks in Settings).
*   **Future:** Requires a proper authentication system (e.g., NextAuth.js, Supabase Auth, Clerk) and robust role-based access control (RBAC) enforced on the backend.

### 6.4 Modularity & Code Organization
*   Feature-based directory structure within `app/(main)/`.
*   Reusable components in `components/ui/` (shadcn) and `components/layout/`.
*   Page-specific sub-components in `_components/` directories.
*   Type definitions in `_types/` directories or co-located.

## 7. Data Model (High-Level - Inferred)

*   **User:** id, name, email, role, avatarUrl, preferences (theme, language).
*   **AuditPlan:** id, title, objectives, scope, status, startDate, endDate, personnel (User[]), progress, lastUpdated, (Assignments[]).
*   **Assignment (Task within Audit Plan):** id, name, auditPlanId, startDate, endDate, status, assignees (User[]), dependencies (Assignment[]), estimatedHours.
*   **Risk:** id, title, description, category, impact, likelihood, riskScore, status, owner, (Controls[]).
*   **Control:** id, title, description, type, frequency, owner, effectiveness, lastTestedDate.
*   **Finding:** id, title, description, assignmentId, riskId, severity, status, recommendation, owner, dueDate, (ActionPlans[]), (Evidences[]).
*   **ActionPlan:** id, findingId, title, description, owner, dueDate, status, (Evidences[]).
*   **Report:** id, title, type, generationDate, status, content (JSON/HTML), (AuditPlanId/FindingIds).
*   **Document/Evidence:** id, fileName, fileType, url (Vercel Blob), uploadedBy, uploadDate, relatedEntityId (Finding, ActionPlan, Assignment).
*   **Notification:** id, userId, type, message, readStatus, createdAt, link.
*   **Department/Team:** id, name, (Users[]).

## 8. Non-Functional Requirements (NFRs)

*   **Performance:**
    *   Fast initial page loads ( leveraging Next.js SSR/SSG capabilities).
    *   Responsive UI interactions (e.g., chart rendering, table sorting/filtering).
    *   Optimized data fetching to prevent bottlenecks.
*   **Scalability:**
    *   Architecture should support a growing number of users, audits, and data.
    *   Backend services (database, file storage) must be scalable.
*   **Security:**
    *   Secure authentication and authorization mechanisms.
    *   Protection against common web vulnerabilities (XSS, CSRF).
    *   Data encryption at rest and in transit for sensitive audit information.
    *   Role-based access control to ensure users only access authorized data and features.
*   **Maintainability:**
    *   Well-structured, documented, and modular code.
    *   Consistent coding standards.
    *   Ease of updates and bug fixes.
*   **Usability:**
    *   Intuitive and easy-to-learn interface for all target user personas.
    *   Minimal training required for common tasks.
*   **Reliability & Availability:**
    *   High uptime and availability of the platform.
    *   Robust error handling and logging.

## 9. Future Considerations / Roadmap Items (from active work items)

*   **Full User Authentication & Authorization:** Replace `useMockUser` with a production-ready solution.
*   **Database Integration:** Connect all modules to a persistent database.
*   **Real-time Collaboration:** Features like live comments, concurrent editing (potentially).
*   **Advanced Analytics & Reporting:** More sophisticated data visualization and customizable reports.
*   **Internationalization (i18n):** Full support for multiple languages beyond the current switcher.
*   **Smart Search:** Advanced global search functionality.
*   **Full Notification System:** Backend implementation, real-time updates, email notifications.
*   **Workflow Automation:** For processes like finding verification, report approval.
*   **Mobile Responsiveness Enhancements:** Ensure optimal experience on smaller devices.
*   **Integrations:** Potential integrations with other enterprise systems (e.g., ERP, GRC tools).
*   **Rich Text Editor:** For detailed descriptions in findings, action plans, etc.
*   **Granular Permissions:** More fine-grained access control.

## 10. Assumptions & Dependencies

### 10.1 Assumptions
*   Users will have modern web browsers.
*   The platform will be hosted on Vercel (implied by Next.js and Vercel Blob usage).
*   Initial data for configurations (like risk levels) will be seeded or manageable through the admin interface.

### 10.2 Dependencies
*   **External Libraries:** Next.js, React, Tailwind CSS, shadcn/ui, Lucide React, Recharts, date-fns.
*   **Services:** Vercel (hosting, Blob storage).
*   **Environment Variables:** `BLOB_READ_WRITE_TOKEN` for Vercel Blob. Future database and auth services will introduce more.

## 11. Success Metrics

*   **Audit Cycle Time:** Reduction in the average time taken to complete an audit.
*   **User Adoption Rate:** Percentage of target users actively using the platform.
*   **Task Completion Rate:** Percentage of audit tasks completed on time.
*   **Finding Remediation Rate:** Speed and completeness of action plan implementation.
*   **User Satisfaction:** Measured through surveys or feedback mechanisms (e.g., CSAT, NPS).
*   **Data Accuracy & Integrity:** Reduction in errors compared to manual processes.
*   **Number of Audits Managed:** Capacity of the platform to handle organizational workload.

---

This PRD provides a snapshot of the Internal Audit Platform based on its current state of development. It should be treated as a living document, subject to updates and revisions as the product evolves.
\`\`\`

The PRD is now structured to be saved as `docs/prd-internal-audit-platform.md` within your project.
