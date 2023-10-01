import joi, { ObjectSchema, ValidationError, ValidationErrorItem } from "joi";

import { addReceivable, updateReceivable } from "./schema";

// main joi validation functions

// define payload interface
interface Payload {
  reference?: string;
  currencyCode?: string;
  issueDate?: string;
  openingValue?: number;
  paidValue?: number;
  dueDate?: string;
  closedDate?: string | null;
  cancelled?: boolean | null;
  debtorName?: string;
  debtorReference?: string;
  debtorAddress1?: string | null;
  debtorAddress2?: string | null;
  debtorTown?: string | null;
  debtorState?: string | null;
  debtorZip?: string | null;
  debtorCountryCode?: string;
  debtorRegistrationNumber?: string | null;
}

// main validation function
const validate = async (payload: Payload, type: string) => {
  let option: ObjectSchema = joi.object({});

  switch (type) {
    case "addReceivable":
      option = joi.object(addReceivable);
      break;

    case "updateReceivable":
      option = joi.object(updateReceivable);
      break;

    default:
      break;
  }

  try {
    const results = await option.validateAsync(payload, { abortEarly: false });
    return null;
  } catch (errors) {
    const errorsModified: any = {};
    (errors as any).details.forEach((error: ValidationErrorItem) => {
      const key = error.context?.key;
      if (key) {
        errorsModified[key] = error.message;
      }
    });

    return errorsModified;
  }
};

export { validate };
