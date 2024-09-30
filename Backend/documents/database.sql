-- Connection to PostgreSQL
-- psql postgresql://postgres:allpha01@localhost/ngoa
-- \c ngoa

-- add new column on an existing table
ALTER TABLE Users ADD COLUMN IsActive BOOLEAN DEFAULT true;

-- Create the ngoa database
CREATE DATABASE ngoa;

-- Switch to the ngoa database
-- \c ngoa

-- Drop the Department table if it exists
DROP TABLE IF EXISTS Department;

-- Create Department Table
CREATE TABLE Department (
    DepartmentID SERIAL PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL,
    Disable BOOLEAN DEFAULT false, 
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRUD for Department
-- Create
INSERT INTO Department (DepartmentName) VALUES ('Geography');

-- Read
SELECT * FROM Department;

-- Update
UPDATE Department SET DepartmentName = 'Software Engineering' WHERE DepartmentID = 1;

-- Delete
DELETE FROM Department WHERE DepartmentID = 1;


-- Drop the Course table if it exists
DROP TABLE IF EXISTS Course;

-- Create Course Table
CREATE TABLE Course (
    CourseID SERIAL PRIMARY KEY,
    CourseCode VARCHAR(50) NOT NULL,
    CourseName VARCHAR(100) NOT NULL,
    Level VARCHAR(10) NOT NULL CHECK (Level IN ('level_1', 'level_2', 'level_3', 'level_4', 'level_5')),  -- Level defined as VARCHAR
    Disable BOOLEAN DEFAULT false, 
    DepartmentID INT NOT NULL,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRUD for Course
-- Create
INSERT INTO Course (CourseCode, CourseName, Level, DepartmentID) 
VALUES 
    ('Geo 111', 'Introduction to Geography', 'level_1', (SELECT DepartmentID FROM Department WHERE DepartmentName = 'Geography')),
    ('Geo 112', 'Physical Geography', 'level_1', (SELECT DepartmentID FROM Department WHERE DepartmentName = 'Geography')),
    ('Geo 121', 'Human Geography', 'level_1', (SELECT DepartmentID FROM Department WHERE DepartmentName = 'Geography')),
    ('Geo 122', 'Cartography', 'level_1', (SELECT DepartmentID FROM Department WHERE DepartmentName = 'Geography')),
    ('Geo 152', 'Geographic Information Systems', 'level_1', (SELECT DepartmentID FROM Department WHERE DepartmentName = 'Geography'));

-- Read
SELECT * FROM Course;

-- Update
UPDATE Course SET CourseName = 'Updated Course Name' WHERE CourseID = 1;

-- Delete
DELETE FROM Course WHERE CourseID = 1;


-- Drop the ExamType table if it exists
DROP TABLE IF EXISTS ExamType;

-- Create ExamType Table
CREATE TABLE ExamType (
    ExamTypeID SERIAL PRIMARY KEY,
    TypeName VARCHAR(10) NOT NULL CHECK (TypeName IN ('CC', 'SN'))
);

-- CRUD for ExamType
-- Create
INSERT INTO ExamType (TypeName) VALUES ('CC');
INSERT INTO ExamType (TypeName) VALUES ('SN');

-- Read
SELECT * FROM ExamType;

-- Update
UPDATE ExamType SET TypeName = 'SN' WHERE ExamTypeID = 1;

-- Delete
DELETE FROM ExamType WHERE ExamTypeID = 1;


-- Drop the User table if it exists
DROP TABLE IF EXISTS Users;

-- Create User Table
CREATE TABLE Users (
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
    DepartmentID INT,  -- Foreign key reference to Department
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT true,  -- New field to enable/disable user
    Disable BOOLEAN DEFAULT false, 
    ProfileImage VARCHAR(255),  -- New field to store user profile image URL
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)  -- Foreign key constraint
);


-- CRUD for User
-- Create
INSERT INTO Users (Name, Email, Password, Role, SubscriptionStatus, Level, DepartmentID) 
VALUES ('John Doe', 'john.doe@example.com', 'hashed_password', 'Student', 'Active', 'level_1', (SELECT DepartmentID FROM Department WHERE DepartmentName = 'Geography'));

-- Read
SELECT * FROM Users;

-- Update
UPDATE Users SET SubscriptionStatus = 'Active' WHERE UserID = 1;

-- Delete
DELETE FROM Users WHERE UserID = 1;

-- add new column
ALTER TABLE Users ADD COLUMN IsActive BOOLEAN DEFAULT true;

-- Drop the Result table if it exists
DROP TABLE IF EXISTS Result;

-- Create Result Table
CREATE TABLE Result (
    ResultID SERIAL PRIMARY KEY,
    StudentName VARCHAR(255) NOT NULL,
    StudentMatr VARCHAR(255),  -- Removed NOT NULL constraint
    Score FLOAT,               -- Removed NOT NULL constraint
    Total FLOAT NOT NULL,
    CourseID INT NOT NULL,
    ExamTypeID INT NOT NULL,
    PDFResult VARCHAR(255),  -- Adding PDFResult
    ResultDate DATE NOT NULL,          -- Adding ResultDate column
    Disable BOOLEAN DEFAULT false, 
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID),
    FOREIGN KEY (ExamTypeID) REFERENCES ExamType(ExamTypeID),
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_result UNIQUE (StudentName, StudentMatr, CourseID, ExamTypeID)  -- Unique constraint to prevent duplicates
);

