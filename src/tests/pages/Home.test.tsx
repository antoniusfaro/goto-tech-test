import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../pages/Home';
import TestProvider from '../../providers/TestProvider';

describe('Home', () => {
  test('render home without errors', async () => {
    render(
      <TestProvider>
        <Home />
      </TestProvider>
    );

    await waitFor(() => {
      return (
        screen.getByTestId("add-contact-btn") && 
        screen.getByText(/Favorites/i, {selector: "h2"}) &&
        screen.getByText(/Contact List/i, {selector: "h2"})
      )
    });

    const favoriteContact = screen.getByTestId("add-contact-btn");
    const favoriteContactTitle = screen.getByText(/Favorites/i, {selector: "h2"});
    const regularContactTitle = screen.getByText(/Contact List/i, {selector: "h2"});

    expect(favoriteContact).toBeInTheDocument()
    expect(favoriteContactTitle).toBeInTheDocument()
    expect(regularContactTitle).toBeInTheDocument()
  })
});
