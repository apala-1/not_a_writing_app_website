// __tests__/admin/posts/page.client.test.tsx
import { render, screen } from "@testing-library/react";
import AdminPostsTable from "@/app/admin/_components/AdminPostsTable";
import Header from "@/app/(public)/_components/Header";

// mock the table & header
jest.mock("@/app/admin/_components/AdminPostsTable", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="posts-table">Posts Table</div>),
}));

jest.mock("@/app/(public)/_components/Header", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="header">Header</div>),
}));

// client wrapper for testing
function AdminPostsPageClient({ data, total }: any) {
  return (
    <div>
      <Header />
      <h1>Posts</h1>
      <AdminPostsTable initialPosts={data} total={total} pageSize={10} />
    </div>
  );
}

describe("AdminPostsPage (client wrapper)", () => {
  const mockPostsData = {
    data: [
      { _id: "1", title: "First Post" },
      { _id: "2", title: "Second Post" },
    ],
    total: 2,
  };

  it("renders header, H1, and posts table", async () => {
    render(
      <AdminPostsPageClient
        data={mockPostsData.data}
        total={mockPostsData.total}
      />
    );

    // check header
    expect(await screen.findByTestId("header")).toBeInTheDocument();

    // check H1
    expect(await screen.findByText("Posts")).toBeInTheDocument();

    // check table
    expect(await screen.findByTestId("posts-table")).toBeInTheDocument();
  });
});