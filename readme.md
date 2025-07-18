# Sample Management API

---

## 🚀 Overview

This repository hosts a robust Express.js API designed to streamline sample management and staff login processes. It provides endpoints for logging sample data, retrieving sample logs, and authenticating staff members against a PostgreSQL database.

---

## ✨ Features

* **Sample Data Submission**: Securely record `sampleId` and `department` with automatic timestamping.
* **Sample Log Retrieval**: Efficiently fetch all log entries associated with a specific `sampleId`.
* **Staff Authentication**: Verify staff credentials and return their associated department upon successful login.
* **PostgreSQL Integration**: Utilizes `pg` for reliable and scalable database interactions.
* **Environment Variable Support**: Configurable `PORT` for flexible deployment.
* **Error Handling**: Comprehensive error handling for database operations and invalid requests.

---

## 🛠️ Technologies Used

* **Node.js**: Asynchronous event-driven JavaScript runtime.
* **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
* **PostgreSQL**: Powerful, open-source object-relational database system.
* **`pg` (Node.js PostgreSQL client)**: Non-blocking PostgreSQL client for Node.js.

---

##  Voraussetzungen

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
* [PostgreSQL](https://www.postgresql.org/download/) (or access to a PostgreSQL database like Railway)

---

## ⚙️ Setup and Installation

Follow these steps to get your development environment up and running:

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Database Configuration**:
    This project uses a PostgreSQL database. The connection string is currently hardcoded for a Railway PostgreSQL instance. For production, it's highly recommended to use environment variables for your database connection.

    The current connection string is:
    `postgresql://postgres:UTlqxsMpktaofPiNfwmiIzKrYqXSfwCO@shuttle.proxy.rlwy.net:14651/railway`

    **For local development or different deployments**:
    Update the `connectionString` in `index.js` (or your main application file) to point to your PostgreSQL database. For example:
    ```javascript
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL, // Recommended for production
      ssl: {
        rejectUnauthorized: false // Set to true for production with valid SSL certs
      }
    });
    ```
    And then define `DATABASE_URL` in a `.env` file or your environment.

4.  **Database Schema**:
    Ensure your PostgreSQL database has the following tables:

    * **`logdata` table**:
        ```sql
        CREATE TABLE logdata (
            id SERIAL PRIMARY KEY,
            sampleid VARCHAR(255) NOT NULL,
            department VARCHAR(255) NOT NULL,
            time TIME(0) NOT NULL,
            date DATE NOT NULL
        );
        ```

    * **`staff_login` table**:
        ```sql
        CREATE TABLE staff_login (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            department VARCHAR(255) NOT NULL
        );
        ```
        *Self-note*: For `staff_login`, it is highly recommended to hash passwords (e.g., using `bcrypt`) in a production environment for security.

5.  **Start the server**:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000` (or the `PORT` specified in your environment variables).

---

## 📝 API Endpoints

All endpoints accept JSON payloads.

### 1. `POST /submit`

Records a new sample entry with department, current time, and date.

* **URL**: `/submit`
* **Method**: `POST`
* **Request Body**:
    ```json
    {
        "sampleId": "your-sample-id-here",
        "department": "your-department-here"
    }
    ```
* **Success Response (201 Created)**:
    ```json
    {
        "message": "✅ Data inserted successfully"
    }
    ```
* **Error Responses**:
    * **400 Bad Request**: `Missing sampleId or department`
    * **500 Internal Server Error**: `Database insert error`

### 2. `POST /getlog`

Retrieves all log entries for a given `sampleId`.

* **URL**: `/getlog`
* **Method**: `POST`
* **Request Body**:
    ```json
    {
        "sampleId": "your-sample-id-here"
    }
    ```
* **Success Response (200 OK)**:
    ```json
    {
        "success": true,
        "count": 2,
        "data": [
            {
                "department": "Department A",
                "time": "10:30:00",
                "date": "2023-10-26"
            },
            {
                "department": "Department B",
                "time": "14:15:00",
                "date": "2023-10-27"
            }
        ]
    }
    ```
* **Error Responses**:
    * **400 Bad Request**: `{ "success": false, "message": "Missing sampleId" }`
    * **404 Not Found**: `{ "success": false, "message": "No data found for given sampleId" }`
    * **500 Internal Server Error**: `{ "success": false, "message": "Database query error" }`

### 3. `POST /login`

Authenticates a staff user.

* **URL**: `/login`
* **Method**: `POST`
* **Request Body**:
    ```json
    {
        "username": "staff-username",
        "password": "staff-password"
    }
    ```
* **Success Response (200 OK)**:
    ```json
    {
        "department": "Staff Department Name"
    }
    ```
* **Error Responses**:
    * **401 Unauthorized**: `{ "error": "Invalid credentials" }`
    * **500 Internal Server Error**: `{ "error": "Failed to register user" }`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/your-repo-name](https://github.com/your-username/your-repo-name)

---
