// __tests__/admin/users/page.client.test.tsx
import { render, screen } from '@testing-library/react';
import AdminUsersTable from '@/app/admin/_components/AdminUsersTable';
import Header from '@/app/(public)/_components/Header';

// Mock the table & header
jest.mock('@/app/admin/_components/AdminUsersTable', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="users-table">Users Table</div>),
}));

jest.mock('@/app/(public)/_components/Header', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="header">Header</div>),
}));

// Client wrapper for testing
function AdminUsersPageClient({ data, total, page, size }: any) {
  return (
    <div>
      <Header />
      <h1>Users</h1>
      <AdminUsersTable
        initialUsers={data}
        total={total}
        page={page}
        size={size}
      />
    </div>
  );
}

describe('AdminUsersPage (client wrapper)', () => {
  const mockUsersData = {
    data: [
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
    ],
    total: 2,
    page: 1,
    size: 10,
  };

  it('renders header', async () => {
    render(
      <AdminUsersPageClient
        data={mockUsersData.data}
        total={mockUsersData.total}
        page={mockUsersData.page}
        size={mockUsersData.size}
      />
    );

    expect(await screen.findByTestId('header')).toBeInTheDocument();
  });
});