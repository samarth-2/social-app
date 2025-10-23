import { render, screen } from '@testing-library/react';

test('testing environment sanity', () => {
  render(<div>client test environment</div>);
  expect(screen.getByText(/client test environment/i)).toBeInTheDocument();
});