-- CRUD for Result
-- Create
INSERT INTO Result (StudentID, CourseID, Score, ExamTypeID) VALUES (1, 1, 85.5, 1);

-- Read
SELECT * FROM Result;

-- Update
UPDATE Result SET Score = 90.0 WHERE ResultID = 1;

-- Delete
DELETE FROM Result WHERE ResultID = 1;


-- Drop the NewsFeed table if it exists
DROP TABLE IF EXISTS NewsFeed;

-- Create NewsFeed Table
CREATE TABLE NewsFeed (
    NewsFeedID SERIAL PRIMARY KEY,
    NoteTitle VARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    Image1 VARCHAR(255),  -- Path for the first image
    Image2 VARCHAR(255),  -- Path for the second image
    Image3 VARCHAR(255),  -- Path for the third image
    Image4 VARCHAR(255),  -- Path for the fourth image
    Disable BOOLEAN DEFAULT false,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRUD for NewsFeed
-- Create
INSERT INTO NewsFeed (NoteTitle, Content, Image1, Image2, Image3, Image4) 
VALUES 
    ('New Course Available', 
     'We have launched a new course in AI.', 
     'C:/Users/shint/OneDrive/Images/b.png', 
     'C:/Users/shint/OneDrive/Images/b.png', 
     'C:/Users/shint/OneDrive/Images/b.png', 
     'C:/Users/shint/OneDrive/Images/b.png');

-- Read
SELECT * FROM NewsFeed;

-- Update
UPDATE NewsFeed SET Title = 'Updated Course Information', Image1 = '/path/to/updated_image1.jpg' WHERE NewsFeedID = 1;

-- Delete
DELETE FROM NewsFeed WHERE NewsFeedID = 1;



-- Drop the CourseNotes table if it exists
DROP TABLE IF EXISTS CourseNotes;

-- Create CourseNotes Table
CREATE TABLE CourseNotes (
    NoteID SERIAL PRIMARY KEY,
    CourseID INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    PDFPath VARCHAR(255) NOT NULL,
    Disable BOOLEAN DEFAULT false,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);


-- CRUD for CourseNotes
-- Create
INSERT INTO CourseNotes (CourseID, PDFPath) VALUES (1, 'C:/Users/shint/OneDrive/Images/w.pdf');

-- Read
SELECT * FROM CourseNotes;

-- Update
UPDATE CourseNotes SET PDFPath = '/path/to/updated_note.pdf' WHERE NoteID = 1;

-- Delete
DELETE FROM CourseNotes WHERE NoteID = 1;
