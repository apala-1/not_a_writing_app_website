// jest.setup.ts

// 1. Silence styled-jsx "global" and "jsx" warnings
// jest.setup.ts
// jest.setup.ts
const originalError = console.error;

console.error = (...args: any[]) => {
  const combined = args
    .map(arg => {
      if (typeof arg === "string") return arg;
      if (arg && typeof arg === "object") return JSON.stringify(arg);
      return "";
    })
    .join(" ");

  if (combined.includes("non-boolean attribute `jsx`") || combined.includes("non-boolean attribute `global`")) {
    return; // ignore these warnings
  }

  originalError(...args);
};

// 2. Import jest-dom for extended matchers
import "@testing-library/jest-dom";

// 3. Optional: Silence console.log during tests (if you want really clean output)
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});
afterAll(() => {
  jest.restoreAllMocks();
});

// 4. Mock Next.js router globally
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

// 5. Mock styled-jsx style component
jest.mock("styled-jsx/style", () => ({
  __esModule: true,
  default: () => null, // don't render <style jsx> in tests
}));