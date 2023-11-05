import { render, screen, waitFor } from '@testing-library/react';
import Form from '../../pages/Form';
import TestProvider from '../../providers/TestProvider';

describe('Form', () => {
  test('render form without errors', async () => {
    render(
      <TestProvider>
        <Form />
      </TestProvider>
    );
    await waitFor(() => {
      return (
        screen.getByText("Phone Number") &&
        screen.getByText("First Name") &&
        screen.getByText("Last Name")
      )
    })

    const phoneNumber = screen.getByText("Phone Number")
    const firstName = screen.getByText("First Name")
    const lastName = screen.getByText("Last Name")

    expect(phoneNumber).toBeInTheDocument()
    expect(firstName).toBeInTheDocument()
    expect(lastName).toBeInTheDocument()
  })
});
