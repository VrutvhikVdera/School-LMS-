# 🎓 School LMS Backend

A role-based **School Learning Management System (LMS)** backend built with **Node.js, Express, and MongoDB**. The project follows **MVC architecture**, implements **JWT authentication**, and supports **Admin, Teacher, and Student** roles with proper authorization.

---

## 🚀 Features

* Role-based access control (Admin / Teacher / Student)
* JWT authentication & authorization
* Secure password hashing with bcryptjs
* Clean MVC architecture
* Scalable folder structure
* MongoDB with Mongoose ODM
* RESTful APIs

---

## 🛠 Tech Stack

* **Node.js** – Backend runtime
* **Express.js** – Web framework
* **MongoDB** – Database
* **Mongoose** – ODM
* **JWT** – Authentication
* **bcryptjs** – Password hashing
* **Postman** – API testing

---

## 📁 Project Structure

```
School-LMS
│
├── index.js
├── package.json
│
├── config
│   └── db.connect.js
│
├── controllers
│   ├── auth
│   │   └── authController.js
│   ├── admin
│   │   └── adminController.js
│   ├── teacher
│   │   └── teacherController.js
│   └── student
│       └── studentController.js
│
├── middlewares
│   ├── authMiddleware.js
│   └── checkRoleMiddleware.js
│
├── models
│   ├── user
│   │   └── userModel.js
│   ├── standard
│   │   └── standardModel.js
│   └── subject
│       └── subjectModel.js
│
├── routes
│   ├── index.js
│   ├── admin
│   │   └── index.js
│   ├── teacher
│   │   └── index.js
│   └── student
│       └── index.js
│
└── utils
    ├── createToken.js
    ├── verifyToken.js
    └── passwordverify.js
```

---

## 🔐 Authentication Flow

1. User logs in using email & password
2. Server generates a JWT token
3. Token is sent in response
4. Client sends token in `Authorization` header
5. Middleware verifies token & role
6. Access granted based on role

---

## 👥 User Roles

### 👨‍💼 Admin

* Register & manage teachers
* Register & manage students
* Create standards (classes)
* Create & assign subjects
* Full system access

### 👩‍🏫 Teacher

* View own profile
* View assigned subjects
* View assigned students
* Update own profile

### 👨‍🎓 Student

* Login & access own data
* Limited access

---

## 📌 API Base URLs

```
/api/admin
/api/teacher
/api/student
```

---

## ▶️ How to Run the Project

### 1️⃣ Clone the repository

```bash
git clone <repository-url>
cd School-LMS
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start MongoDB

Make sure MongoDB is running locally.

### 4️⃣ Start the server

```bash
npm start
```

Server will run on:

```
http://localhost:3000
```

---

## 🧪 API Testing

Use **Postman** to test APIs.

* Login and copy JWT token
* Add token in headers:

```
Authorization: Bearer <token>
```

---

## 🎯 Why This Project?

* Real-world backend architecture
* Interview-ready project
* Clean and maintainable codebase
* Scalable for future features

---

## 📌 Future Improvements

* Pagination & filtering
* Request validation
* Refresh tokens
* Logging & monitoring
* Frontend integration

---

## 👨‍💻 Author

**Your Name**
Backend Developer

---

## ⭐ Support

If you find this project useful, give it a ⭐ on GitHub!
