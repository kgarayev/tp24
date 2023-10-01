// main receivables routes
import { Router, Request, Response } from "express";

// import asyncMySQL function
import { asyncMySQL } from "../database/connection";

// importing joi validator
import { validate } from "../validation/index";

// import queries
import { queries } from "../database/queries";

// import sql queries
const {
  addReceivable,
  getSummaryQuery,
  deleteQuery,
  updateQuery,
  getQuery,
  getAll,
} = queries;

// define receivables interface
interface Receivable {
  id?: number;
  reference: string;
  currencyCode: string;
  issueDate: string;
  openingValue: number;
  paidValue: number;
  dueDate: string;
  closedDate?: string | null;
  cancelled?: boolean | null;
  debtorName: string;
  debtorReference: string;
  debtorAddress1?: string | null;
  debtorAddress2?: string | null;
  debtorTown?: string | null;
  debtorState?: string | null;
  debtorZip?: string | null;
  debtorCountryCode: string;
  debtorRegistrationNumber?: string | null;
}

// definte summary interface
interface SummaryType {
  totalClosedValue: number;
  totalOpenValue: number;
  totalCancelled: number;
}

const router = Router();

// POST ROUTE:
// Create a new receivable
router.post("/receivables", async (req: Request, res: Response) => {
  try {
    // this is an array of objects
    const receivableData = req.body as Receivable[];

    console.log(receivableData);

    // check for sql injections
    for (let item of receivableData) {
      for (let key in item) {
        if (
          typeof (req.body as any)[key] === "string" &&
          (req.body as any)[key].includes("%")
        ) {
          res.send("Hacker identified!");
          return;
        }
      }
    }

    // Validate each receivable object individually
    for (let item of receivableData) {
      const localErrors = await validate(item, "addReceivable");
      if (
        localErrors !== null &&
        localErrors !== undefined &&
        Object.keys(localErrors).length !== 0
      ) {
        console.log(localErrors);
        res.status(400).json({ error: "Incomplete or invalid request" });
        return;
      }
    }

    for (let item of receivableData) {
      // Add a new receivable into database table
      await asyncMySQL(addReceivable(), [
        item.reference,
        item.currencyCode,
        item.issueDate,
        item.openingValue,
        item.paidValue,
        item.dueDate,
        item.closedDate,
        item.cancelled,
        item.debtorName,
        item.debtorReference,
        item.debtorAddress1,
        item.debtorAddress2,
        item.debtorTown,
        item.debtorState,
        item.debtorZip,
        item.debtorCountryCode,
        item.debtorRegistrationNumber,
      ]);
    }

    res.status(201).json({ message: "Receivables created successfully" });
  } catch (error) {
    console.error("Error creating receivable:", error);
    res.status(500).json({ error: "Error creating receivable" });
  }
});

// GET SUMMARY ROUTE
// Retrieve a summary of receivables
router.get("/receivables/summary", async (req: Request, res: Response) => {
  try {
    // get the summary of receivables from the database
    const summary = (await asyncMySQL(getSummaryQuery(), [])) as SummaryType[];

    if (summary.length > 0) {
      res.status(200).json(summary[0]);
    } else {
      res.status(404).json({ error: "No summary data found" });
    }
  } catch (error) {
    console.error("Error retrieving summary:", error);
    res.status(500).json({ error: "Error retrieving summary" });
  }
});

// GET ROUTE:
// get all receivables router
router.get("/receivables", async (req, res) => {
  // ask sql for data
  const results = await asyncMySQL(getAll(), ["receivables"]);

  res.status(200).json(results);
});

