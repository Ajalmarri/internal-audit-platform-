export interface DataSource {
  id: string
  name: string
  logoUrl: string
  description: string
}

export interface ColumnConfig {
  accessorKey: string
  header: string
  // Add other TanStack Table column options if needed
}

export interface DataSet {
  id: string
  name: string
  description: string
  columns: ColumnConfig[]
  sampleData: Record<string, any>[] // Array of data rows
}

export const mockDataSources: DataSource[] = [
  {
    id: "dynamics365",
    name: "Microsoft Dynamics 365",
    logoUrl: "/placeholder.svg?width=100&height=40",
    description: "Connect to your Dynamics 365 Finance and Operations data.",
  },
  // Add other data sources here
]

export const mockDataSetsForDynamics: DataSet[] = [
  {
    id: "generalLedger",
    name: "General Ledger Entries",
    description: "Detailed journal entries and financial transactions.",
    columns: [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "account", header: "Account" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "debit", header: "Debit" },
      { accessorKey: "credit", header: "Credit" },
      { accessorKey: "journalId", header: "Journal ID" },
    ],
    sampleData: [
      {
        date: "2025-01-15",
        account: "10100 Cash",
        description: "Initial cash deposit",
        debit: 50000,
        credit: 0,
        journalId: "JV001",
      },
      {
        date: "2025-01-16",
        account: "60500 Rent Expense",
        description: "Office rent for Jan",
        debit: 2500,
        credit: 0,
        journalId: "JV002",
      },
      {
        date: "2025-01-16",
        account: "10100 Cash",
        description: "Payment for office rent",
        debit: 0,
        credit: 2500,
        journalId: "JV002",
      },
      {
        date: "2025-01-20",
        account: "40100 Sales Revenue",
        description: "Sales to Client X",
        debit: 0,
        credit: 15000,
        journalId: "INV001",
      },
      {
        date: "2025-01-20",
        account: "11200 Accounts Receivable",
        description: "Invoice INV001",
        debit: 15000,
        credit: 0,
        journalId: "INV001",
      },
    ],
  },
  {
    id: "vendorInvoices",
    name: "Vendor Invoices",
    description: "Invoices received from suppliers and their payment status.",
    columns: [
      { accessorKey: "invoiceId", header: "Invoice ID" },
      { accessorKey: "vendorName", header: "Vendor" },
      { accessorKey: "invoiceDate", header: "Invoice Date" },
      { accessorKey: "dueDate", header: "Due Date" },
      { accessorKey: "amount", header: "Amount" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "purchaseOrder", header: "PO Number" },
    ],
    sampleData: [
      {
        invoiceId: "INV-A001",
        vendorName: "Supplier Alpha",
        invoiceDate: "2025-01-10",
        dueDate: "2025-02-09",
        amount: 5750.0,
        status: "Paid",
        purchaseOrder: "PO-1001",
      },
      {
        invoiceId: "INV-B002",
        vendorName: "Supplier Beta",
        invoiceDate: "2025-01-12",
        dueDate: "2025-02-11",
        amount: 12300.5,
        status: "Awaiting Payment",
        purchaseOrder: "PO-1002",
      },
      {
        invoiceId: "INV-C003",
        vendorName: "Supplier Charlie",
        invoiceDate: "2025-01-18",
        dueDate: "2025-02-17",
        amount: 850.0,
        status: "Awaiting Payment",
        purchaseOrder: "",
      },
      {
        invoiceId: "INV-D004",
        vendorName: "Supplier Delta",
        invoiceDate: "2025-01-22",
        dueDate: "2025-02-21",
        amount: 15200.0,
        status: "Awaiting Payment",
        purchaseOrder: "PO-1004",
      },
      {
        invoiceId: "INV-E005",
        vendorName: "Supplier Epsilon",
        invoiceDate: "2025-01-25",
        dueDate: "2025-02-24",
        amount: 3400.75,
        status: "Paid",
        purchaseOrder: "PO-1005",
      },
    ],
  },
  {
    id: "employeeExpenses",
    name: "Employee Expenses",
    description: "Expense reports submitted by employees.",
    columns: [
      { accessorKey: "reportId", header: "Report ID" },
      { accessorKey: "employeeName", header: "Employee" },
      { accessorKey: "submissionDate", header: "Submission Date" },
      { accessorKey: "totalAmount", header: "Total Amount" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "department", header: "Department" },
    ],
    sampleData: [
      {
        reportId: "EXP001",
        employeeName: "Alice Wonderland",
        submissionDate: "2025-01-20",
        totalAmount: 350.75,
        status: "Approved",
        department: "Sales",
      },
      {
        reportId: "EXP002",
        employeeName: "Bob The Builder",
        submissionDate: "2025-01-22",
        totalAmount: 120.0,
        status: "Submitted",
        department: "IT",
      },
      {
        reportId: "EXP003",
        employeeName: "Carol Danvers",
        submissionDate: "2025-01-25",
        totalAmount: 875.5,
        status: "Approved",
        department: "Marketing",
      },
    ],
  },
]
