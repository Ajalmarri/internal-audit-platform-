const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Ahmed@123',
  database: 'audit_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Function to clean HTML content
function cleanHtmlContent(htmlContent) {
  if (!htmlContent) return '';
  // Remove HTML tags and decode HTML entities
  return htmlContent
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&quot;/g, '"') // Replace &quot; with quote
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&#58;/g, ':') // Replace &#58; with :
    .replace(/&#160;/g, ' ') // Replace &#160; with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

// Function to parse CSV using a state machine approach
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  return result;
}

// Function to map CSV data to database fields
function mapCSVToFinding(csvRow) {
  // Ensure we have enough columns
  if (csvRow.length < 28) {
    console.warn(`Row has only ${csvRow.length} columns, expected 28`);
    // Pad with empty strings
    while (csvRow.length < 28) {
      csvRow.push('');
    }
  }
  
  return {
    sequence: csvRow[0] || '',
    year: csvRow[1] || '',
    audit_plan_name: csvRow[2] || '',
    assignment_name_id: csvRow[3] || '',
    assignment_name: csvRow[4] || '',
    assignment_cycle: csvRow[5] || '',
    finding_title: csvRow[6] || '',
    finding_detail: cleanHtmlContent(csvRow[7] || ''),
    management_response: cleanHtmlContent(csvRow[8] || ''),
    acceptance: csvRow[9] || '',
    finding_rating: csvRow[10] || '',
    control_rating: csvRow[11] || '',
    recommendations: cleanHtmlContent(csvRow[12] || ''),
    core_risks: cleanHtmlContent(csvRow[13] || ''),
    core_risks_id: csvRow[14] || '',
    cycle_linked: csvRow[15] || '',
    inh_risk_rating: csvRow[16] || '',
    related_risks: cleanHtmlContent(csvRow[17] || ''),
    related_risks_title: cleanHtmlContent(csvRow[18] || ''),
    related_risks_inh_rating: csvRow[19] || '',
    core_function: csvRow[20] || '',
    core_function_division: csvRow[21] || '',
    related_functions: cleanHtmlContent(csvRow[22] || ''),
    related_functions_division: cleanHtmlContent(csvRow[23] || ''),
    rating_calculation: csvRow[24] || '',
    weightage_core: csvRow[25] || '',
    weightage_related: csvRow[26] || '',
    created_by: csvRow[27] || ''
  };
}

// Function to clean and validate data before insertion
function cleanAndValidateData(finding) {
  // Clean HTML content more thoroughly
  const cleanHtml = (content) => {
    if (!content) return '';
    return content
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&quot;/g, '"') // Replace &quot; with quote
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&#58;/g, ':') // Replace &#58; with :
      .replace(/&#160;/g, ' ') // Replace &#160; with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  // Truncate fields that might be too long for database
  const truncate = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  };

  return {
    sequence: truncate(finding.sequence, 1000),
    year: truncate(finding.year, 50),
    audit_plan_name: truncate(finding.audit_plan_name, 2000),
    assignment_name_id: truncate(finding.assignment_name_id, 1000),
    assignment_name: truncate(finding.assignment_name, 2000),
    assignment_cycle: truncate(finding.assignment_cycle, 1000),
    finding_title: cleanHtml(finding.finding_title),
    finding_detail: cleanHtml(finding.finding_detail),
    management_response: cleanHtml(finding.management_response),
    acceptance: truncate(finding.acceptance, 1000),
    finding_rating: truncate(finding.finding_rating, 500),
    control_rating: truncate(finding.control_rating, 500),
    recommendations: cleanHtml(finding.recommendations),
    core_risks: cleanHtml(finding.core_risks),
    core_risks_id: truncate(finding.core_risks_id, 1000),
    cycle_linked: truncate(finding.cycle_linked, 1000),
    inh_risk_rating: truncate(finding.inh_risk_rating, 1000),
    related_risks: cleanHtml(finding.related_risks),
    related_risks_title: cleanHtml(finding.related_risks_title),
    related_risks_inh_rating: truncate(finding.related_risks_inh_rating, 1000),
    core_function: truncate(finding.core_function, 1000),
    core_function_division: truncate(finding.core_function_division, 1000),
    related_functions: cleanHtml(finding.related_functions),
    related_functions_division: cleanHtml(finding.related_functions_division),
    rating_calculation: truncate(finding.rating_calculation, 1000),
    weightage_core: truncate(finding.weightage_core, 100),
    weightage_related: truncate(finding.weightage_related, 100),
    created_by: truncate(finding.created_by, 1000)
  };
}