// GET ROUTE:
// get a specific receivable
router.get("/receivables/:id", async (req, res) => {
  // convert id from string to number
  const id = Number(req.params.id);

  // check if the id is number
  if (Number.isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  // Execute the SQL query
  const results = (await asyncMySQL(getQuery(), [
    "receivables",
    id,
  ])) as Receivable[];

  // check if the results are there
  if (results.length > 0) {
    res.status(200).json(results);
    return;
  }

  // if the resuts are not there, communicate this
  res.status(404).json({ error: "Id not found" });
});

// UPDATE ROUTE:
// Update a specific receivable by ID
router.patch("/receivables/:id", async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);

    // Convert id from string to number
    const receivableId = Number(req.params.id);

    // Validate the request body
    const localErrors = await validate(req.body, "updateReceivable");

    // Check if the id is valid
    if (Number.isNaN(receivableId) || receivableId <= 0) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    // Check if there are validation errors
    if (
      localErrors !== null &&
      localErrors !== undefined &&
      Object.keys(localErrors).length !== 0
    ) {
      console.log(localErrors);
      res.status(400).json({ error: "Incomplete or invalid request" });
      return;
    }

    console.log(req.body);

    // destructure the request body
    const {
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
      debtorRegistrationNumber,
    } = req.body;

    try {
      // check if a receivable with this id exists
      const results = (await asyncMySQL(
        `SELECT * FROM receivables WHERE id = ?`,
        [receivableId]
      )) as Receivable[];

      // if no receivable exists return an error
      if (results.length === 0) {
        res.status(404).json({ error: "Receivable not found" });
        return;
      }

      // individually update the entries

      if (reference !== undefined && typeof reference === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "reference",
          reference,
          receivableId,
        ]);
      }

      if (currencyCode !== undefined && typeof currencyCode === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "currencyCode",
          currencyCode,
          receivableId,
        ]);
      }

      if (issueDate !== undefined && typeof issueDate === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "issueDate",
          issueDate,
          receivableId,
        ]);
      }

      if (openingValue !== undefined && !isNaN(openingValue)) {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "openingValue",
          openingValue,
          receivableId,
        ]);
      }

      if (paidValue !== undefined && !isNaN(paidValue)) {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "paidValue",
          paidValue,
          receivableId,
        ]);
      }

      if (dueDate !== undefined && typeof dueDate === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "dueDate",
          dueDate,
          receivableId,
        ]);
      }

      if (closedDate !== undefined && typeof closedDate === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "closedDate",
          closedDate,
          receivableId,
        ]);
      }

      if (cancelled !== undefined && typeof cancelled === "boolean") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "cancelled",
          cancelled,
          receivableId,
        ]);
      }

      if (debtorName !== undefined && typeof debtorName === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorName",
          debtorName,
          receivableId,
        ]);
      }

      if (
        debtorReference !== undefined &&
        typeof debtorReference === "string"
      ) {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorReference",
          debtorReference,
          receivableId,
        ]);
      }

      if (debtorAddress1 !== undefined && typeof debtorAddress1 === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorAddress1",
          debtorAddress1,
          receivableId,
        ]);
      }

      if (debtorAddress2 !== undefined && typeof debtorAddress2 === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorAddress2",
          debtorAddress2,
          receivableId,
        ]);
      }

      if (debtorTown !== undefined && typeof debtorTown === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorTown",
          debtorTown,
          receivableId,
        ]);
      }

      if (debtorState !== undefined && typeof debtorState === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorState",
          debtorState,
          receivableId,
        ]);
      }

      if (debtorZip !== undefined && typeof debtorZip === "string") {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorZip",
          debtorZip,
          receivableId,
        ]);
      }

      if (
        debtorCountryCode !== undefined &&
        typeof debtorCountryCode === "string"
      ) {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorCountryCode",
          debtorCountryCode,
          receivableId,
        ]);
      }

      if (
        debtorRegistrationNumber !== undefined &&
        typeof debtorRegistrationNumber === "string"
      ) {
        await asyncMySQL(updateQuery(), [
          "receivables",
          "debtorRegistrationNumber",
          debtorRegistrationNumber,
          receivableId,
        ]);
      }
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Error updating property" });
      return;
    }

    res.status(200).json({ message: "Receivable updated successfully" });
  } catch (error) {
    console.error("Error updating receivable:", error);
    res.status(500).json({ error: "Error updating receivable" });
  }
});

// DELETE ROUTE
// Delete a specific receivable by id
router.delete("/receivables/:id", async (req: Request, res: Response) => {
  try {
    const receivableId = Number(req.params.id);

    if (Number.isNaN(receivableId)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    // Delete the receivable from the table
    const deletedReceivable = await asyncMySQL(deleteQuery(), [
      "receivables",
      receivableId,
    ]);

    if (deletedReceivable === 0) {
      return res.status(404).json({ error: "Receivable not found" });
    }

    res.status(200).json({ message: "Receivable deleted successfully" });
  } catch (error) {
    console.error("Error deleting receivable:", error);
    res.status(500).json({ error: "Error deleting receivable" });
  }
});

export default router;
