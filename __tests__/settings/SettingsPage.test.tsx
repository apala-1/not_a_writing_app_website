// __tests__/SettingsPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from '@/lib/api/axios';
import SettingsPage from '@/app/user/settings/page';

// Mock axios
jest.mock('@/lib/api/axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

// Mock token clearing
jest.mock('@/lib/auth/storage', () => ({
  clearToken: jest.fn(),
}));

test('renders loading first, then user settings', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: { success: true, data: { email: 'test@example.com' } },
  });

  render(<SettingsPage />);

  // Loading state
  expect(screen.getByText(/loading settings/i)).toBeInTheDocument();

  // Wait for user to load
  await waitFor(() => {
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });
});

test('updates email successfully', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: { success: true, data: { email: 'test@example.com' } },
  });
  mockedAxios.put.mockResolvedValueOnce({
    data: { success: true },
  });

  render(<SettingsPage />);

  await waitFor(() => screen.getByDisplayValue('test@example.com'));

  const input = screen.getByDisplayValue('test@example.com');
  fireEvent.change(input, { target: { value: 'new@example.com' } });

  const saveButton = screen.getByRole('button', { name: /save/i });
  fireEvent.click(saveButton);

  await waitFor(() =>
    expect(screen.getByText(/email updated successfully/i)).toBeInTheDocument()
  );
});

test('toggles theme', async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: { success: true, data: { email: 'test@example.com' } },
  });

  render(<SettingsPage />);
  await waitFor(() => screen.getByDisplayValue('test@example.com'));

  const toggleButton = screen.getByRole('button', { name: /switch to dark/i });
  fireEvent.click(toggleButton);

  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(screen.getByText(/currently: dark mode/i)).toBeInTheDocument();
});