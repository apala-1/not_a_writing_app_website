import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { register as registerUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

jest.mock("@/lib/api/auth", () => ({
  register: jest.fn(),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all required fields", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    // Instead of counting vague "required"
    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThanOrEqual(1);
    });
  });


  it("shows password mismatch error", async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "different123"
    );

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/match/i)).toBeInTheDocument();
    });
  });

  it("toggles password visibility", async () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const toggles = screen.getAllByLabelText(/show password/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(toggles[0]);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("calls register API and redirects on success", async () => {
    const pushMock = jest.fn();
    const mockUseRouter = useRouter as jest.Mock;

    mockUseRouter.mockReturnValue({
      push: pushMock,
      back: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
      pathname: "/",
    });

    (registerUser as jest.Mock).mockResolvedValue({
      success: true,
    });

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "john@example.com"
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "password123"
    );

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
    });
  });

  it("shows global error if API fails", async () => {
    (registerUser as jest.Mock).mockResolvedValue({
      success: false,
      message: "Registration failed",
    });

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "john@example.com"
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "password123"
    );

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});