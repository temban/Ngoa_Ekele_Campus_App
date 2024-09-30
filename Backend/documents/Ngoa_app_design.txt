Key Structure:
1.	Departments: Geography (and the possibility to add more departments).
2.	Levels: 1 to 5 (for each department).
3.	Courses: Each level has 5 courses (e.g., Geo 111, Geo 112, etc.).
4.	Exams: Each course has two types of exams:
o	CC: Continuous Assessment.
o	SN: Session Normale (Final Exam).
o	Notes: Each course has course materials .
________________________________________
Refined Workflow
1. Admin Workflow:
•	Admin logs in.
•	Admin can:
o	Add/Update departments.
o	Add/Update courses and levels for each department.
o	Upload results (for CC or SN) via Excel sheets.
o	Upload news feeds.
o	Upload course notes (PDFs).
o	Manage student subscriptions.
2. Student Workflow:
•	Student logs in.
•	Selects Department → Level → Course.
•	Chooses between viewing CC or SN results for the course.
•	Searches for their name in the result list.
•	Accesses campus news feeds.
•	Accesses course notes (if they are subscribed).


+-----------------------------+           1:M         +-----------------------------+
|       Department            |<--------------------->|          User               |                                                             
+-----------------------------+                       +-----------------------------+
| - DepartmentID: int         |                       | - UserID: int (PK)          |
| - DepartmentName: string    |                       | - Name: string              | 
+-----------------------------+                       | - Email: string             |
| + createDepartment(): void  |                       | - Password: string          |
| + readDepartment(id): Dept  |                       | - Phone: string             |
| + updateDepartment(id): void|                       | - Country: string           |
| + deleteDepartment(id): void|                       | - Town: string              |
+-----------------------------+                       | - Street: string            |
             |                                        | - Role: enum                |
             |                                        |   (values:Student, Admin)   |
             |                                   n    | - SubscriptionStatus: enum  |
             |                                        |   (values:Active, Inactive) |             
             |                                        | - isActive: Boolean         |             
             |                                        | - ProfileImage: String      |
             |                                        | - Level: enum               |
             |                                        |    (values: 'level_1',      |
             |                                        |    'level_2', 'level_3',    |
            1:M                                       |    'level_4', 'level_5')    |
             |                                        +-----------------------------+
             |                                        | + createUser(): void        |
             |                                        | + readUser(id): User        |
             |                                        | + updateUser(id): void      |
             |                                        | + deleteUser(id): void      |
             |                                        +-----------------------------+
             v
+--------------------------+    1:M     +---------------------------+    1:M     +--------------------------+
|        Course            |<---------->|         Result            |<---------->|        ExamType          |
+--------------------------+            +---------------------------+            +--------------------------+
| - CourseID: int          |            | - ResultID: int           |            | - ExamTypeID: int        |
| - CourseCode: string     |            | - StudentName: string     |            | - TypeName: enum         |
| - CourseName: string     |            | - StudentMatr: string     |            |   (values: 'CC', 'SN')   |
| - Level: enum            |            | - Score: float            |            +--------------------------+
|   (values: 'level_1',    |            | - Total: float            |
|    'level_2', 'level_3', |            | - CourseID: int           |
|    'level_4', 'level_5') |            | - ExamTypeID: int         |
| - DepartmentID: int      |            | - RegistrationDate: Timestamp |
+--------------------------+            +----------------------------+
| + createCourse(): void   |            | + createResult(): void     |
| + readCourse(id): Course |            | + readResult(id): Result   |
| + updateCourse(id): void |            | + updateResult(id): void   |
| + deleteCourse(id): void |            | + deleteResult(id): void   |
+--------------------------+            +----------------------------+
                      |                                       
                     1:M
                      |
                      v
+--------------------------+
|       CourseNotes        |
+--------------------------+
| - NoteID: int            |
| - CourseID: int          |
| - NoteTitle: string      |
| - PDFPath: string        |
+--------------------------+
| + uploadNote(): void     |
| + readNote(id): Note     |
| + updateNote(id): void   |
| + deleteNote(id): void   |
+--------------------------+

+--------------------------+
|       NewsFeed           |
+--------------------------+
| - NewsFeedID: int        |
| - Title: string          |
| - Content: string        |
| - Image1: string         |  -- Path for the first image
| - Image2: string         |  -- Path for the second image
| - Image3: string         |  -- Path for the third image
| - Image4: string         |  -- Path for the fourth image
| - CreatedAt: timestamp   |
+--------------------------+
| + createNewsFeed(): void |
| + readNewsFeed(id): News |
| + updateNewsFeed(id): void|
| + deleteNewsFeed(id): void|
+--------------------------+
                                                                                        
Key Relations:
1.	User to Department: A user (admin or student) is linked to a department. Students select their department.
2.	Department to Level: Each department has multiple levels (1 to 5 in your case).
3.	Level to Course: Each level has multiple courses (e.g., Geo 111, Geo 112).
4.	Course to Result: For each course, results (either CC or SN) can be uploaded and retrieved.
5.	Result to ExamType: Results are linked to an exam type (either Continuous Assessment - CC or Session Normale - SN).
