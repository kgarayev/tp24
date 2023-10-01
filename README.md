# Receivables Management API

This is a Node.js Express API, crafted in TypeScript, designed to manage receivables. It offers CRUD operations to facilitate interaction with an underlying MySQL database.

## Features

1. **Database Initialisation**: Automatically initialises the database if not present. Enhances traditional callbacks with Promises for optimal async/await compatibility.
2. **Receivables CRUD**: Standard operations to Create, Read, Update, and Delete receivables.
3. **Receivables Summary**: Furnishes a concise overview of all receivables.
4. **Input Validation**: Employs the JOI validator for robust data validation.
5. **SQL Injection Protection**: Implements checks to guard against possible SQL injections based on user inputs.
6. **TypeScript Integration**: Implements strong typing with TypeScript, which includes interfaces for `Receivable` and `SummaryType`.

## Endpoints

### 1. Create a New Receivable

- **Endpoint**: `/receivables`
- **Method**: `POST`

### 2. Retrieve Receivables Summary

- **Endpoint**: `/receivables/summary`
- **Method**: `GET`

### 3. Fetch All Receivables

- **Endpoint**: `/receivables`
- **Method**: `GET`

### 4. Access Specific Receivable by ID

- **Endpoint**: `/receivables/:id`
- **Method**: `GET`

### 5. Modify Receivable by ID

- **Endpoint**: `/receivables/:id`
- **Method**: `PATCH`

### 6. Remove Receivable by ID

- **Endpoint**: `/receivables/:id`
- **Method**: `DELETE`

## Notes

### Time Invested in Code Development

This project spanned a few days, with a cumulative effort of 4.5 hours on code writing. Navigating the SQL database, crafting the joi validation, and thorough testing using Insomnia were notably most time-consuming activities.

### Opportunities for Enhancement

- Integration of an ORM for the SQL database.
- Extensive testing.
- Incorporating authorisation and authentication mechanisms.
