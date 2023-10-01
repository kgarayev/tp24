// a file with all sql queries in it

const queries = {
  // create receivables table table if does not exist
  createReceivablesTable: () => {
    return `CREATE TABLE IF NOT EXISTS receivables (
            id INT(11) PRIMARY KEY AUTO_INCREMENT,
            reference VARCHAR(255) NOT NULL,
            currencyCode VARCHAR(255) NOT NULL,
            issueDate VARCHAR(255) NOT NULL,
            openingValue DECIMAL(10, 2) NOT NULL,
            paidValue DECIMAL(10, 2) NOT NULL,
            dueDate VARCHAR(255) NOT NULL,
            closedDate VARCHAR(255),
            cancelled BOOLEAN,
            debtorName VARCHAR(255) NOT NULL,
            debtorReference VARCHAR(255) NOT NULL,
            debtorAddress1 VARCHAR(255),
            debtorAddress2 VARCHAR(255),
            debtorTown VARCHAR(255),
            debtorState VARCHAR(255),
            debtorZip VARCHAR(255),
            debtorCountryCode VARCHAR(255) NOT NULL,
            debtorRegistrationNumber VARCHAR(255)
        )`;
  },

  // add receivable query
  addReceivable: () => {
    return `INSERT INTO receivables (
            reference,
            currencyCode,
            issueDate,
            openingValue,
            paidValue,
            dueDate,
            closedDate,
            cancelled,
            debtorName,
            debtorReference,
            debtorAddress1,
            debtorAddress2,
            debtorTown,
            debtorState,
            debtorZip,
            debtorCountryCode,
            debtorRegistrationNumber
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  },

  // Get summary of receivables
  getSummaryQuery: () => {
    return `
          SELECT 
            SUM(CASE WHEN openingValue - paidValue = 0 THEN paidValue ELSE 0 END) AS totalClosedValue,
            SUM(CASE WHEN openingValue - paidValue != 0 THEN openingValue - paidValue ELSE 0 END) AS totalOpenValue,
            SUM(CASE WHEN cancelled = 1 THEN 1 ELSE 0 END) AS totalCancelled
          FROM receivables
        `;
  },

  // GENERIC QUERIES:
  //  a generic remove/delete query
  deleteQuery: () => {
    return `DELETE FROM ?? WHERE id = ?`;
  },

  updateQuery: () => {
    return `UPDATE ?? SET ?? = ? WHERE id = ?`;
  },

  getQuery: () => {
    return `SELECT * FROM ?? WHERE id = ?`;
  },

  getAll: () => {
    return `SELECT * FROM ??`;
  },
};

export { queries };
