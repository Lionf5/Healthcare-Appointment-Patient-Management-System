# 🏥 Healthcare Appointment & Patient Management System

## 📌 Overview
This project is a **frontend-only web application** designed to help small healthcare clinics manage **patients, doctors, and appointments** efficiently.  

It replaces manual record-keeping systems (registers/spreadsheets) with a **simple, user-friendly digital solution**.

---

## ❗ Problem Statement
Manual systems in clinics often lead to:
- Appointment clashes  
- Data inconsistency  
- Difficulty in tracking patient history  

This application solves these issues using a structured and responsive web interface.

---

## 🎯 Objective
To build a frontend application that allows:
- Patient management  
- Doctor management  
- Appointment booking & tracking  
- Data persistence using browser storage  

---

## 🛠️ Technologies Used
- HTML5  
- CSS3 (Flexbox / Grid)  
- JavaScript (ES6)  
- jQuery  
- Bootstrap  
- Browser LocalStorage  

---

## ✨ Features

### 👨‍⚕️ Patient Management
- Add new patient  
- Edit patient details  
- Delete patient  
- Search patient (Name / Phone)  
- Form validation using JavaScript & jQuery  

**Fields:**
- Patient ID (Auto-generated)  
- Name  
- Age  
- Gender  
- Phone Number  
- Email  
- Medical Notes  

---

### 🩺 Doctor Management
- Create, Read, Update, Delete operations  
- Specialization dropdown  
- Reusable form components  

**Fields:**
- Doctor ID  
- Name  
- Specialization  
- Available Time Slot  

---

### 📅 Appointment Management
- Book appointments  
- Prevent duplicate time-slot booking  
- Dynamic dropdowns (Patient & Doctor)  
- Status tracking (Booked / Cancelled / Completed)  
- Filter by date and status  

**Fields:**
- Appointment ID  
- Patient  
- Doctor  
- Date  
- Time Slot  
- Status  

---

## 💾 Data Handling
- Data stored in JavaScript arrays (runtime)  
- Synced with LocalStorage for persistence  
- No backend/API used  

---

## 🎨 UI/UX Features
- Responsive design (Desktop + Tablet)  
- Clean navigation (Navbar / Sidebar)  
- Modal-based forms  
- Confirmation dialogs for delete  
- User-friendly validation messages  

---

## 📂 Project Structure

Healthcare-System/

│── index.html

│── css/

│ └── styles.css

│── js/

│ ├── app.js

│ ├── patient.js

│ ├── doctor.js

│ └── appointment.js

│── assets/

│── README.md

