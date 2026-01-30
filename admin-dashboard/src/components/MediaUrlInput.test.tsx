import { render, screen } from '@testing-library/react';
import MediaUrlInput from './MediaUrlInput';

test('renders MediaUrlInput component', () => {
    render(<MediaUrlInput />);
    const inputElement = screen.getByPlaceholderText(/media url/i);
    expect(inputElement).toBeInTheDocument();
});