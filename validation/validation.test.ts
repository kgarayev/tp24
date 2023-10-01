import { validate } from "./index";

// testing validate function
describe("validate function", () => {
  // addReceivable" payload
  it("should validate addReceivable payload correctly", async () => {
    const validPayload = {
      reference: "test",
      currencyCode: "test",
      issueDate: "2023-09-30",
      openingValue: 1000,
      paidValue: 1000,
      dueDate: "2023-10-30",
      debtorName: "test",
      debtorReference: "test",
      debtorCountryCode: "test",
    };

    // Validate the payload
    const errors = await validate(validPayload, "addReceivable");

    // If the payload is valid, "errors" should be null
    expect(errors).toBeNull();

    // invalid payload
    const invalidPayload = {
      reference: "a".repeat(300),
      debtorName: "test",
      debtorReference: "test",
      debtorCountryCode: "test",
    };

    // Validate the invalid payload
    const invalidErrors = await validate(invalidPayload, "addReceivable");

    expect(invalidErrors.reference).toBeDefined();
  });

  // updateReceivable
  it("should validate updateReceivable payload correctly", async () => {
    const validPayload = {
      reference: "test",
      currencyCode: "test",
      issueDate: "2023-09-30",
      debtorCountryCode: "test",
    };

    // valid update payload
    const errors = await validate(validPayload, "updateReceivable");

    expect(errors).toBeNull();

    const invalidPayload = {
      reference: "a".repeat(300),
    };

    // Validate the invalid payload
    const invalidErrors = await validate(invalidPayload, "updateReceivable");

    // Expect an error
    expect(invalidErrors.reference).toBeDefined();
  });

  it("should return errors for invalid type", async () => {
    const payload = {
      reference: "testReference",
    };

    const errors = await validate(payload, "invalidType");

    // Expect there to be some error
    expect(errors).toBeDefined();
  });
});
