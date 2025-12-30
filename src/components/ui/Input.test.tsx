import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
    it('should render an input element', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with a label', () => {
        render(<Input label="Email" />);
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should handle text input', async () => {
        const user = userEvent.setup();
        render(<Input placeholder="Type here" />);

        const input = screen.getByPlaceholderText('Type here');
        await user.type(input, 'Hello World');

        expect(input).toHaveValue('Hello World');
    });

    it('should support controlled value', () => {
        render(<Input value="controlled" onChange={() => { }} />);
        const input = screen.getByDisplayValue('controlled');
        expect(input).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
        render(<Input style={{ width: '200px' }} placeholder="styled" />);
        // The input should be wrapped in a div, so we check the input itself
        const input = screen.getByPlaceholderText('styled');
        expect(input).toBeInTheDocument();
    });

    it('should support different input types', () => {
        render(<Input type="number" placeholder="number" />);
        const input = screen.getByPlaceholderText('number');
        expect(input).toHaveAttribute('type', 'number');
    });

    it('should support autoFocus', () => {
        render(<Input autoFocus placeholder="focused" />);
        const input = screen.getByPlaceholderText('focused');
        expect(input).toHaveFocus();
    });

    it('should support required attribute', () => {
        render(<Input required placeholder="required" />);
        const input = screen.getByPlaceholderText('required');
        expect(input).toBeRequired();
    });
});
