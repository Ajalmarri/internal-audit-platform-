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
  
  return htmlString
    .replace(/<[^>]*>/g, ' ') // Remove all HTML tags
    .replace(/&quot;/g, '"') // Convert HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#58;/g, ':')
    .replace(/&#160;/g, ' ')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

// Function to extract findings data by looking for specific patterns
function extractFindingsData(csvContent) {
  const findings = [];
  const lines = csvContent.split('\n');
  
  let currentFinding = null;
  let i = 1; // Skip header
  
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    
    // Look for the start of a new finding (sequence pattern)
    if (line.startsWith('"C&P-') || line.startsWith('"IT-') || line.startsWith('"HR-') || line.startsWith('"FA-')) {
      // Save previous finding if exists
      if (currentFinding) {
        findings.push(currentFinding);
      }
      
      // Start new finding
      currentFinding = {
        sequence: '',
        year: '',
        audit_plan_name: '',
        assignment_name: '',
        assignment_cycle: '',
        finding_title: '',
        finding_detail: '',
        management_response: '',
        acceptance: '',
        finding_rating: '',
        control_rating: '',
        recommendations: '',
        core_risks: '',
        core_function: '',
        created_by: ''
      };
      
      // Extract basic info from the first line
      const parts = line.split('","');
      if (parts.length >= 7) {
        currentFinding.sequence = parts[0].replace(/"/g, '');
        currentFinding.year = parts[1].replace(/"/g, '');
        currentFinding.audit_plan_name = parts[2].replace(/"/g, '');
        currentFinding.assignment_name = parts[4].replace(/"/g, '');
        currentFinding.assignment_cycle = parts[5].replace(/"/g, '');
        currentFinding.finding_title = parts[6].replace(/"/g, '');
      }
      
      // Continue reading to extract other fields
      let j = i + 1;
      let detailContent = '';
      let responseContent = '';
      let recommendationContent = '';
      let ratingContent = '';
      let functionContent = '';
      let creatorContent = '';
      
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        
        // Check if this is the start of a new finding
        if (nextLine.startsWith('"C&P-') || nextLine.startsWith('"IT-') || nextLine.startsWith('"HR-') || nextLine.startsWith('"FA-')) {
          break;
        }
        
        // Look for finding detail (HTML content)
        if (nextLine.includes('<div') || nextLine.includes('<span') || nextLine.includes('<p>')) {
          detailContent += ' ' + nextLine;
        }
        
        // Look for management response
        if (nextLine.includes('Management') || nextLine.includes('Response') || nextLine.includes('Not to proceed')) {
          responseContent += ' ' + nextLine;
        }
        
        // Look for recommendations
        if (nextLine.includes('["') && nextLine.includes('"]')) {
          recommendationContent += ' ' + nextLine;
        }
        
        // Look for ratings
        if (nextLine.includes('2-Medium') || nextLine.includes('3-High') || nextLine.includes('1-Low') || 
            nextLine.includes('Control Ineffective') || nextLine.includes('Control Inadequate')) {
          ratingContent += ' ' + nextLine;
        }
        
        // Look for core function
        if (nextLine.includes('Contracts & Procurement') || nextLine.includes('Information Technology') || 
            nextLine.includes('Human Resources') || nextLine.includes('Finance & Accounting')) {
          functionContent += ' ' + nextLine;
        }
        
        // Look for created by
        if (nextLine.includes('Hamda Abdulla') || nextLine.includes('Other Name')) {
          creatorContent += ' ' + nextLine;
        }
        
        j++;
      }
      
      // Process extracted content
      if (detailContent) {
        currentFinding.finding_detail = cleanHtmlContent(detailContent);
      }
      if (responseContent) {
        currentFinding.management_response = cleanHtmlContent(responseContent);
      }
      if (recommendationContent) {
        currentFinding.recommendations = cleanHtmlContent(recommendationContent);
      }
      if (ratingContent) {
        // Extract finding rating
        const ratingMatch = ratingContent.match(/(\d-[A-Za-z]+)/);
        if (ratingMatch) {
          currentFinding.finding_rating = ratingMatch[1];
        }
        
        // Extract control rating
        const controlMatch = ratingContent.match(/(\d-Control [A-Za-z]+)/);
        if (controlMatch) {
          currentFinding.control_rating = controlMatch[1];
        }
      }
      if (functionContent) {
        currentFinding.core_function = cleanHtmlContent(functionContent);
      }
      if (creatorContent) {
        currentFinding.created_by = cleanHtmlContent(creatorContent);
      }
      
      i = j; // Move to the next finding
    } else {
      i++;
    }
  }
  
  // Add the last finding
  if (currentFinding) {
    findings.push(currentFinding);
  }
  
  return findings;
}

// Function to recreate the table
async function recreateTable(connection) {
  try {
    await connection.execute('DROP TABLE IF EXISTS findings_csv_import');
    
    const createTableSQL = `
      CREATE TABLE findings_csv_import (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sequence VARCHAR(100),
        year VARCHAR(10),
        audit_plan_name TEXT,
        assignment_name TEXT,
        assignment_cycle TEXT,
        finding_title TEXT,
        finding_detail TEXT,
        management_response TEXT,
        acceptance TEXT,
        finding_rating VARCHAR(50),
        control_rating VARCHAR(100),
        recommendations TEXT,
        core_risks TEXT,
        core_function TEXT,
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

async function importExtractedData() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');
    
    // Recreate the table
    await recreateTable(connection);
    
    // Read the CSV file
    const csvContent = fs.readFileSync('Findings (1).csv', 'utf8');
    console.log('CSV file read successfully');
    
    // Extract findings data
    const findings = extractFindingsData(csvContent);
    console.log(`Extracted ${findings.length} findings`);
    
    // Insert the findings
    let successCount = 0;
    for (const finding of findings) {
      try {
        const insertSQL = `
          INSERT INTO findings_csv_import (
            sequence, year, audit_plan_name, assignment_name, assignment_cycle,
            finding_title, finding_detail, management_response, acceptance,
            finding_rating, control_rating, recommendations, core_risks,
            core_function, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
          finding.sequence || null,
          finding.year || null,
          finding.audit_plan_name || null,
          finding.assignment_name || null,
          finding.assignment_cycle || null,
          finding.finding_title || null,
          finding.finding_detail || null,
          finding.management_response || null,
          finding.acceptance || null,
          finding.finding_rating || null,
          finding.control_rating || null,
          finding.recommendations || null,
          finding.core_risks || null,
          finding.core_function || null,
          finding.created_by || null
        ];
        
        await connection.execute(insertSQL, values);
        successCount++;
        
        if (successCount % 10 === 0) {
          console.log(`Processed ${successCount} findings...`);
        }
        
      } catch (error) {
        console.error(`Error inserting finding ${finding.sequence}:`, error.message);
      }
    }
    
    console.log(`\nImport completed!`);
    console.log(`Successfully imported: ${successCount} findings`);
    
    // Verify the import
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM findings_csv_import');
    console.log(`Total records in database: ${countResult[0].total}`);
    
    // Show sample of imported data
    const [sampleData] = await connection.execute('SELECT id, sequence, year, audit_plan_name, finding_title, finding_rating FROM findings_csv_import LIMIT 10');
    console.log('\nSample imported data:');
    console.log(JSON.stringify(sampleData, null, 2));
    
    connection.end();
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

importExtractedData();


























