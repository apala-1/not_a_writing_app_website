import "@testing-library/jest-dom";

// -----------------------------
// Mock Next.js App Router
// -----------------------------
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    pathname: "/",
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// -----------------------------
// Mock styled-jsx
// -----------------------------
jest.mock("styled-jsx/style", () => {
  return {
    __esModule: true,
    default: () => null,
  };
});

// -----------------------------
// Silence styled-jsx "global" warning
// -----------------------------
const originalError = console.error;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("non-boolean attribute `global`")
    ) {
      return;
    }
    originalError(...args);
  };
});