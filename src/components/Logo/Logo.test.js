import { render } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
  test('renders logo component', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('.logo')).toBeInTheDocument();
  });

  test('renders SVG element', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('SVG has correct dimensions', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '64');
    expect(svg).toHaveAttribute('height', '64');
  });

  test('SVG has correct viewBox', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
  });
});
