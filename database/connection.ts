// import mysql
import mysql from "mysql";

// import queries functions
import { queries } from "./queries";

const { createReceivablesTable } = queries;

// instance of a connection
// this driver does not support promises
// need to create our own wrapper / promisify this
// connect to RDMS without specifying the database itself
const myConnection = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: 3306,
});

// wrapping the query code in the promise to make it async await compatible
// resolve if no error, reject if error
// wrapping the drive inside a promise
// returns an array
const asyncMySQL = (query: string, params: any[]) => {
  return new Promise((resolve, reject) => {
    myConnection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

// create a database function if one does not already exist
const createDB = async (dbName: string) => {
  try {
    // Create the database if it doesn't exist
    await asyncMySQL(`CREATE DATABASE IF NOT EXISTS ${dbName}`, []);

    console.log("database created");

    // wrap inside the promise
    return new Promise<void>((resolve, reject) => {
      // Switch to using the new database
      myConnection.changeUser({ database: dbName }, (error) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }
        resolve();
        return;
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// create a database called tp24
createDB("tp24")
  .then(async () => {
    // create the individual tables now
    // create tables createUsersTable, accounts and transactions
    try {
      await asyncMySQL(createReceivablesTable(), []);
    } catch (error) {
      console.log(error);
    }
  })
  .catch((error) => {
    console.error("An error occured while creating the database:", error);
  });

// exporting the function to be used elsewhere on the project
export { asyncMySQL, createDB };
