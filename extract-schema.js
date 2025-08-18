const mysql = require('mysql2/promise');
const fs = require('fs').promises;
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

async function extractSchema() {
  let connection;
  
  try {
    console.log('Connecting to MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected successfully to audit_platform database');
    
    // Get all tables
    console.log('\nExtracting table schemas...');
    const [tables] = await connection.execute(`
      SELECT 
        TABLE_NAME,
        TABLE_COMMENT,
        TABLE_TYPE
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'audit_platform'
      ORDER BY TABLE_NAME
    `);
    
    let schemaOutput = `-- =====================================================\n`;
    schemaOutput += `-- AUDIT PLATFORM DATABASE SCHEMA EXTRACTION\n`;
    schemaOutput += `-- Generated on: ${new Date().toISOString()}\n`;
    schemaOutput += `-- Database: ${dbConfig.database}\n`;
    schemaOutput += `-- =====================================================\n\n`;
    
    // Extract each table's structure
    for (const table of tables) {
      console.log(`Processing table: ${table.TABLE_NAME}`);
      
      // Get table structure
      const [columns] = await connection.execute(`
        SELECT 
          COLUMN_NAME,
          COLUMN_TYPE,
          IS_NULLABLE,
          COLUMN_KEY,
          COLUMN_DEFAULT,
          EXTRA,
          COLUMN_COMMENT
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = 'audit_platform' 
        AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [table.TABLE_NAME]);
      
      // Get indexes
      const [indexes] = await connection.execute(`
        SELECT 
          INDEX_NAME,
          COLUMN_NAME,
          NON_UNIQUE,
          SEQ_IN_INDEX
        FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = 'audit_platform' 
        AND TABLE_NAME = ?
        ORDER BY INDEX_NAME, SEQ_IN_INDEX
      `, [table.TABLE_NAME]);
      
      // Get foreign keys
      const [foreignKeys] = await connection.execute(`
        SELECT 
          CONSTRAINT_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = 'audit_platform' 
        AND TABLE_NAME = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL
        ORDER BY CONSTRAINT_NAME
      `, [table.TABLE_NAME]);
      
      // Build CREATE TABLE statement
      schemaOutput += `-- Table: ${table.TABLE_NAME}\n`;
      if (table.TABLE_COMMENT) {
        schemaOutput += `-- Description: ${table.TABLE_COMMENT}\n`;
      }
      schemaOutput += `-- Type: ${table.TABLE_TYPE}\n\n`;
      
      // Build column definitions
      let columnDefs = [];
      for (const column of columns) {
        let colDef = `  \`${column.COLUMN_NAME}\` ${column.COLUMN_TYPE}`;
        
        if (column.IS_NULLABLE === 'NO') {
          colDef += ' NOT NULL';
        }
        
        if (column.COLUMN_DEFAULT !== null) {
          if (column.COLUMN_DEFAULT === 'CURRENT_TIMESTAMP') {
            colDef += ' DEFAULT CURRENT_TIMESTAMP';
          } else {
            colDef += ` DEFAULT '${column.COLUMN_DEFAULT}'`;
          }
        }
        
        if (column.EXTRA) {
          colDef += ` ${column.EXTRA}`;
        }
        
        if (column.COLUMN_COMMENT) {
          colDef += ` COMMENT '${column.COLUMN_COMMENT}'`;
        }
        
        columnDefs.push(colDef);
      }
      
      // Build CREATE TABLE statement
      schemaOutput += `CREATE TABLE \`${table.TABLE_NAME}\` (\n`;
      schemaOutput += columnDefs.join(',\n');
      
      // Add primary key
      const primaryKeyColumns = columns.filter(col => col.COLUMN_KEY === 'PRI');
      if (primaryKeyColumns.length > 0) {
        schemaOutput += `,\n  PRIMARY KEY (\`${primaryKeyColumns.map(col => col.COLUMN_NAME).join('`, `')}\`)`;
      }
      
      // Add unique keys
      const uniqueIndexes = indexes.filter(idx => idx.NON_UNIQUE === 0 && idx.INDEX_NAME !== 'PRIMARY');
      const uniqueGroups = {};
      uniqueIndexes.forEach(idx => {
        if (!uniqueGroups[idx.INDEX_NAME]) {
          uniqueGroups[idx.INDEX_NAME] = [];
        }
        uniqueGroups[idx.INDEX_NAME].push(idx.COLUMN_NAME);
      });
      
      Object.entries(uniqueGroups).forEach(([indexName, columns]) => {
        schemaOutput += `,\n  UNIQUE KEY \`${indexName}\` (\`${columns.join('`, `')}\`)`;
      });
      
      // Add foreign keys
      foreignKeys.forEach(fk => {
        schemaOutput += `,\n  CONSTRAINT \`${fk.CONSTRAINT_NAME}\` FOREIGN KEY (\`${fk.COLUMN_NAME}\`) REFERENCES \`${fk.REFERENCED_TABLE_NAME}\` (\`${fk.REFERENCED_COLUMN_NAME}\`)`;
      });
      
      schemaOutput += '\n)';
      
      // Add table options
      const [tableOptions] = await connection.execute(`
        SELECT 
          ENGINE,
          AUTO_INCREMENT,
          TABLE_COLLATION,
          TABLE_COMMENT
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = 'audit_platform' 
        AND TABLE_NAME = ?
      `, [table.TABLE_NAME]);
      
      if (tableOptions.length > 0) {
        const options = tableOptions[0];
        if (options.ENGINE) {
          schemaOutput += ` ENGINE=${options.ENGINE}`;
        }
        if (options.AUTO_INCREMENT) {
          schemaOutput += ` AUTO_INCREMENT=${options.AUTO_INCREMENT}`;
        }
        if (options.TABLE_COLLATION) {
          schemaOutput += ` DEFAULT CHARSET=${options.TABLE_COLLATION.split('_')[0]}`;
        }
        if (options.TABLE_COMMENT) {
          schemaOutput += ` COMMENT='${options.TABLE_COMMENT}'`;
        }
      }
      
      schemaOutput += ';\n\n';
    }
    
    // Extract views
    console.log('\nExtracting views...');
    const [views] = await connection.execute(`
      SELECT 
        TABLE_NAME,
        VIEW_DEFINITION
      FROM information_schema.VIEWS 
      WHERE TABLE_SCHEMA = 'audit_platform'
      ORDER BY TABLE_NAME
    `);
    
    if (views.length > 0) {
      schemaOutput += `-- =====================================================\n`;
      schemaOutput += `-- VIEWS\n`;
      schemaOutput += `-- =====================================================\n\n`;
      
      for (const view of views) {
        console.log(`Processing view: ${view.TABLE_NAME}`);
        schemaOutput += `-- View: ${view.TABLE_NAME}\n`;
        schemaOutput += `CREATE OR REPLACE VIEW \`${view.TABLE_NAME}\` AS\n${view.VIEW_DEFINITION};\n\n`;
      }
    }
    
    // Extract stored procedures
    console.log('\nExtracting stored procedures...');
    const [procedures] = await connection.execute(`
      SELECT 
        ROUTINE_NAME,
        ROUTINE_DEFINITION
      FROM information_schema.ROUTINES 
      WHERE ROUTINE_SCHEMA = 'audit_platform'
      AND ROUTINE_TYPE = 'PROCEDURE'
      ORDER BY ROUTINE_NAME
    `);
    
    if (procedures.length > 0) {
      schemaOutput += `-- =====================================================\n`;
      schemaOutput += `-- STORED PROCEDURES\n`;
      schemaOutput += `-- =====================================================\n\n`;
      
      for (const proc of procedures) {
        console.log(`Processing procedure: ${proc.ROUTINE_NAME}`);
        schemaOutput += `-- Procedure: ${proc.ROUTINE_NAME}\n`;
        schemaOutput += `DELIMITER //\n`;
        schemaOutput += `CREATE PROCEDURE \`${proc.ROUTINE_NAME}\`()\n`;
        schemaOutput += `${proc.ROUTINE_DEFINITION}\n`;
        schemaOutput += `//\nDELIMITER ;\n\n`;
      }
    }
    
    // Extract functions
    console.log('\nExtracting functions...');
    const [functions] = await connection.execute(`
      SELECT 
        ROUTINE_NAME,
        ROUTINE_DEFINITION
      FROM information_schema.ROUTINES 
      WHERE ROUTINE_SCHEMA = 'audit_platform'
      AND ROUTINE_TYPE = 'FUNCTION'
      ORDER BY ROUTINE_NAME
    `);
    
    if (functions.length > 0) {
      schemaOutput += `-- =====================================================\n`;
      schemaOutput += `-- FUNCTIONS\n`;
      schemaOutput += `-- =====================================================\n\n`;
      
      for (const func of functions) {
        console.log(`Processing function: ${func.ROUTINE_NAME}`);
        schemaOutput += `-- Function: ${func.ROUTINE_NAME}\n`;
        schemaOutput += `DELIMITER //\n`;
        schemaOutput += `CREATE FUNCTION \`${func.ROUTINE_NAME}\`()\n`;
        schemaOutput += `RETURNS VARCHAR(255)\n`;
        schemaOutput += `${func.ROUTINE_DEFINITION}\n`;
        schemaOutput += `//\nDELIMITER ;\n\n`;
      }
    }
    
    // Extract triggers
    console.log('\nExtracting triggers...');
    const [triggers] = await connection.execute(`
      SELECT 
        TRIGGER_NAME,
        EVENT_MANIPULATION,
        EVENT_OBJECT_TABLE,
        ACTION_TIMING,
        ACTION_STATEMENT
      FROM information_schema.TRIGGERS 
      WHERE TRIGGER_SCHEMA = 'audit_platform'
      ORDER BY TRIGGER_NAME
    `);
    
    if (triggers.length > 0) {
      schemaOutput += `-- =====================================================\n`;
      schemaOutput += `-- TRIGGERS\n`;
      schemaOutput += `-- =====================================================\n\n`;
      
      for (const trigger of triggers) {
        console.log(`Processing trigger: ${trigger.TRIGGER_NAME}`);
        schemaOutput += `-- Trigger: ${trigger.TRIGGER_NAME}\n`;
        schemaOutput += `DELIMITER //\n`;
        schemaOutput += `CREATE TRIGGER \`${trigger.TRIGGER_NAME}\`\n`;
        schemaOutput += `${trigger.ACTION_TIMING} ${trigger.EVENT_MANIPULATION}\n`;
        schemaOutput += `ON \`${trigger.EVENT_OBJECT_TABLE}\`\n`;
        schemaOutput += `FOR EACH ROW\n`;
        schemaOutput += `${trigger.ACTION_STATEMENT}\n`;
        schemaOutput += `//\nDELIMITER ;\n\n`;
      }
    }
    
    // Write schema to file
    const outputFile = path.join(__dirname, 'audit_platform_schema.sql');
    await fs.writeFile(outputFile, schemaOutput, 'utf8');
    
    console.log(`\n✅ Schema extraction completed successfully!`);
    console.log(`📁 Output file: ${outputFile}`);
    console.log(`📊 Tables processed: ${tables.length}`);
    console.log(`👁️ Views processed: ${views.length}`);
    console.log(`🔧 Procedures processed: ${procedures.length}`);
    console.log(`⚙️ Functions processed: ${functions.length}`);
    console.log(`⚡ Triggers processed: ${triggers.length}`);
    
  } catch (error) {
    console.error('❌ Error during schema extraction:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the extraction
extractSchema().catch(console.error);
