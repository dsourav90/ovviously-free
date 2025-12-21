import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders the application layout', () => {
    render(<App />);
    
    // Check if main components are rendered
    expect(screen.getByText(/how can i help you today/i)).toBeInTheDocument();
    expect(screen.getByText(/new chat/i)).toBeInTheDocument();
    expect(screen.getByText(/powered by chatbase/i)).toBeInTheDocument();
  });

  test('renders sidebar and chat container', () => {
    const { container } = render(<App />);
    
    expect(container.querySelector('.sidebar')).toBeInTheDocument();
    expect(container.querySelector('.chat-container')).toBeInTheDocument();
  });
});
