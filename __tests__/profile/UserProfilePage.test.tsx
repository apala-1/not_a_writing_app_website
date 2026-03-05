// __tests__/ConfirmModal.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Inline definition from your page
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  loading = false
}: any) => {
  if (!isOpen) return null;

  return (
    <div data-testid="modal">
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={onClose} disabled={loading}>Cancel</button>
      <button onClick={onConfirm} disabled={loading}>
        {loading ? "Deleting..." : confirmText}
      </button>
    </div>
  );
};

describe("ConfirmModal", () => {
  it("renders correctly when open", () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete Post"
        message="Are you sure?"
      />
    );

    expect(screen.getByText("Delete Post")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("calls onClose and onConfirm when buttons clicked", () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete"
        message="Confirm delete?"
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows loading state correctly", () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete"
        message="Confirm delete?"
        loading={true}
      />
    );

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeDisabled();
    expect(screen.getByText("Deleting...")).toBeDisabled();
  });

  it("does not render when closed", () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Closed"
        message="Should not show"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});