// Function to drop existing table if it exists
async function dropExistingTable(connection) {
  try {
    await connection.execute('DROP TABLE IF EXISTS findings_csv_import');
    console.log('✅ Dropped existing table');
  } catch (error) {
    console.error('❌ Error dropping table:', error);
    throw error;
  }
}

// Function to create findings table if it doesn't exist
async function createFindingsTable(connection) {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS findings_csv_import (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sequence TEXT,
      year VARCHAR(50),
      audit_plan_name TEXT,
      assignment_name_id TEXT,
      assignment_name TEXT,
      assignment_cycle TEXT,
      finding_title LONGTEXT,
      finding_detail LONGTEXT,
      management_response LONGTEXT,
      acceptance TEXT,
      finding_rating TEXT,
      control_rating TEXT,
      recommendations LONGTEXT,
      core_risks LONGTEXT,
      core_risks_id TEXT,
      cycle_linked TEXT,
      inh_risk_rating TEXT,
      related_risks LONGTEXT,
      related_risks_title LONGTEXT,
      related_risks_inh_rating TEXT,
      core_function TEXT,
      core_function_division TEXT,
      related_functions LONGTEXT,
      related_functions_division LONGTEXT,
      rating_calculation TEXT,
      weightage_core VARCHAR(100),
      weightage_related VARCHAR(100),
      created_by TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  
  try {
    await connection.execute(createTableSQL);
    console.log('✅ Findings table created successfully');
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
}

// Function to insert finding into database
async function insertFinding(connection, finding) {
  const insertSQL = `
    INSERT INTO findings_csv_import (
      sequence, year, audit_plan_name, assignment_name_id, assignment_name, 
      assignment_cycle, finding_title, finding_detail, management_response, 
      acceptance, finding_rating, control_rating, recommendations, core_risks, 
      core_risks_id, cycle_linked, inh_risk_rating, related_risks, 
      related_risks_title, related_risks_inh_rating, core_function, 
      core_function_division, related_functions, related_functions_division, 
      rating_calculation, weightage_core, weightage_related, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    finding.sequence, finding.year, finding.audit_plan_name, finding.assignment_name_id,
    finding.assignment_name, finding.assignment_cycle, finding.finding_title, finding.finding_detail,
    finding.management_response, finding.acceptance, finding.finding_rating, finding.control_rating,
    finding.recommendations, finding.core_risks, finding.core_risks_id, finding.cycle_linked,
    finding.inh_risk_rating, finding.related_risks, finding.related_risks_title,
    finding.related_risks_inh_rating, finding.core_function, finding.core_function_division,
    finding.related_functions, finding.related_functions_division, finding.rating_calculation,
    finding.weightage_core, finding.weightage_related, finding.created_by
  ];
  
  try {
    const [result] = await connection.execute(insertSQL, values);
    return result.insertId;
  } catch (error) {
    console.error('❌ Error inserting finding:', error);
    throw error;
  }
}

// Main import function
async function importFindingsCSV() {
  let connection;
  
  try {
    console.log('🚀 Starting CSV import process...');
    
    // Create database connection
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection established');
    
    // Drop existing table if it exists
    await dropExistingTable(connection);

    // Create table if it doesn't exist
    await createFindingsTable(connection);
    
    // Read CSV file
    const csvPath = path.join(__dirname, 'Findings (1).csv');
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    console.log(`📊 Found ${lines.length} lines in CSV file`);
    
    // Skip header row
    const dataLines = lines.slice(1);
    console.log(`📈 Processing ${dataLines.length} data rows...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each line
    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i];
        if (!line.trim()) continue;
        
        // Parse CSV line
        const csvRow = parseCSVLine(line);
        
        // Map to finding object
        const finding = mapCSVToFinding(csvRow);
        
        // Clean and validate data
        const cleanedFinding = cleanAndValidateData(finding);
        
        // Insert into database
        const insertId = await insertFinding(connection, cleanedFinding);
        
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`✅ Processed ${successCount} findings...`);
        }
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing line ${i + 2}:`, error.message);
      }
    }
    
    console.log('\n🎉 Import completed!');
    console.log(`✅ Successfully imported: ${successCount} findings`);
    console.log(`❌ Errors: ${errorCount} findings`);
    
    // Show sample data
    const [sampleRows] = await connection.execute('SELECT * FROM findings_csv_import LIMIT 3');
    console.log('\n📋 Sample imported data:');
    console.log(JSON.stringify(sampleRows, null, 2));
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the import
if (require.main === module) {
  importFindingsCSV().catch(console.error);
}

module.exports = { importFindingsCSV };





