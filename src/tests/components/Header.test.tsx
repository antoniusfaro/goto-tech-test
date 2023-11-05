import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../components/organism/Header';

describe('Header', () => {
  test('render header', () => {
    render(
      <MemoryRouter>
        <Header title="Contacts" />
      </MemoryRouter>
    );
    expect(screen.getByText(/Contacts/i)).toBeInTheDocument();
  })

  test('render header with back button', () => {
    render(
      <MemoryRouter>
        <Header title="Contacts" backPath='/' />
      </MemoryRouter>
    );

    expect(screen.getByText(/Contacts/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  })
});