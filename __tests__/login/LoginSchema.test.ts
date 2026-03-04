import { loginSchema } from "../../app/(auth)/schema";

describe("Login Schema Validation", () => {

  // ✅ Valid case
  it("passes with valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  // ❌ Empty email
  it("fails when email is empty", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "123456",
    });

    expect(result.success).toBe(false);
  });

  // ❌ Invalid email format
  it("fails with invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "notanemail",
      password: "123456",
    });

    expect(result.success).toBe(false);
  });

  // ❌ Empty password
  it("fails when password is empty", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  // ❌ Password too short (if min is 6)
  it("fails when password is too short", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  // ❌ Both fields empty
  it("fails when both email and password are empty", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  // ❌ Email with only spaces
  it("fails when email is only spaces", () => {
    const result = loginSchema.safeParse({
      email: "   ",
      password: "123456",
    });

    expect(result.success).toBe(false);
  });

  // ❌ Password with only spaces
  it("fails when password is only spaces", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "     ",
    });

    expect(result.success).toBe(false);
  });

  // ✅ Email with uppercase
  it("passes with uppercase email", () => {
    const result = loginSchema.safeParse({
      email: "TEST@EXAMPLE.COM",
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  // ❌ Missing fields entirely
  it("fails when fields are missing", () => {
    const result = loginSchema.safeParse({});

    expect(result.success).toBe(false);
  });

});