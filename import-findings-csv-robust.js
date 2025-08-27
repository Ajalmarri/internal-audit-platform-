const mysql = require('mysql2/promise');
const fs = require('fs');

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

// Function to clean HTML content and extract plain text
function cleanHtmlContent(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return '';
  
  // Remove HTML tags but preserve line breaks and basic formatting
  let cleaned = htmlString
    .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
    .replace(/<div[^>]*>/gi, '\n') // Convert <div> to newlines
    .replace(/<\/div>/gi, '') // Remove closing div tags
    .replace(/<p[^>]*>/gi, '\n') // Convert <p> to newlines
    .replace(/<\/p>/gi, '') // Remove closing p tags
    .replace(/<span[^>]*>/gi, '') // Remove span tags
    .replace(/<\/span>/gi, '') // Remove closing span tags
    .replace(/<font[^>]*>/gi, '') // Remove font tags
    .replace(/<\/font>/gi, '') // Remove closing font tags
    .replace(/<b>/gi, '**') // Convert bold to markdown
    .replace(/<\/b>/gi, '**')
    .replace(/<u>/gi, '__') // Convert underline to markdown
    .replace(/<\/u>/gi, '__')
    .replace(/<table[^>]*>/gi, '\n[Table]\n') // Replace tables with placeholder
    .replace(/<\/table>/gi, '')
    .replace(/<tr[^>]*>/gi, '') // Remove table row tags
    .replace(/<\/tr>/gi, '\n')
    .replace(/<td[^>]*>/gi, ' | ') // Convert table cells to markdown
    .replace(/<\/td>/gi, '')
    .replace(/<th[^>]*>/gi, ' | ') // Convert table headers to markdown
    .replace(/<\/th>/gi, '')
    .replace(/<tbody[^>]*>/gi, '') // Remove tbody tags
    .replace(/<\/tbody>/gi, '')
    .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
    .replace(/&quot;/g, '"') // Convert HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#58;/g, ':') // Convert HTML encoded colons
    .replace(/&#160;/g, ' ') // Convert non-breaking spaces
    .replace(/\n\s*\n/g, '\n') // Remove multiple consecutive newlines
    .trim();
  
  return cleaned;
}

// Function to parse CSV line with complex content
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

// Function to drop and recreate the table
async function recreateTable(connection) {
  try {
    // Drop existing table
    await connection.execute('DROP TABLE IF EXISTS findings_csv_import');
    
    // Create new table with proper schema
    const createTableSQL = `
      CREATE TABLE findings_csv_import (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sequence VARCHAR(100),
        year VARCHAR(10),
        audit_plan_name TEXT,
        assignment_name_id VARCHAR(100),
        assignment_name TEXT,
        assignment_cycle TEXT,
        finding_title TEXT,
        finding_detail LONGTEXT,
        management_response LONGTEXT,
        acceptance TEXT,
        finding_rating VARCHAR(50),
        control_rating VARCHAR(100),
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
        related_functions TEXT,
        related_functions_division TEXT,
        rating_calculation VARCHAR(50),
        weightage_core VARCHAR(50),
        weightage_related VARCHAR(50),
        created_by TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await connection.execute(createTableSQL);
    console.log('Table recreated successfully');
  } catch (error) {
    console.error('Error recreating table:', error);
    throw error;
  }
}

async function importCSV() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');
    
    // Recreate the table
    await recreateTable(connection);
    
    // Read the CSV file
    const csvContent = fs.readFileSync('Findings (1).csv', 'utf8');
    const lines = csvContent.split('\n');
    
    // Skip header line
    const dataLines = lines.slice(1);
    console.log(`Found ${dataLines.length} data lines`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;
      
      try {
        const fields = parseCSVLine(line);
        
        if (fields.length < 28) {
          console.log(`Line ${i + 1}: Insufficient fields (${fields.length}/28), skipping`);
          continue;
        }
        
        // Clean HTML content from relevant fields
        const findingDetail = cleanHtmlContent(fields[6]); // Finding Detail
        const managementResponse = cleanHtmlContent(fields[8]); // Management Response
        const recommendations = cleanHtmlContent(fields[12]); // Recommendations
        const coreRisks = cleanHtmlContent(fields[13]); // Core Risks
        const relatedRisks = cleanHtmlContent(fields[18]); // Related Risks
        const relatedRisksTitle = cleanHtmlContent(fields[19]); // Related Risks Title
        
        // Insert the record
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
          fields[0] || null,  // sequence
          fields[1] || null,  // year
          fields[2] || null,  // audit_plan_name
          fields[3] || null,  // assignment_name_id
          fields[4] || null,  // assignment_name
          fields[5] || null,  // assignment_cycle
          fields[6] || null,  // finding_title
          findingDetail,      // finding_detail (cleaned)
          managementResponse,  // management_response (cleaned)
          fields[9] || null,  // acceptance
          fields[10] || null, // finding_rating
          fields[11] || null, // control_rating
          recommendations,     // recommendations (cleaned)
          coreRisks,          // core_risks (cleaned)
          fields[14] || null, // core_risks_id
          fields[15] || null, // cycle_linked
          fields[16] || null, // inh_risk_rating
          relatedRisks,       // related_risks (cleaned)
          relatedRisksTitle,  // related_risks_title (cleaned)
          fields[20] || null, // related_risks_inh_rating
          fields[21] || null, // core_function
          fields[22] || null, // core_function_division
          fields[23] || null, // related_functions
          fields[24] || null, // related_functions_division
          fields[25] || null, // rating_calculation
          fields[26] || null, // weightage_core
          fields[27] || null, // weightage_related
          fields[28] || null  // created_by
        ];
        
        await connection.execute(insertSQL, values);
        successCount++;
        
        if (successCount % 50 === 0) {
          console.log(`Processed ${successCount} records...`);
        }
        
      } catch (error) {
        console.error(`Error processing line ${i + 1}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nImport completed!`);
    console.log(`Successfully imported: ${successCount} records`);
    console.log(`Errors: ${errorCount} records`);
    
    // Verify the import
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM findings_csv_import');
    console.log(`Total records in database: ${countResult[0].total}`);
    
    // Show sample of imported data
    const [sampleData] = await connection.execute('SELECT id, sequence, year, audit_plan_name, finding_title FROM findings_csv_import LIMIT 5');
    console.log('\nSample imported data:');
    console.log(JSON.stringify(sampleData, null, 2));
    
    connection.end();
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

importCSV();





