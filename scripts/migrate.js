const mysql = require("mysql2/promise")
const fs = require("fs").promises
const path = require("path")
require("dotenv").config()

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  })

  try {
    // Create migrations table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Get executed migrations
    const [executedMigrations] = await connection.execute("SELECT filename FROM migrations ORDER BY filename")
    const executed = executedMigrations.map((row) => row.filename)

    // Read migration files
    const migrationsDir = path.join(__dirname, "../database/migrations")
    const files = await fs.readdir(migrationsDir)
    const migrationFiles = files.filter((file) => file.endsWith(".sql")).sort()

    // Execute pending migrations
    for (const file of migrationFiles) {
      if (!executed.includes(file)) {
        console.log(`Executing migration: ${file}`)

        const filePath = path.join(migrationsDir, file)
        const sql = await fs.readFile(filePath, "utf8")

        await connection.execute(sql)
        await connection.execute("INSERT INTO migrations (filename) VALUES (?)", [file])

        console.log(`Migration completed: ${file}`)
      }
    }

    console.log("All migrations completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

runMigrations()
