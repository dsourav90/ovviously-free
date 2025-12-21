import { render, screen } from '@testing-library/react';
import ChatContainer from './ChatContainer';

describe('ChatContainer', () => {
  test('renders chat container', () => {
    const { container } = render(<ChatContainer />);
    expect(container.querySelector('.chat-container')).toBeInTheDocument();
  });

  test('renders welcome title', () => {
    render(<ChatContainer />);
    expect(screen.getByText(/how can i help you today/i)).toBeInTheDocument();
  });

  test('renders logo component', () => {
    const { container } = render(<ChatContainer />);
    expect(container.querySelector('.logo')).toBeInTheDocument();
  });

  test('renders chat input', () => {
    render(<ChatContainer />);
    expect(screen.getByPlaceholderText(/ask me anything/i)).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(<ChatContainer />);
    expect(screen.getByText(/powered by chatbase/i)).toBeInTheDocument();
  });

  test('has correct structure', () => {
    const { container } = render(<ChatContainer />);
    expect(container.querySelector('.chat-content')).toBeInTheDocument();
    expect(container.querySelector('.chat-welcome')).toBeInTheDocument();
    expect(container.querySelector('.chat-input-wrapper')).toBeInTheDocument();
  });
});
