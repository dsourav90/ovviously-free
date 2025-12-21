import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  test('renders sidebar component', () => {
    const { container } = render(<Sidebar />);
    expect(container.querySelector('.sidebar')).toBeInTheDocument();
  });

  test('renders sidebar toggle button', () => {
    const { container } = render(<Sidebar />);
    expect(container.querySelector('.sidebar-toggle')).toBeInTheDocument();
  });

  test('renders new chat button', () => {
    render(<Sidebar />);
    expect(screen.getByText(/new chat/i)).toBeInTheDocument();
  });

  test('has correct structure', () => {
    const { container } = render(<Sidebar />);
    expect(container.querySelector('.sidebar-header')).toBeInTheDocument();
    expect(container.querySelector('.sidebar-content')).toBeInTheDocument();
  });
});
