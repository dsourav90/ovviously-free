import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  test('renders footer component', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.chat-footer')).toBeInTheDocument();
  });

  test('displays "Powered by Chatbase" text', () => {
    render(<Footer />);
    expect(screen.getByText(/powered by chatbase/i)).toBeInTheDocument();
  });

  test('renders footer icon', () => {
    const { container } = render(<Footer />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('has correct CSS structure', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-content')).toBeInTheDocument();
  });
});
