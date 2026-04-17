const fs = require('fs').promises;
const path = require('path');
const { pool } = require('./connection');

const initDatabase = async () => {
  try {
    // Read and execute schema.sql file
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    
    // Split by semicolon to execute individual statements
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      if (statement.toLowerCase().includes('create table')) {
        await pool.execute(statement);
      }
    }
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = { initDatabase };