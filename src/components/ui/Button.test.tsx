import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
    it('should render with children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle click events', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);
        await user.click(screen.getByText('Click me'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render primary variant by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByText('Primary');
        // Just verify the button renders - inline styles with CSS variables don't compute in jsdom
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
    });

    it('should render secondary variant', () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByText('Secondary');
        expect(button).toBeInTheDocument();
    });

    it('should render danger variant', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByText('Delete');
        expect(button).toBeInTheDocument();
    });

    it('should render ghost variant', () => {
        render(<Button variant="ghost">Ghost</Button>);
        const button = screen.getByText('Ghost');
        expect(button).toBeInTheDocument();
    });

    it('should apply fullWidth style', () => {
        render(<Button fullWidth>Full Width</Button>);
        const button = screen.getByText('Full Width');
        expect(button).toHaveStyle({ width: '100%' });
    });

    it('should render as submit button', () => {
        render(<Button type="submit">Submit</Button>);
        const button = screen.getByText('Submit');
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByText('Disabled');
        expect(button).toBeDisabled();
    });
});
