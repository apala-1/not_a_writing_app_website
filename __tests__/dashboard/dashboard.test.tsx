// __tests__/dashboard/Dashboard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "@/app/user/dashboard/page"; // adjust path to your Dashboard file

// Mock the child tab components so tests stay isolated
jest.mock("@/app/user/_components/FeedTab", () => () => <div>FeedTab Mock</div>);
jest.mock("@/app/user/_components/BooksTab", () => () => <div>BooksTab Mock</div>);
jest.mock("@/app/user/_components/ExploreTab", () => () => <div>ExploreTab Mock</div>);
jest.mock("@/app/user/_components/CreateBookTab", () => () => <div>Create Your Masterpiece</div>);

describe("Dashboard Page", () => {
  beforeEach(() => {
    render(<Dashboard />);
  });

  it("renders all sidebar tabs", () => {
    expect(screen.getByText("Feed")).toBeInTheDocument();
    expect(screen.getByText("My Books")).toBeInTheDocument();
    expect(screen.getByText("Explore Books")).toBeInTheDocument();
    expect(screen.getByText("Create Book")).toBeInTheDocument();
  });

  it("shows FeedTab by default", () => {
    expect(screen.getByText("FeedTab Mock")).toBeInTheDocument();
  });

  it("switches to Books tab when clicked", () => {
    fireEvent.click(screen.getByText("My Books"));
    expect(screen.getByText("BooksTab Mock")).toBeInTheDocument();
  });

  it("switches to Explore tab when clicked", () => {
    fireEvent.click(screen.getByText("Explore Books"));
    expect(screen.getByText("ExploreTab Mock")).toBeInTheDocument();
  });

  it("switches to Create tab when clicked", () => {
    fireEvent.click(screen.getByText("Create Book"));
    expect(screen.getByText("Create Your Masterpiece")).toBeInTheDocument();
  });

  it("applies active class to clicked tab and removes from previous", () => {
    const feedButton = screen.getByText("Feed").closest("button");
    const booksButton = screen.getByText("My Books").closest("button");

    // Feed is active by default
    expect(feedButton).toHaveClass("shadow-lg");

    fireEvent.click(booksButton!);
    expect(booksButton).toHaveClass("shadow-lg");
    expect(feedButton).not.toHaveClass("shadow-lg");
  });

  it("renders sidebar title and subtitle", () => {
    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.getByText("Main Menu")).toBeInTheDocument();
  });

  it("renders New Feature box in sidebar", () => {
    expect(screen.getByText("New Feature!")).toBeInTheDocument();
    expect(screen.getByText(/Try our AI-powered book recommendations/i)).toBeInTheDocument();
  });

  it("renders main content area even when no tab is clicked", () => {
    expect(screen.getByText("FeedTab Mock")).toBeInTheDocument();
  });
});