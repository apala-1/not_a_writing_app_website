import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import "@testing-library/jest-dom";

// Mock Next.js special components
jest.mock('next/script', () => ({ children }: any) => <>{children}</>);
jest.mock('next/image', () => (props: any) => <img {...props} />);
jest.mock('next/link', () => ({ children }: any) => <>{children}</>);

describe("LoginPage", () => {
  it("renders LoginForm inside page", () => {
    render(<LoginPage />);

    // check email input
    expect(
      screen.getByPlaceholderText(/you@example.com/i)
    ).toBeInTheDocument();

    // check password input
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument();
  });

  it("renders main heading", () => {
    render(<LoginPage />);
    
    // match the main h1 heading specifically
    const heading = screen.getByText(/welcome back to/i);
    expect(heading).toBeInTheDocument();
  });
});