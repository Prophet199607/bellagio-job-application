const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Basic env parser
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const data = fs.readFileSync(envPath, 'utf8');
      data.split('\n').forEach((line) => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
      console.log('Loaded .env');
    }
  } catch (e) {
    console.log('Could not load .env, using defaults');
  }
}

loadEnv();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log(
      `Connected to MySQL server. Creating database if not exists...`
    );
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'jobportal'}\``
    );
    await connection.query(`USE \`${process.env.DB_NAME || 'jobportal'}\``);
    console.log(`Using database ${process.env.DB_NAME || 'jobportal'}.`);

    // Create vacancies table
    console.log('Creating vacancies table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vacancies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        location VARCHAR(150),
        salary_range VARCHAR(100),
        status ENUM('Available', 'Not Available') DEFAULT 'Available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create applied table
    console.log('Creating applied table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS applied (
        id CHAR(36) PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        address VARCHAR(255),
        age_range VARCHAR(20),
        gender VARCHAR(20),
        total_experience INT,
        expected_salary DECIMAL(12,2),
        vacancy_id INT,
        cv_file VARCHAR(255) NOT NULL,
        educational_files TEXT NOT NULL,
        professional_files TEXT,
        applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE SET NULL
      );
    `);

    // Seed vacancies
    const vacancies = [
      'Senior Developer',
      'Junior Developer',
      'UI/UX Designer',
      'Project Manager',
      'DevOps Engineer'
    ];

    console.log('Seeding vacancies if empty...');
    for (const title of vacancies) {
      const [rows] = await connection.query(
        'SELECT id FROM vacancies WHERE title = ?',
        [title]
      );
      if (rows.length === 0) {
        await connection.query('INSERT INTO vacancies (title) VALUES (?)', [
          title
        ]);
        console.log(`Inserted vacancy: ${title}`);
      }
    }

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

main();
