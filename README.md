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
                                                                                        
Key Relations:
1.	User to Department: A user (admin or student) is linked to a department. Students select their department.
2.	Department to Level: Each department has multiple levels (1 to 5 in your case).
3.	Level to Course: Each level has multiple courses (e.g., Geo 111, Geo 112).
4.	Course to Result: For each course, results (either CC or SN) can be uploaded and retrieved.
5.	Result to ExamType: Results are linked to an exam type (either Continuous Assessment - CC or Session Normale - SN).




![IRjuQrisxE](https://github.com/user-attachments/assets/ffc6b58a-4399-4d8c-9dc9-ca665ba9f4a9)
![chrome_1DNtsFwW9N](https://github.com/user-attachments/assets/9d5bca5b-2d20-4eb0-a99d-147d12f57ea3)
