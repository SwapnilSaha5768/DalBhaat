import { render, screen } from '@testing-library/react';

test('renders app placeholder', () => {
  render(<div>DalBhaat App</div>);
  const linkElement = screen.getByText(/DalBhaat App/i);
  expect(linkElement).toBeInTheDocument();
});
