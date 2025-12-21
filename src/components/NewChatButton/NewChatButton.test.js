import { render, screen, fireEvent } from '@testing-library/react';
import NewChatButton from './NewChatButton';

describe('NewChatButton', () => {
  test('renders button with text', () => {
    render(<NewChatButton />);
    expect(screen.getByText(/new chat/i)).toBeInTheDocument();
  });

  test('renders button with icon', () => {
    const { container } = render(<NewChatButton />);
    expect(container.querySelector('.new-chat-icon')).toBeInTheDocument();
  });

  test('button is clickable', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<NewChatButton />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(consoleSpy).toHaveBeenCalledWith('New chat clicked');
    consoleSpy.mockRestore();
  });

  test('has correct CSS class', () => {
    const { container } = render(<NewChatButton />);
    expect(container.querySelector('.new-chat-button')).toBeInTheDocument();
  });
});
