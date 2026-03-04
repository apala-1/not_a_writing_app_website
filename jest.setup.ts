import "@testing-library/jest-dom"; // adds matchers like .toBeInTheDocument()

// Mock Next.js router globally
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    pathname: "/",
  })),
}));