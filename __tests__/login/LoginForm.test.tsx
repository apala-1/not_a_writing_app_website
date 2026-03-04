import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/app/(auth)/_components/LoginForm";

describe("LoginForm Component", () => {
  it("renders email input", () => {
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    expect(emailInput).toBeInTheDocument();
  });

  it("renders password input", () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<LoginForm />);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const toggleBtn = screen.getByLabelText(/show password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});