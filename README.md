# Student-Sync

## Overview
Student-Sync is a comprehensive full-stack application designed to streamline and simplify student management process. The project integrates various functionalities, as well as several 
modern technologies to deliver a smooth experience for the users.

## Features
• **Authentication and Authorization:** secure login and register functionalities implemented using JSON Web Tokens (JWT) and interceptors on the client side

• **Student Management:** create, delete, update and view the details of a student, including the list of courses the student is enrolled in

• **Pagination:** efficient navigation through large datasets of students with adjustable page sizes

• **Sorting:** sort students by different criteria, such as their name or score, in ascending or descending order

• **Offline Capabilities**: notify the users when the server is down, access essential features (create, delete, update) and synchronize the changes when the server is online again

• **Infinte Scrolling:** on demand fetching of courses

• **Grades Chart:** view statistics about the grades of the students

## Technical Stack
• **Frontend:** React with TypeScript, Tailwind CSS

• **Backend:** Node.js Express with TypeScript, Prisma ORM for communication with the database

• **Database:** MySQL

• **Containerization:** Docker

• **Deployment:** Amazon Web Services, Elastic Cloud Compute (the EC2 instance is currently stopped)
