import { render, screen } from '@testing-library/react';
import App from './App';

test('renders risk management dashboard heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Risk Management Dashboard/i);
  expect(headingElement).toBeInTheDocument();
});
