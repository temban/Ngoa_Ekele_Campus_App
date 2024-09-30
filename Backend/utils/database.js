// utils/database.js

import pkg from 'pg';
const { Client } = pkg;

// PostgreSQL connection string to connect to the default database
const defaultConnectionString = process.env.DATABASE_URL || 'postgresql://postgres:allpha01@localhost/postgres';
// Connection string for the new database (will be updated later)
const databaseName = 'ngoa';
const newConnectionString = process.env.DATABASE_URL || `postgresql://postgres:allpha01@localhost/${databaseName}`;

// SQL Query to create the new database
const createDatabaseQuery = `CREATE DATABASE ${databaseName}`;

// SQL Queries to create tables
const createTables = `
-- Create Department Table
CREATE TABLE IF NOT EXISTS Department (
    DepartmentID SERIAL PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL, 
    Disable BOOLEAN DEFAULT false, 
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Course Table
CREATE TABLE IF NOT EXISTS Course (
    CourseID SERIAL PRIMARY KEY,
    CourseCode VARCHAR(50) NOT NULL,
    CourseName VARCHAR(100) NOT NULL,
    Level VARCHAR(10) NOT NULL CHECK (Level IN ('level_1', 'level_2', 'level_3', 'level_4', 'level_5')),
    Disable BOOLEAN DEFAULT false, 
    DepartmentID INT NOT NULL,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ExamType Table
CREATE TABLE IF NOT EXISTS ExamType (
    ExamTypeID SERIAL PRIMARY KEY,
    TypeName VARCHAR(10) NOT NULL CHECK (TypeName IN ('CC', 'SN'))
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS Users (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    StudentMatr VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(50),
    Country VARCHAR(100),
    Town VARCHAR(100),
    Street VARCHAR(100),
    Role VARCHAR(10) NOT NULL CHECK (Role IN ('Student', 'Admin')),
    SubscriptionStatus VARCHAR(10) DEFAULT 'Inactive' CHECK (SubscriptionStatus IN ('Active', 'Inactive')),
    Level VARCHAR(10) NOT NULL CHECK (Level IN ('level_1', 'level_2', 'level_3', 'level_4', 'level_5')),
    DepartmentID INT,
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT true,
    Disable BOOLEAN DEFAULT false, 
    ProfileImage VARCHAR(255),
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

-- Create Result Table
CREATE TABLE IF NOT EXISTS Result (
    ResultID SERIAL PRIMARY KEY,
    StudentName VARCHAR(255) NOT NULL,
    StudentMatr VARCHAR(255),
    Score FLOAT,
    Total FLOAT NOT NULL,
    CourseID INT NOT NULL,
    ExamTypeID INT NOT NULL,
    PDFResult VARCHAR(255),
    ResultDate DATE NOT NULL,
    Disable BOOLEAN DEFAULT false,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID),
    FOREIGN KEY (ExamTypeID) REFERENCES ExamType(ExamTypeID),
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_result UNIQUE (StudentName, StudentMatr, CourseID, ExamTypeID)
);

-- Create NewsFeed Table
CREATE TABLE IF NOT EXISTS NewsFeed (
    NewsFeedID SERIAL PRIMARY KEY,
    NoteTitle VARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    Image1 VARCHAR(255),
    Image2 VARCHAR(255),
    Image3 VARCHAR(255),
    Image4 VARCHAR(255),
    Disable BOOLEAN DEFAULT false,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create CourseNotes Table
CREATE TABLE IF NOT EXISTS CourseNotes (
    NoteID SERIAL PRIMARY KEY,
    CourseID INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    PDFPath VARCHAR(255) NOT NULL,
    Disable BOOLEAN DEFAULT false,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);
`;

// Function to run the SQL commands
const setupDatabase = async () => {
  const defaultClient = new Client({
    connectionString: defaultConnectionString,
  });

  try {
    await defaultClient.connect();
    console.log('Connected to the PostgreSQL server');

    // Check if the database already exists
    const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname='${databaseName}'`;
    const res = await defaultClient.query(dbCheckQuery);
    
    // If the database does not exist, create it
    if (res.rowCount === 0) {
      await defaultClient.query(createDatabaseQuery);
      console.log(`Database '${databaseName}' created successfully`);
    } else {
      console.log(`Database '${databaseName}' already exists, skipping creation.`);
    }

    // End the default client connection
    await defaultClient.end();

    // Now connect to the new database
    const newClient = new Client({
      connectionString: newConnectionString,
    });

    await newClient.connect();
    // console.log(`Connected to the '${databaseName}' database`);

    // Execute the SQL query to create tables
    await newClient.query(createTables);
    // console.log('Tables created successfully');

    // End the new client connection
    await newClient.end();
  } catch (err) {
    // console.error('Error setting up the database:', err);
    throw err; // Rethrow the error to stop the app in case of failure
  }
};

export default setupDatabase;
