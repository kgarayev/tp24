import joi from "joi";

// define schema for joi validation

// Schema for the receivables table
// adding a receivable
const addReceivable = {
  reference: joi.string().required().max(255),
  currencyCode: joi.string().required(),
  issueDate: joi.string().required(),
  openingValue: joi.number().required(),
  paidValue: joi.number().required(),
  dueDate: joi.string().required(),
  closedDate: joi.string().allow(null).optional(),
  cancelled: joi.boolean().allow(null).optional(),
  debtorName: joi.string().required().max(255),
  debtorReference: joi.string().required().max(255),
  debtorAddress1: joi.string().allow(null).optional(),
  debtorAddress2: joi.string().allow(null).optional(),
  debtorTown: joi.string().allow(null).optional(),
  debtorState: joi.string().allow(null).optional(),
  debtorZip: joi.string().max(10).allow(null).optional(),
  debtorCountryCode: joi.string().required(),
  debtorRegistrationNumber: joi.string().allow(null).optional(),
};

// updating a receivable
// all entries are optional
const updateReceivable = {
  reference: joi.string().max(255).optional(),
  currencyCode: joi.string().optional(),
  issueDate: joi.string().optional(),
  openingValue: joi.number().optional(),
  paidValue: joi.number().optional(),
  dueDate: joi.string().optional(),
  closedDate: joi.string().allow(null).optional(),
  cancelled: joi.boolean().allow(null).optional(),
  debtorName: joi.string().optional().max(255),
  debtorReference: joi.string().optional().max(255),
  debtorAddress1: joi.string().allow(null).optional(),
  debtorAddress2: joi.string().allow(null).optional(),
  debtorTown: joi.string().allow(null).optional(),
  debtorState: joi.string().allow(null).optional(),
  debtorZip: joi.string().max(10).allow(null).optional(),
  debtorCountryCode: joi.string().optional(),
  debtorRegistrationNumber: joi.string().allow(null).optional(),
};

export { addReceivable, updateReceivable };
