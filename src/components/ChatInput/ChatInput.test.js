import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from './ChatInput';

describe('ChatInput', () => {
  test('renders input field', () => {
    render(<ChatInput onSendMessage={jest.fn()} />);
    expect(screen.getByPlaceholderText(/ask me anything/i)).toBeInTheDocument();
  });

  test('renders emoji button', () => {
    const { container } = render(<ChatInput onSendMessage={jest.fn()} />);
    expect(container.querySelector('.emoji-button')).toBeInTheDocument();
  });

  test('renders send button', () => {
    const { container } = render(<ChatInput onSendMessage={jest.fn()} />);
    expect(container.querySelector('.send-button')).toBeInTheDocument();
  });

  test('send button is disabled when input is empty', () => {
    const { container } = render(<ChatInput onSendMessage={jest.fn()} />);
    const sendButton = container.querySelector('.send-button');
    expect(sendButton).toBeDisabled();
  });

  test('send button is enabled when input has text', async () => {
    const user = userEvent.setup();
    const { container } = render(<ChatInput onSendMessage={jest.fn()} />);
    const input = screen.getByPlaceholderText(/ask me anything/i);
    const sendButton = container.querySelector('.send-button');
    
    await user.type(input, 'Hello');
    
    expect(sendButton).not.toBeDisabled();
  });

  test('calls onSendMessage when form is submitted', async () => {
    const user = userEvent.setup();
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText(/ask me anything/i);
    await user.type(input, 'Test message');
    
    const form = input.closest('form');
    fireEvent.submit(form);
    
    expect(mockSendMessage).toHaveBeenCalledWith('Test message');
  });

  test('clears input after sending message', async () => {
    const user = userEvent.setup();
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText(/ask me anything/i);
    await user.type(input, 'Test message');
    
    const form = input.closest('form');
    fireEvent.submit(form);
    
    expect(input.value).toBe('');
  });

  test('does not send empty messages', () => {
    const mockSendMessage = jest.fn();
    const { container } = render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const form = container.querySelector('form');
    fireEvent.submit(form);
    
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  test('handles Enter key to submit', async () => {
    const user = userEvent.setup();
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText(/ask me anything/i);
    await user.type(input, 'Test message{Enter}');
    
    expect(mockSendMessage).toHaveBeenCalledWith('Test message');
  });

  test('does not submit on Shift+Enter', async () => {
    const user = userEvent.setup();
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText(/ask me anything/i);
    await user.type(input, 'Test message');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
