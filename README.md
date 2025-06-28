# Personal Expense Tracker

A simple Spring Boot REST API for tracking personal expenses using JDBC and MySQL.

## Project Overview

This project implements a Personal Expense Tracker with the following features:
- Track daily expenses with title, amount, category, date, and notes
- REST API with CRUD operations
- MySQL database storage using JDBC

## Prerequisites

- Java 11 or higher
- Maven
- MySQL Server

## Project Structure

```
expense-tracker/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── expensetracker/
│   │   │               ├── controller/
│   │   │               │   └── ExpenseController.java
│   │   │               ├── model/
│   │   │               │   └── Expense.java
│   │   │               ├── repository/
│   │   │               │   └── ExpenseRepository.java
│   │   │               ├── service/
│   │   │               │   └── ExpenseService.java
│   │   │               └── ExpenseTrackerApplication.java
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── app.js
│   │       │   ├── index.html
│   │       │   └── styles.css
│   │       ├── application.properties
│   │       └── schema.sql
│   └── test/
└── pom.xml
```

## Database Configuration

The application is configured to connect to a MySQL database. Update the `application.properties` file with your database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=password
```

## Running the Application

1. Clone this repository
2. Navigate to the project directory
3. Build the project:
   ```
   mvn clean install
   ```
4. Run the application:
   ```
   mvn spring-boot:run
   ```
5. The application will be accessible at http://localhost:8080

## API Endpoints

### Create a new expense
```
POST /api/expenses
```
Example request body:
```json
{
  "title": "Grocery Shopping",
  "amount": 75.50,
  "category": "Food",
  "date": "2025-05-14",
  "notes": "Weekly groceries from Walmart"
}
```

### Get all expenses
```
GET /api/expenses
```

### Get expense by ID
```
GET /api/expenses/{id}
```

### Get expenses by category
```
GET /api/expenses/category/{category}
```

### Update an expense
```
PUT /api/expenses/{id}
```
Example request body:
```json
{
  "title": "Grocery Shopping",
  "amount": 82.75,
  "category": "Food",
  "date": "2025-05-14",
  "notes": "Weekly groceries from Walmart + extra fruits"
}
```

### Delete an expense
```
DELETE /api/expenses/{id}
```

## Technologies Used

- Spring Boot 2.7
- Spring JDBC
- MySQL
- Maven
- Lombok
