import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

describe("LoginPage", () => {
 it("renders LoginForm inside page", () => {
    render(<LoginPage />);

    // check email input
    expect(
      screen.getByPlaceholderText(/you@example.com/i)
    ).toBeInTheDocument();

    // check password input
    expect(
      screen.getByPlaceholderText(/Enter your password/i)
    ).toBeInTheDocument();
  });

  it("renders page heading", () => {
  render(<LoginPage />);
  const heading = screen.getByText(/welcome back/i);
  expect(heading).toBeInTheDocument();
});
});